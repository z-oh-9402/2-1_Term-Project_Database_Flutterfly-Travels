const router = require("express-promise-router")();
const database = require('../database');
const bcrypt = require('bcryptjs');

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
    const query = `
      BEGIN
        :ret := CHECK_USERNAME(:username);
      END;
    `;

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