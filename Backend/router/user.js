const router = require("express-promise-router")();
const database = require('../database');
const bcrypt = require('bcryptjs');
const { deleting } = require('../file_handling');
const { signToken, requireAuth, requireSelfOrAdmin } = require('../auth');
const { emitToUser } = require('../realtime');

// The logged-in user's most recent notifications, newest first (the triggers create them)
router.get('/notifications', requireAuth, async (req, res) => {
    const query = `SELECT NOTIFICATION_ID, CONTENT, CREATED_AT, NOTIFICATION_STATUS
                   FROM NOTIFICATION
                   WHERE USER_ID = $1
                   ORDER BY CREATED_AT DESC, NOTIFICATION_ID DESC
                   LIMIT 30`;
    const result = await database.query(query, [req.user.id]);

    res.status(200).json(result);
});

// Marks all of the logged-in user's unseen notifications as seen
router.put('/notifications/seen', requireAuth, async (req, res) => {
    const query = `UPDATE NOTIFICATION
                   SET NOTIFICATION_STATUS = 'SHOWED'
                   WHERE USER_ID = $1 AND NOTIFICATION_STATUS = 'NOT SHOWED'`;
    await database.query(query, [req.user.id]);

    // Clear the unread badge in the user's other open tabs too
    emitToUser(req.user.id, 'notifications-seen');

    res.status(200).json({ status: "ok" });
});

router.post("/login",async(req,res)=>{
    const { username, password } = req.body;

    const query = `SELECT *
                   FROM Users
                   WHERE USERNAME=$1`;
    const params = [username];
    const ans = await database.query(query,params);

    let result = {
        status: 0,
        data: undefined
    }

    const passwordsMatch = ans.length !== 0 && await bcrypt.compare(password || "", ans[0].password);
    if (passwordsMatch) {
        delete ans[0].password;
        result.data = ans[0];
        result.status = 1;
        result.token = signToken(ans[0]);
    }

    res.status(200).json(result);
});

router.get("/:username",async(req,res)=>{
    const params = [req.params.username]
    const query = `SELECT CHECK_USERNAME($1)`;
    const ans = await database.query(query,params);

    let result = {
        status: ans[0].check_username
    }

    res.status(200).json(result);
});

router.delete("/:userId", requireAuth, requireSelfOrAdmin(req => req.params.userId), async(req,res)=>{
    let query = `SELECT PHOTO
                FROM Users
                WHERE USER_ID = $1`;
    const params = [req.params.userId];
    const user = await database.query(query,params);

    query = `DELETE FROM Users 
                   WHERE USER_ID = $1`;
    await database.query(query,params);

    // Remove the profile picture once the user is gone
    user.length!==0 && user[0].photo && deleting("uploads/"+user[0].photo);

    res.status(200).json({
        status: "ok"
    });
});

module.exports = router;
