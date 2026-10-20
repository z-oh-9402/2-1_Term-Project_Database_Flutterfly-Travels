const router = require("express-promise-router")();
const database = require('../database');
const { requireAuth, requireRole } = require('../auth');
const { upload, savePhoto, deletePhoto } = require('../file_handling');
const { emitToUser } = require('../realtime');

// Chat between customers and agents (admins take no part). Who may message whom is decided in the database
// (CAN_MESSAGE, enforced by the check_message_allowed trigger), so these routes only ask it.
router.use(requireAuth, requireRole('customer', 'agent'));

const MESSAGE_COLUMNS = `M.MESSAGE_ID, M.CONVERSATION_ID, M.SENDER_ID, M.CONTENT, M.IMAGE, M.CREATED_AT, M.SEEN_AT`;
const MAX_LENGTH = 4000;
// messages sent per request; older ones come with ?before=<oldest message id shown>
const PAGE_SIZE = 50;

// A user others may see in a chat, by username (never an admin), or null
const findUser = async (username) => {
    const rows = await database.query(
        `SELECT U.USER_ID, U.USERNAME, U.FIRST_NAME, U.LAST_NAME, U.PHOTO, U.USER_TYPE, A.EXPERIENCE_YEARS, A.FEE
         FROM USERS U LEFT JOIN AGENT A ON A.AGENT_ID = U.USER_ID
         WHERE U.USERNAME = $1 AND U.USER_TYPE <> 'admin'`, [username]);
    return rows[0] ?? null;
}

const canMessage = async (sender, receiver) =>
    (await database.query(`SELECT CAN_MESSAGE($1, $2) AS ALLOWED`, [sender, receiver]))[0].allowed;

const conversationBetween = async (me, other) => {
    const rows = await database.query(
        `SELECT CONVERSATION_ID FROM CONVERSATION WHERE USER_A = LEAST($1::int, $2::int) AND USER_B = GREATEST($1::int, $2::int)`, [me, other]);
    return rows[0]?.conversation_id ?? null;
}

// The user's conversations, newest first, each with the other person, its last message and how many are unread
router.get('/conversations', async (req, res) => {
    const query = `SELECT C.CONVERSATION_ID, C.LAST_MESSAGE_AT,
                          U.USER_ID, U.USERNAME, U.FIRST_NAME, U.LAST_NAME, U.PHOTO, U.USER_TYPE,
                          L.CONTENT AS LAST_CONTENT, L.IMAGE AS LAST_IMAGE, L.SENDER_ID AS LAST_SENDER_ID,
                          (SELECT COUNT(*) FROM MESSAGE X
                           WHERE X.CONVERSATION_ID = C.CONVERSATION_ID AND X.SENDER_ID <> $1 AND X.SEEN_AT IS NULL)::int AS UNREAD,
                          CAN_MESSAGE($1, U.USER_ID) AS CAN_SEND
                   FROM CONVERSATION C
                   JOIN USERS U ON U.USER_ID = CASE WHEN C.USER_A = $1 THEN C.USER_B ELSE C.USER_A END
                   LEFT JOIN LATERAL (SELECT * FROM MESSAGE M WHERE M.CONVERSATION_ID = C.CONVERSATION_ID
                                      ORDER BY M.MESSAGE_ID DESC LIMIT 1) L ON TRUE
                   WHERE $1 IN (C.USER_A, C.USER_B) AND C.LAST_MESSAGE_AT IS NOT NULL
                   ORDER BY C.LAST_MESSAGE_AT DESC`;
    res.json(await database.query(query, [req.user.id]));
});

// How many messages wait unread, for the badge on the navbar's chat icon
router.get('/unread', async (req, res) => {
    const rows = await database.query(
        `SELECT COUNT(*)::int AS COUNT
         FROM MESSAGE M JOIN CONVERSATION C ON C.CONVERSATION_ID = M.CONVERSATION_ID
         WHERE $1 IN (C.USER_A, C.USER_B) AND M.SENDER_ID <> $1 AND M.SEEN_AT IS NULL`, [req.user.id]);
    res.json(rows[0]);
});

// People the user may start a chat with, found by username or name
router.get('/people', async (req, res) => {
    const search = String(req.query.q ?? '').trim().slice(0, 100);
    const pattern = '%' + search.replace(/[\\%_]/g, (c) => '\\' + c) + '%';
    const query = `SELECT U.USER_ID, U.USERNAME, U.FIRST_NAME, U.LAST_NAME, U.PHOTO, U.USER_TYPE
                   FROM USERS U
                   WHERE U.USER_ID <> $1 AND U.USER_TYPE <> 'admin'
                     AND (U.USERNAME ILIKE $2 OR (COALESCE(U.FIRST_NAME, '') || ' ' || COALESCE(U.LAST_NAME, '')) ILIKE $2)
                     AND CAN_MESSAGE($1, U.USER_ID)
                   ORDER BY U.USERNAME
                   LIMIT 20`;
    res.json(await database.query(query, [req.user.id, pattern]));
});

