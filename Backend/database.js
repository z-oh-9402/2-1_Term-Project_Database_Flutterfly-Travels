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
        console.log(`"`+query+`"`);
        console.log(error.message);
        throw error;
    }
}

// Runs fn(client) on one dedicated connection inside a transaction, so every query in fn sees the same session
// (needed for multi-step writes, and for cursors returned by procedures). Rolls back if fn throws.
const db_transaction = async (fn) =>{
    const client = await pool.connect();
    try{
        await client.query('BEGIN');
        const result = await fn(client);
        await client.query('COMMIT');
        return result;
    }
    catch(error){
        await client.query('ROLLBACK');
        console.log(error.message);
        throw error;
    }
    finally{
        client.release();
    }
}

exports.query = db_query;
exports.transaction = db_transaction;