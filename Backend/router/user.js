const router = require("express-promise-router")();
const database = require('../database');
const bcrypt = require('bcryptjs');
const { deleting } = require('../file_handling');

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

router.get("/:username/:password",async(req,res)=>{
    const query = `SELECT *
                   FROM Users
                   WHERE USERNAME='${req.params.username}'`;
    const params = [];
    const ans = await database.query(query,params);

    let result = {
        status: 0,
        data: undefined
    }

    const plaintextPassword = req.params.password;
    const hashedPassword = ans[0].password;

    const passwordsMatch = await bcrypt.compare(plaintextPassword, hashedPassword);
    if (!passwordsMatch) {
        result.status = 0
    } 
    else {
        ans[0].password = req.params.password;
        result.data = ans[0];
        result.status = 1;
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

router.delete("/:userId",async(req,res)=>{
    let query = `SELECT PHOTO
                FROM Users
                WHERE USER_ID = ${req.params.userId}`;
    let params = [];
    const user = await database.query(query,params);

    user[0].photo.length && deleting("uploads/"+user[0].photo);

    query = `DELETE FROM Users 
                   WHERE USER_ID = ${req.params.userId}`;
    await database.query(query,params);

    await database.query('commit',params);

    res.status(200).json({
        status: "ok"
    });
});

module.exports = router;