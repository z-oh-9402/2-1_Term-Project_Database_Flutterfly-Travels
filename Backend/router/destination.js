const router = require("express-promise-router")();
const database = require('../database');
const bcrypt = require('bcryptjs');

router.get("/search",async(req,res)=>{
    const keyword = req.query.keyword.replace(`'`,`''`).toLowerCase();

    const params = [];
    const query = `SELECT D.NAME, L.LOCATION_NAME, DIS.DISTRICT_NAME
                   FROM Destination D JOIN Location L ON D.LOCATION_ID=L.LOCATION_ID JOIN District DIS ON DIS.DISTRICT_ID=L.DISTRICT_ID
                   WHERE LOWER(NAME) LIKE '%${keyword}%'
                   ORDER BY NAME`;
    const des = await database.query(query,params);

    const query2 = `WITH T(LOCATION_ID,COUNT) AS
                    (SELECT L1.LOCATION_ID,COUNT(DISTINCT D.DESTINATION_ID)
                    FROM Destination D RIGHT JOIN Location L1 ON D.LOCATION_ID=L1.LOCATION_ID
                    GROUP BY L1.LOCATION_ID)

                    SELECT L.LOCATION_NAME,D.DISTRICT_NAME,DIV.DIVISION_NAME
                    FROM Location L JOIN T ON T.LOCATION_ID=L.LOCATION_ID JOIN District D ON D.DISTRICT_ID=L.DISTRICT_ID JOIN Division DIV ON DIV.DIVISION_ID=D.DIVISION_ID
                    WHERE LOWER(L.LOCATION_NAME) LIKE '%${keyword}%' AND T.COUNT>0
                    ORDER BY T.COUNT DESC, L.LOCATION_NAME ASC`;
    const sDis = await database.query(query2,params);

    const query3 = `WITH T(DISTRICT_ID,COUNT) AS
                    (SELECT D2.DISTRICT_ID,COUNT(DISTINCT D1.DESTINATION_ID)
                    FROM Destination D1 JOIN Location L ON D1.LOCATION_ID=L.LOCATION_ID RIGHT JOIN DISTRICT D2 ON D2.DISTRICT_ID=L.DISTRICT_ID
                    GROUP BY D2.DISTRICT_ID)

                    SELECT D.DISTRICT_NAME, DIV.DIVISION_NAME
                    FROM District D JOIN T ON T.DISTRICT_ID=D.DISTRICT_ID JOIN Division DIV ON DIV.DIVISION_ID=D.DIVISION_ID 
                    WHERE LOWER(D.DISTRICT_NAME) LIKE '%${keyword}%' AND T.COUNT>0
                    ORDER BY T.COUNT DESC, D.DISTRICT_NAME ASC`;
    const dis = await database.query(query3,params);

    const query4 = `WITH T(DIVISION_ID,COUNT) AS
                    (SELECT D3.DIVISION_ID,COUNT(DISTINCT D1.DESTINATION_ID)
                    FROM Destination D1 JOIN Location L ON D1.LOCATION_ID=L.LOCATION_ID JOIN DISTRICT D2 ON D2.DISTRICT_ID=L.DISTRICT_ID RIGHT JOIN Division D3 ON D3.DIVISION_ID = D2.DIVISION_ID
                    GROUP BY D3.DIVISION_ID)

                    SELECT D.DIVISION_NAME
                    FROM Division D JOIN T ON T.DIVISION_ID=D.DIVISION_ID
                    WHERE LOWER(D.DIVISION_NAME) LIKE '%${keyword}%' AND T.COUNT>0
                    ORDER BY T.COUNT DESC, D.DIVISION_NAME ASC`;
    const div = await database.query(query4,params);

    const result = {
        status: false,
        data: 
        {
            destination: des,
            location:
            {
                subDistrict: sDis,
                district: dis,
                division: div
            }
        }
    }

    if(des.length!==0 || sDis.length!==0 || dis.length!==0 || div.length!==0)
    {
        result.status = true;
    }

    res.status(200).json(result);
});



