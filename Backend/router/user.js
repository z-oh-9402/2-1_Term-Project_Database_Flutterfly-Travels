const router = require("express-promise-router")();
const database = require('../database');
const bcrypt = require('bcryptjs');
const { deleting } = require('../file_handling');
const { signToken, requireAuth, requireSelfOrAdmin } = require('../auth');

// router.get('/fetch-notification/:id', async (req, res) => {
//     const query = `BEGIN 
//                    FETCH_NOTIFICATION(:id, :cursor); 
//                    END;`;

//     const binds = {
//         id: req.params.id,
//         cursor: { type: database.oracledb.CURSOR, dir: database.oracledb.BIND_OUT }
//     };

//     const result = await database.query2(query, binds);

//     const resultSet = await result.cursor.getRows();
//     await result.cursor.close();

//     res.status(200).json(resultSet);
// });

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
