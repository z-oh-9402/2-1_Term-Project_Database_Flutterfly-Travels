const router = require("express-promise-router")();
const database = require('../database');
const bcrypt = require('bcryptjs');

router.get("/:name",async(req,res)=>{
    const query = `SELECT *
                   FROM DESTINATION
                   WHERE LOWER(NAME) LIKE '%${req.params.name.replace(`'`,`''`).toLowerCase()}%'`;
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
            
            let TYPE = [];
            for(let type of result2)
            {
                TYPE.push(type.TYPE_NAME);
            }
            des.TYPE = TYPE;
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
        const query = `SELECT D.*
                   FROM DESTINATION D RIGHT JOIN DESTINATION_TYPE DT ON D.DESTINATION_ID=DT.DESTINATION_ID LEFT JOIN PLACE_TYPE P ON DT.PLACE_TYPE_ID=P.PLACE_TYPE_ID
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