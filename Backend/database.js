require('dotenv').config();
const oracledb = require('oracledb');
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

let connection = undefined;

const connectToDB = async ()=>{
    try{
        connection = await oracledb.getConnection({
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            connectionString: process.env.DB_CONNECTION_STRING
        });
    }
    catch(error){
        console.error(error);
    }
}

const db_query = async (query,params) =>{
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

exports.connectToDB = connectToDB;
exports.query = db_query;