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
        pushNotification(Number(message.payload)).catch((error) => {
            console.error('Could not push notification:', error.message);
        });
    });

    try {
        await client.connect();
        await client.query('LISTEN notification_created');
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
    });

    listenForNotifications();
}

exports.attach = attach;
exports.emitToUser = emitToUser;
