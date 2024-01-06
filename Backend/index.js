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

app.get("/employee/id&minsalary/:id/:minsalary",async(req,res)=>{
    console.log(req.body);
    const query = `SELECT FIRST_NAME, LAST_NAME, SALARY, EMAIL, PHONE_NUMBER, JOB_ID FROM EMPLOYEES WHERE DEPARTMENT_ID = ${req.params.id} AND SALARY>${req.params.minsalary}`;
    const params = [];
    const result = await database.query(query,params);
    res.status(200).json(result);
});

app.listen(PORT,()=>{
    console.log(`Server has started on port ${PORT}...`);
});