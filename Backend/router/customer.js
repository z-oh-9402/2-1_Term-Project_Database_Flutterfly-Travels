const router = require("express-promise-router")();
const database = require('../database');
const bcrypt = require('bcryptjs');
const { upload, deleting } = require('../file_handling');

router.get("/fetch",async(req,res)=>{
    const query = `SELECT C.passport_number, C.trip_booked, P.type_name
                   FROM Customer C LEFT JOIN CUSTOMER_PREFERENCE CP ON C.CUSTOMER_ID=CP.CUSTOMER_ID LEFT JOIN Place_Type P ON CP.PREFERENCE_ID=P.PLACE_TYPE_ID
                   WHERE C.CUSTOMER_ID=${req.query.customerId}`;
    const params = [];
    const ans = await database.query(query,params);

    let pref = [];
    for(let data of ans)
    {
        if(data.type_name!=null)
        {
            pref.push(data.type_name);
        }    
    }
    ans[0].preferences = pref;

    res.status(200).json(ans[0]);
});

// router.get("/:username",async(req,res)=>{
//     const query = `SELECT *
//                    FROM Users
//                    WHERE USERNAME='${req.params.username}'`;
//     const params = [];
//     const ans = await database.query(query,params);

//     const result = {
//         status: ans.length === 0
//     }

//     res.status(200).json(result);
// });

router.post("/", upload.single('file'), async(req,res)=>{
    const user = req.body;
    user.preferences = JSON.parse(user.preferences);

    const plaintextPassword = user.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plaintextPassword, salt);
    
    if(req.file === undefined) {
        req.file = { filename: "" }
    }

    let query = `INSERT INTO Users (USERNAME, PASSWORD, FIRST_NAME, LAST_NAME, USER_TYPE, EMAIL, PHOTO)
                   VALUES ($1, $2, $3, $4, $5, $6, $7)`;
    let params = [user.username, hashedPassword, user.firstName, user.lastName, user.userType, user.email, req.file.filename];
    await database.query(query,params);

    query = `SELECT *
             FROM Users
             WHERE USERNAME = $1`;
    params = [user.username]
    let ans = await database.query(query,params);

    query = `INSERT INTO Customer (CUSTOMER_ID,PASSPORT_NUMBER,TRIP_BOOKED)
             VALUES ($1,$2,$3)`;
    params = [ans[0].user_id, user.passportNumber, 0]
    await database.query(query,params);

    ans[0].password = user.password;
    ans[0].passport_number = user.passportNumber;
    ans[0].trip_booked = 0;
    ans[0].preferences = [];
    
    for(let i=0;i<user.preferences.length;i++)
    {
        query = `INSERT INTO Customer_Preference (CUSTOMER_ID,PREFERENCE_ID) 
                VALUES ($1,$2)`;
        params = [ans[0].user_id, user.preferences[i].id];
        await database.query(query,params);

        ans[0].preferences.push(user.preferences[i].name);
    }

    params = [];
    await database.query('commit',params);

    res.status(200).json(ans[0]);
});

router.put("/:userId", upload.single('file'), async(req,res)=>{
    const user = req.body;
    user.preferences = JSON.parse(user.preferences);

    let query = `SELECT PHOTO
                FROM Users
                WHERE USER_ID = ${req.params.userId}`;
    let params = [];
    const prev_user = await database.query(query,params);

    prev_user[0].photo.length && deleting("uploads/"+prev_user[0].photo);
    
    const plaintextPassword = user.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plaintextPassword, salt);

    if(req.file === undefined) {
        req.file = { filename: "" }
    }

    query = `UPDATE Users
             SET USERNAME=$1, PASSWORD=$2,FIRST_NAME=$3,LAST_NAME=$4,EMAIL=$5, PHOTO=$6
             WHERE USER_ID=${req.params.userId}`;
    params = [user.username, hashedPassword, user.firstName, user.lastName, user.email, req.file.filename];
    await database.query(query,params);

    query = `UPDATE Customer
             SET PASSPORT_NUMBER='${user.passportNumber}'
             WHERE CUSTOMER_ID=${req.params.userId}`
    params = [];
    await database.query(query,params);

    query = `DELETE FROM Customer_Preference
             WHERE CUSTOMER_ID=${req.params.userId}`;
    await database.query(query,params);

    let preferences = [];
    for(let i=0;i<user.preferences.length;i++)
    {
        query = `INSERT INTO Customer_Preference (CUSTOMER_ID,PREFERENCE_ID) 
                 VALUES (${req.params.userId},${user.preferences[i].id})`;
        await database.query(query,params);

        preferences.push(user.preferences[i].name);
    }
    await database.query('commit',params);

    const res_query = `SELECT U.*,C.PASSPORT_NUMBER,C.TRIP_BOOKED
                       FROM Users U LEFT JOIN Customer C ON  U.USER_ID=C.CUSTOMER_ID
                       WHERE USER_ID=${req.params.userId}`;
    let ans = await database.query(res_query,params);

    ans[0].preferences = preferences;
    ans[0].password = user.password;
    
    result = ans[0];
    res.status(200).json(result);
});

module.exports = router;