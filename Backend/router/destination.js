const router = require("express-promise-router")();
const database = require('../database');
const bcrypt = require('bcryptjs');

router.get("/search",async(req,res)=>{
    const keyword = `%${req.query.keyword.replace(`'`,`''`).toLowerCase()}%`;

    const query = `SELECT D.*,L.LOCATION_NAME,DIS.DISTRICT_NAME,DIV.DIVISION_NAME
                        FROM DESTINATION D LEFT JOIN Location L ON D.LOCATION_ID=L.LOCATION_ID 
                        LEFT JOIN District DIS ON DIS.DISTRICT_ID=L.DISTRICT_ID
                        LEFT JOIN Division DIV ON DIV.DIVISION_ID=DIS.DIVISION_ID
                   WHERE LOWER(D.NAME) LIKE '${keyword}'
                   OR LOWER(L.LOCATION_NAME) LIKE '${keyword}'
                   OR LOWER(DIS.DISTRICT_NAME) LIKE '${keyword}'
                   OR LOWER(DIV.DIVISION_NAME) LIKE '${keyword}'`;
    const params = [];
    const ans = await database.query(query,params);

    const result = {
        status: false,
        data: undefined
    }

    if(ans.length!==0)
    {
        for(let des of ans)
        {
            const query2 = `SELECT P.TYPE_NAME
                    FROM DESTINATION_TYPE D LEFT JOIN PLACE_TYPE P ON D.PLACE_TYPE_ID = P.PLACE_TYPE_ID
                    WHERE D.DESTINATION_ID = ${des.DESTINATION_ID}`;
            const result2 = await database.query(query2,params);
            des.TYPE = result2;
        }

        result.status = true;
        result.data = ans;
    }

    res.status(200).json(result);
});

router.post("/",async(req,res)=>{
    const categories = req.body;

    let result = []

    for(let category of categories){
        const query = `SELECT D.*,L.LOCATION_NAME,DIS.DISTRICT_NAME,DIV.DIVISION_NAME
                        FROM DESTINATION D LEFT JOIN Location L ON D.LOCATION_ID=L.LOCATION_ID 
                        LEFT JOIN District DIS ON DIS.DISTRICT_ID=L.DISTRICT_ID
                        LEFT JOIN Division DIV ON DIV.DIVISION_ID=DIS.DIVISION_ID
                        LEFT JOIN DESTINATION_TYPE DT ON D.DESTINATION_ID=DT.DESTINATION_ID 
                        LEFT JOIN PLACE_TYPE P ON DT.PLACE_TYPE_ID=P.PLACE_TYPE_ID
                   WHERE P.TYPE_NAME='${category}'`;
        const params = [];
        const ans = await database.query(query,params);
        let data = {
            category: category,
            destinations: ans
        }
        result.push(data);
    }

    res.status(200).json(result);
});

module.exports = router;