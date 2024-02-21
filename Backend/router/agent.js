const router = require("express-promise-router")();
const database = require('../database');
const bcrypt = require('bcryptjs');

router.get("/pending-agents",async(req,res)=>{
    console.log("Hello");
    const query = `SELECT *
                   FROM Agent 
                   WHERE ACC_STATUS = 'PENDING'`;
    const params = [];
    const ans = await database.query(query,params);

    res.status(200).json(ans);
});

router.get("/:agentId",async(req,res)=>{
    const query = `SELECT *
                   FROM Agent 
                   WHERE AGENT_ID=${req.params.agentId}`;
    const params = [];
    const ans = await database.query(query,params);

    res.status(200).json(ans[0]);
});

router.post("/",async(req,res)=>{
    const user = req.body;

    const plaintextPassword = user.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plaintextPassword, salt);

    const query = `INSERT INTO Users (USERNAME, PASSWORD, FIRST_NAME, LAST_NAME, USER_TYPE, EMAIL)
                   VALUES ('${user.username}','${hashedPassword}','${user.firstName}','${user.lastName}','${user.userType}','${user.email}')`;
    const params = [];
    await database.query(query,params);

    const res_query = `SELECT *
                       FROM Users
                       WHERE USERNAME='${user.username}'`;
    let ans = await database.query(res_query,params);

    const query2 = `INSERT INTO Agent (AGENT_ID,EXPERIENCE_YEARS,FEE, ACC_STATUS)
                    VALUES (${ans[0].USER_ID},${user.experience},${user.fee},'PENDING')`
    await database.query(query2,params);

    ans[0].PASSWORD = user.password;
    ans[0].EXPERIENCE_YEARS = user.experience;
    ans[0].FEE = user.fee;
    ans[0].ACC_STATUS = "PENDING";
    await database.query('commit',params);

    res.status(200).json(ans[0]);
});

router.put("/:userId",async(req,res)=>{
    const user = req.body;

    let result = {
        status: false,
        data: undefined
    }

    const check_query = `SELECT * FROM Users WHERE USERNAME='${user.username}'`;
    const params = [];
    let ans = await database.query(check_query,params);

    if(ans.length===0  || ans[0].USER_ID!==req.params.userId)
    {
        const plaintextPassword = user.password;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(plaintextPassword, salt);

        const query = `UPDATE Users
                       SET USERNAME='${user.username}',PASSWORD='${hashedPassword}',FIRST_NAME='${user.firstName}',LAST_NAME='${user.lastName}',EMAIL='${user.email}'
                       WHERE USER_ID=${req.params.userId}`;
        await database.query(query,params);
        await database.query('commit',params);

        const res_query = `SELECT U.*, A.EXPERIENCE_YEARS, A.FEE
                           FROM Users U LEFT JOIN Agent A ON U.USER_ID = A.AGENT_ID
                           WHERE USER_ID=${req.params.userId}`;
        ans = await database.query(res_query,params);
        result.status = true;
        result.data = ans[0];
    }

    res.status(200).json(result);
});
router.delete("/:userId",async(req,res)=>{
    const query = `DELETE FROM Users 
                   WHERE USER_ID = ${req.params.userId}`;
    const params = [];
    await database.query(query,params);
    await database.query('commit',params);
    res.status(200).json({
        status: "ok"
    });
});

module.exports = router;