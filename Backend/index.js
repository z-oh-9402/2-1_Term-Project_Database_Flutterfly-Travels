require('dotenv').config();
const PORT = process.env.PORT;
const morgan = require('morgan');
const express = require('express');
const cors = require('cors');
const database = require('./database');

const app = express();
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());
app.options('*',cors());

database.connectToDB();

app.get("/user/:username",async(req,res)=>{
    const query = `SELECT * FROM Users U LEFT JOIN Customer C USING(USER_ID) WHERE U.USERNAME='${req.params.username}'`;
    const params = [];
    const result = await database.query(query,params);
    if(result.length!==0)
    {
        const str = result[0].PREFERENCES;
        if(str!==null)
        {
            result[0].PREFERENCES = str.split(',');
        }
    }
    res.status(200).json(result);
});

app.post("/user",async(req,res)=>{
    const user = req.body;
    const query = `INSERT INTO Users (USERNAME, PASSWORD, FIRST_NAME, LAST_NAME, USER_TYPE, EMAIL) VALUES ('${user.username}','${user.password}','${user.firstName}','${user.lastName}','${user.userType}','${user.email}')`;
    const params = [];
    await database.query(query,params);
    await database.query('commit',params);

    const res_query = `SELECT * FROM Users WHERE USERNAME='${user.username}'`;
    const result = await database.query(res_query,params);

    const query2 = `INSERT INTO Customer (USER_ID,PREFERENCES) VALUES (${result[0].USER_ID},'${user.preferences}')`;
    await database.query(query2,params);
    await database.query('commit',params);

    const str = user.preferences;
    if(str.length===0) result[0].PREFERENCES = null;
    else result[0].PREFERENCES = str.split(',');
    res.status(200).json(result[0]);
});

app.delete("/user/:userId",async(req,res)=>{
    const query = `DELETE FROM Users WHERE USER_ID = ${req.params.userId}`;
    const params = [];
    await database.query(query,params);
    await database.query('commit',params);
    res.status(200).json({
        status: "ok"
    });
});

app.listen(PORT,()=>{
    console.log(`Server has started on port ${PORT}...`);
});