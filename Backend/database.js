require('dotenv').config();
const oracledb = require('oracledb');
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

let connection = undefined;

const db_query = async (query,params) =>{
    connection = await oracledb.getConnection({
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        connectionString: process.env.DB_CONNECTION_STRING
    });

    try
    {
        let result = await connection.execute(query,params);
        return result.rows;
    }
    catch(error)
    {
        console.log(error);
    }
};

exports.query = db_query;