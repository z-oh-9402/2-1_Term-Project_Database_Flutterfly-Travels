const router = require("express-promise-router")();
const database = require('../database');
const bcrypt = require('bcryptjs');

router.get("/:username/:password",async(req,res)=>{
    const query = `SELECT * 
                   FROM Users U LEFT JOIN Customer C ON C.CUSTOMER_ID=U.USER_ID
                   WHERE U.USER_TYPE='customer' AND U.USERNAME='${req.params.username}'`;
    const params = [];
    const ans = await database.query(query,params);

    let result = {
        status: -1,
        data: undefined
    }

    if(ans.length!==0)
    {
        const plaintextPassword = req.params.password;
        const hashedPassword = ans[0].PASSWORD;

        const passwordsMatch = await bcrypt.compare(plaintextPassword, hashedPassword);
        if (!passwordsMatch) {
            result.status = 0
        } 
        else {
            result.status = 1;
            const str = ans[0].PREFERENCES;
            if(str!==null)
            {
                ans[0].PREFERENCES = str.split(',');
            }
            result.data = ans[0];
        }
    }

    res.status(200).json(result);
});

router.post("/",async(req,res)=>{
    const user = req.body;
    
    const plaintextPassword = user.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plaintextPassword, salt);

    let result = {
        status: false,
        data: undefined
    }

    const check_query = `SELECT * FROM Users WHERE USERNAME='${user.username}'`;
    const params = [];
    let ans = await database.query(check_query,params);

    if(ans.length===0)
    {
        const query = `INSERT INTO Users (USERNAME, PASSWORD, FIRST_NAME, LAST_NAME, USER_TYPE, EMAIL)
                       VALUES ('${user.username}','${hashedPassword}','${user.firstName}','${user.lastName}','${user.userType}','${user.email}')`;
        await database.query(query,params);
        await database.query('commit',params);

        const res_query = `SELECT *
                           FROM Users
                           WHERE USERNAME='${user.username}'`;
        ans = await database.query(res_query,params);

        ans[0].PREFERENCES = null;
        if(user.preferences!=="")
        {
            const query2 = `INSERT INTO Customer (CUSTOMER_ID,PREFERENCES) 
                            VALUES (${ans[0].USER_ID},'${user.preferences}')`;
            await database.query(query2,params);
            await database.query('commit',params);
            ans[0].PREFERENCES = user.preferences.split(',');
        }
        
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