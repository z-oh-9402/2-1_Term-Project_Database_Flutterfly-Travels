const { Server } = require('socket.io');
const { Client } = require('pg');
const database = require('./database');
const { verifyToken } = require('./auth');

const RETRY_DELAY_MS = 5000;

let io = null;

const userRoom = (userId) => `user:${userId}`;

// Sends an event to every open tab of one user
const emitToUser = (userId, event, data) => {
    if (io) {
        io.to(userRoom(userId)).emit(event, data);
    }
}

const pushNotification = async (notificationId) => {
    const query = `SELECT NOTIFICATION_ID, USER_ID, CONTENT, CREATED_AT, NOTIFICATION_STATUS
                   FROM NOTIFICATION
                   WHERE NOTIFICATION_ID = $1`;
    const rows = await database.query(query, [notificationId]);
    if (rows.length !== 0) {
        const { user_id, ...notification } = rows[0];
        emitToUser(user_id, 'notification', notification);
    }
}

// A new chat message goes to every open tab of both people in the conversation
const pushMessage = async (messageId) => {
    const query = `SELECT M.MESSAGE_ID, M.CONVERSATION_ID, M.SENDER_ID, M.CONTENT, M.IMAGE, M.CREATED_AT, M.SEEN_AT, C.USER_A, C.USER_B
                   FROM MESSAGE M JOIN CONVERSATION C ON C.CONVERSATION_ID = M.CONVERSATION_ID
                   WHERE M.MESSAGE_ID = $1`;
    const rows = await database.query(query, [messageId]);
    if (rows.length !== 0) {
        const { user_a, user_b, ...message } = rows[0];
        emitToUser(user_a, 'chat-message', message);
        emitToUser(user_b, 'chat-message', message);
    }
}

// Keeps a LISTEN connection open, reconnecting if the database connection drops
const listenForNotifications = async () => {
    const client = new Client(database.config);

    let retryScheduled = false;
    const retry = () => {
        if (!retryScheduled) {
            retryScheduled = true;
            console.log(`Notification listener disconnected, reconnecting in ${RETRY_DELAY_MS / 1000}s...`);
            setTimeout(listenForNotifications, RETRY_DELAY_MS);
        }
    }

    client.on('error', (error) => {
        console.error('Notification listener error:', error.message);
        retry();
    });
    client.on('end', retry);
    client.on('notification', (message) => {
        const push = message.channel === 'message_created' ? pushMessage : pushNotification;
        push(Number(message.payload)).catch((error) => {
            console.error(`Could not push ${message.channel}:`, error.message);
        });
    });

    try {
        await client.connect();
        await client.query('LISTEN notification_created');
        await client.query('LISTEN message_created');
        // Anything created while the listener was down was never pushed, so tell open tabs to reload their list
        io.emit('notifications-resync');
    }
    catch (error) {
        console.error('Notification listener could not connect:', error.message);
        client.end().catch(() => {});
        retry();
    }
}

// Starts socket.io on the backend's HTTP server, and the database listener
const attach = (httpServer) => {
    io = new Server(httpServer, { cors: { origin: '*' } });

    // Only logged-in users can connect (same JWT as the API); each joins a room for their own user id
    io.use((socket, next) => {
        const user = verifyToken(socket.handshake.auth.token);
        if (!user) {
            next(new Error('Unauthorized'));
            return;
        }
        socket.data.user = user;
        next();
    });

    io.on('connection', (socket) => {
        socket.join(userRoom(socket.data.user.id));

        // "typing..." in a chat: passed on to the other person (if this user may message them), never stored
        socket.on('chat-typing', async (data) => {
            const to = Number(data && data.to);
            const from = socket.data.user.id;
            if (!Number.isInteger(to) || to <= 0) {
                return;
            }
            try {
                const rows = await database.query(`SELECT CAN_MESSAGE($1, $2) AS ALLOWED`, [from, to]);
                if (rows[0].allowed) {
                    emitToUser(to, 'chat-typing', { from });
                }
            }
            catch (error) {
                console.error('Could not pass on typing:', error.message);
            }
        });
    });

    listenForNotifications();
}

exports.attach = attach;
exports.emitToUser = emitToUser;
