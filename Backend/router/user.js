const router = require("express-promise-router")();
const database = require('../database');
const bcrypt = require('bcryptjs');

router.get('/fetch-notification/:id', async (req, res) => {
    const query = `BEGIN 
                   FETCH_NOTIFICATION(:id, :cursor); 
                   END;`;

    const binds = {
        id: req.params.id,
        cursor: { type: database.oracledb.CURSOR, dir: database.oracledb.BIND_OUT }
    };

    const result = await database.query2(query, binds);

    const resultSet = await result.cursor.getRows();
    await result.cursor.close();

    res.status(200).json(resultSet);
});

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
    const hashedPassword = ans[0].PASSWORD;

    const passwordsMatch = await bcrypt.compare(plaintextPassword, hashedPassword);
    if (!passwordsMatch) {
        result.status = 0
    } 
    else {
        ans[0].PASSWORD = req.params.password;
        result.data = ans[0];
        result.status = 1;
    }

    res.status(200).json(result);
});

router.get("/:username",async(req,res)=>{
    const oracledb = database.oracledb;
    const query = 
     `BEGIN
        :ret := CHECK_USERNAME(:username);
      END;`;

    const binds = {
      ret: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      username: req.params.username ,
    };
    const ans = await database.query2(query,binds);

    let result = {
        status: -1,
    }

    result.status = ans.ret;

    res.status(200).json(result);
});

module.exports = router;