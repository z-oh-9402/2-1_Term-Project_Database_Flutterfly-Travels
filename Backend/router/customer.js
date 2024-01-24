const router = require("express-promise-router")();
const database = require('../database');
const bcrypt = require('bcryptjs');

router.get("/:username/:password",async(req,res)=>{
    const query = `SELECT U.*, C.passport_number, C.trip_booked, P.type_name
                   FROM Users U LEFT JOIN Customer C ON C.CUSTOMER_ID=U.USER_ID LEFT JOIN CUSTOMER_PREFERENCE CP ON C.CUSTOMER_ID=CP.CUSTOMER_ID LEFT JOIN Place_Type P ON CP.PREFERENCE_ID=P.PLACE_TYPE_ID
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
            let pref = [];
            for(let data of ans)
            {
                if(data.TYPE_NAME!=null)
                {
                    pref.push(data.TYPE_NAME);
                }    
            }
            ans[0].PREFERENCES = pref;
            ans[0].PASSWORD = req.params.password;
            result.data = ans[0];
            result.status = 1;
        }
    }

    res.status(200).json(result);
});

router.post("/",async(req,res)=>{
    const user = req.body;
    
    let result = {
        status: false,
        data: undefined
    }

    const check_query = `SELECT * FROM Users WHERE USERNAME='${user.username}'`;
    const params = [];
    let ans = await database.query(check_query,params);

    if(ans.length===0)
    {
        const plaintextPassword = user.password;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(plaintextPassword, salt);

        const query = `INSERT INTO Users (USERNAME, PASSWORD, FIRST_NAME, LAST_NAME, USER_TYPE, EMAIL)
                       VALUES ('${user.username}','${hashedPassword}','${user.firstName}','${user.lastName}','${user.userType}','${user.email}')`;
        await database.query(query,params);

        const res_query = `SELECT *
                           FROM Users
                           WHERE USERNAME='${user.username}'`;
        ans = await database.query(res_query,params);

        const query2 = `INSERT INTO Customer (CUSTOMER_ID,PASSPORT_NUMBER,TRIP_BOOKED)
                        VALUES (${ans[0].USER_ID},'${user.passportNumber}',${user.tripBooked})`
        await database.query(query2,params);

        ans[0].PASSWORD = user.password;
        ans[0].PASSPORT_NUMBER = user.passportNumber;
        ans[0].TRIP_BOOKED = user.tripBooked;
        ans[0].PREFERENCES = user.preferences;
        
        for(let i=0;i<user.preferences.length;i++)
        {
            const param_query = `SELECT place_type_id FROM Place_Type WHERE TYPE_NAME = '${user.preferences[i]}'`;
            const id = await database.query(param_query,params);

            const query3 = `INSERT INTO Customer_Preference (CUSTOMER_ID,PREFERENCE_ID) 
                            VALUES (${ans[0].USER_ID},${id[0].PLACE_TYPE_ID})`;
            await database.query(query3,params);
        }
        await database.query('commit',params);
        
        result.status = true;
        result.data = ans[0];
    }

    res.status(200).json(result);
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

        const query2 = `UPDATE Customer
                        SET PASSPORT_NUMBER='${user.passportNumber}'
                        WHERE CUSTOMER_ID=${req.params.userId}`
        await database.query(query2,params);

        const query3 = `DELETE FROM Customer_Preference
                        WHERE CUSTOMER_ID=${req.params.userId}`;
        await database.query(query3,params);

        for(let i=0;i<user.preferences.length;i++)
        {
            const param_query = `SELECT place_type_id FROM Place_Type WHERE TYPE_NAME = '${user.preferences[i]}'`;
            const id = await database.query(param_query,params);

            const query4 = `INSERT INTO Customer_Preference (CUSTOMER_ID,PREFERENCE_ID) 
                            VALUES (${req.params.userId},${id[0].PLACE_TYPE_ID})`;
            await database.query(query4,params);
        }
        await database.query('commit',params);

        const res_query = `SELECT U.*,C.PASSPORT_NUMBER,C.TRIP_BOOKED
                           FROM Users U LEFT JOIN Customer C ON  U.USER_ID=C.CUSTOMER_ID
                           WHERE USER_ID=${req.params.userId}`;
        ans = await database.query(res_query,params);
        ans[0].PREFERENCES = user.preferences;
        ans[0].PASSWORD = user.password;
        
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