// One conversation: the other person, whether the user may write to them now, and its latest messages (oldest first),
// or with ?before=<message id> the ones just before that. hasMore says whether even older ones exist.
router.get('/with/:username', async (req, res) => {
    const before = req.query.before;
    if(before !== undefined && !/^\d+$/.test(String(before)))
    {
        res.status(400).json({message: "Invalid message id"});
        return;
    }
    const other = await findUser(req.params.username);
    if(!other || other.user_id === req.user.id)
    {
        res.status(404).json({message: "User not found"});
        return;
    }
    const conversationId = await conversationBetween(req.user.id, other.user_id);
    const canSend = await canMessage(req.user.id, other.user_id);
    if(conversationId === null && !canSend)
    {
        res.status(403).json({message: "You can't send messages to this person"});
        return;
    }

    // one more than a page, to know whether there are older ones
    const rows = conversationId === null ? [] : await database.query(
        `SELECT * FROM (SELECT ${MESSAGE_COLUMNS} FROM MESSAGE M
                        WHERE M.CONVERSATION_ID = $1 AND ($2::int IS NULL OR M.MESSAGE_ID < $2::int)
                        ORDER BY M.MESSAGE_ID DESC LIMIT $3) PAGE
         ORDER BY MESSAGE_ID`, [conversationId, before ?? null, PAGE_SIZE + 1]);
    const hasMore = rows.length > PAGE_SIZE;
    res.json({ user: other, canSend, conversationId, messages: hasMore ? rows.slice(1) : rows, hasMore });
});

// Sends a message (text, a photo, or both). The conversation is created with the first one.
router.post('/with/:username', upload.single('file'), async (req, res) => {
    const content = typeof req.body.content === 'string' ? req.body.content.trim() : '';
    if(content === '' && !req.file)
    {
        res.status(400).json({message: "Write a message or attach a photo"});
        return;
    }
    if(content.length > MAX_LENGTH)
    {
        res.status(400).json({message: `A message can have at most ${MAX_LENGTH} characters`});
        return;
    }
    const other = await findUser(req.params.username);
    if(!other || other.user_id === req.user.id)
    {
        res.status(404).json({message: "User not found"});
        return;
    }
    if(!(await canMessage(req.user.id, other.user_id)))
    {
        res.status(403).json({message: "You can't send messages to this person"});
        return;
    }

    const image = req.file ? await savePhoto(req.file) : null;
    try
    {
        const message = await database.transaction(async (client) => {
            const found = await client.query(`SELECT GET_CONVERSATION_ID($1, $2) AS ID`, [req.user.id, other.user_id]);
            const rows = await client.query(
                `INSERT INTO MESSAGE AS M (CONVERSATION_ID, SENDER_ID, CONTENT, IMAGE)
                 VALUES ($1, $2, $3, $4)
                 RETURNING ${MESSAGE_COLUMNS}`, [found.rows[0].id, req.user.id, content || null, image]);
            return rows.rows[0];
        });
        res.status(200).json(message);
    }
    catch(error)
    {
        deletePhoto(image);
        // refused by the check_message_allowed trigger
        if(error.code === '42501')
        {
            res.status(403).json({message: "You can't send messages to this person"});
            return;
        }
        throw error;
    }
});

// The user opened the conversation: everything the other person sent is now seen, and they are told
router.put('/with/:username/seen', async (req, res) => {
    const other = await findUser(req.params.username);
    const conversationId = other ? await conversationBetween(req.user.id, other.user_id) : null;
    if(conversationId === null)
    {
        res.status(200).json({ seen: 0 });
        return;
    }
    const rows = await database.query(
        `UPDATE MESSAGE SET SEEN_AT = CURRENT_TIMESTAMP
         WHERE CONVERSATION_ID = $1 AND SENDER_ID <> $2 AND SEEN_AT IS NULL
         RETURNING MESSAGE_ID`, [conversationId, req.user.id]);
    if(rows.length !== 0)
    {
        const update = { conversationId, by: req.user.id, upTo: Math.max(...rows.map(row => row.message_id)) };
        emitToUser(other.user_id, 'chat-seen', update);
        // the user's other tabs update their unread counts too
        emitToUser(req.user.id, 'chat-seen', update);
    }
    res.status(200).json({ seen: rows.length });
});

module.exports = router;