router.get("/fetch",async(req,res)=>{
    const keyword = req.query.keyword.replace(`'`,`''`).toLowerCase();

    const query = `SELECT D.*,L.LOCATION_NAME,DIS.DISTRICT_NAME,DIV.DIVISION_NAME
                        FROM DESTINATION D LEFT JOIN Location L ON D.LOCATION_ID=L.LOCATION_ID 
                        LEFT JOIN District DIS ON DIS.DISTRICT_ID=L.DISTRICT_ID
                        LEFT JOIN Division DIV ON DIV.DIVISION_ID=DIS.DIVISION_ID
                   WHERE LOWER(D.NAME) LIKE '%${keyword}%'
                   OR LOWER(L.LOCATION_NAME) LIKE '%${keyword}%'
                   OR LOWER(DIS.DISTRICT_NAME) LIKE '%${keyword}%'
                   OR LOWER(DIV.DIVISION_NAME) LIKE '%${keyword}%'
                   ORDER BY D.RATING DESC`;
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

router.get("/fetch/destination-name",async(req,res)=>{
    const name = req.query.name.replace(`'`,`''`);

    const query = `SELECT D.*,L.LOCATION_NAME,DIS.DISTRICT_NAME,DIV.DIVISION_NAME
                        FROM DESTINATION D LEFT JOIN Location L ON D.LOCATION_ID=L.LOCATION_ID 
                        LEFT JOIN District DIS ON DIS.DISTRICT_ID=L.DISTRICT_ID
                        LEFT JOIN Division DIV ON DIV.DIVISION_ID=DIS.DIVISION_ID
                   WHERE D.NAME='${name}'
                   ORDER BY D.RATING DESC`;
    const params = [];
    const ans = await database.query(query,params);

    const query2 = `SELECT P.TYPE_NAME
            FROM DESTINATION_TYPE D LEFT JOIN PLACE_TYPE P ON D.PLACE_TYPE_ID = P.PLACE_TYPE_ID
            WHERE D.DESTINATION_ID = ${ans[0].DESTINATION_ID}`;
    const result2 = await database.query(query2,params);
    ans[0].TYPE = result2;

    res.status(200).json(ans[0]);
});

router.get("/fetch/location",async(req,res)=>{
    const location = req.query.name.replace(`'`,`''`);

    const query = `SELECT D.*,L.LOCATION_NAME,DIS.DISTRICT_NAME,DIV.DIVISION_NAME
                        FROM DESTINATION D LEFT JOIN Location L ON D.LOCATION_ID=L.LOCATION_ID 
                        LEFT JOIN District DIS ON DIS.DISTRICT_ID=L.DISTRICT_ID
                        LEFT JOIN Division DIV ON DIV.DIVISION_ID=DIS.DIVISION_ID
                   WHERE L.LOCATION_NAME='${location}'
                   ORDER BY D.RATING DESC`;
    const params = [];
    const ans = await database.query(query,params);

    for(let des of ans)
    {
        const query2 = `SELECT P.TYPE_NAME
                FROM DESTINATION_TYPE D LEFT JOIN PLACE_TYPE P ON D.PLACE_TYPE_ID = P.PLACE_TYPE_ID
                WHERE D.DESTINATION_ID = ${des.DESTINATION_ID}`;
        const result2 = await database.query(query2,params);
        des.TYPE = result2;
    }

    res.status(200).json(ans);
});

router.get("/fetch/district",async(req,res)=>{
    const district = req.query.name.replace(`'`,`''`);

    const query = `SELECT D.*,L.LOCATION_NAME,DIS.DISTRICT_NAME,DIV.DIVISION_NAME
                        FROM DESTINATION D LEFT JOIN Location L ON D.LOCATION_ID=L.LOCATION_ID 
                        LEFT JOIN District DIS ON DIS.DISTRICT_ID=L.DISTRICT_ID
                        LEFT JOIN Division DIV ON DIV.DIVISION_ID=DIS.DIVISION_ID
                   WHERE DIS.DISTRICT_NAME='${district}'
                   ORDER BY D.RATING DESC`;
    const params = [];
    const ans = await database.query(query,params);

    for(let des of ans)
    {
        const query2 = `SELECT P.TYPE_NAME
                FROM DESTINATION_TYPE D LEFT JOIN PLACE_TYPE P ON D.PLACE_TYPE_ID = P.PLACE_TYPE_ID
                WHERE D.DESTINATION_ID = ${des.DESTINATION_ID}`;
        const result2 = await database.query(query2,params);
        des.TYPE = result2;
    }

    res.status(200).json(ans);
});

router.get("/fetch/division",async(req,res)=>{
    const division = req.query.name.replace(`'`,`''`);

    const query = `SELECT D.*,L.LOCATION_NAME,DIS.DISTRICT_NAME,DIV.DIVISION_NAME
                        FROM DESTINATION D LEFT JOIN Location L ON D.LOCATION_ID=L.LOCATION_ID 
                        LEFT JOIN District DIS ON DIS.DISTRICT_ID=L.DISTRICT_ID
                        LEFT JOIN Division DIV ON DIV.DIVISION_ID=DIS.DIVISION_ID
                   WHERE DIV.DIVISION_NAME='${division}'
                   ORDER BY D.RATING DESC`;
    const params = [];
    const ans = await database.query(query,params);

    for(let des of ans)
    {
        const query2 = `SELECT P.TYPE_NAME
                FROM DESTINATION_TYPE D LEFT JOIN PLACE_TYPE P ON D.PLACE_TYPE_ID = P.PLACE_TYPE_ID
                WHERE D.DESTINATION_ID = ${des.DESTINATION_ID}`;
        const result2 = await database.query(query2,params);
        des.TYPE = result2;
    }

    res.status(200).json(ans);
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
                        WHERE P.TYPE_NAME='${category}'
                        ORDER BY D.RATING DESC`;
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