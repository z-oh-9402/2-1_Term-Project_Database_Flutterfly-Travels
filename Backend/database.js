require('dotenv').config();
const Pool = require('pg').Pool;

const pool = new Pool({
    user: process.env.DB_USERNAME,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

const db_query = async (query,params) =>{
    try{
        let result = await pool.query(query,params);
        return result.rows;
    }
    catch(error){
        console.log(error.message);
    }
}

exports.query = db_query;