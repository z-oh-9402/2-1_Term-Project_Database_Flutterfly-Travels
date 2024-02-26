const router = require("express-promise-router")();
const database = require('../database');
const bcrypt = require('bcryptjs');

router.get("/search",async(req,res)=>{
    const keyword = req.query.keyword.replace(`'`,`''`).toLowerCase();

    const params = [];
    const query = `SELECT A.NAME, L.LOCATION_NAME, DIS.DISTRICT_NAME
                   FROM ACCOMMODATION A JOIN Location L ON A.LOCATION_ID=L.LOCATION_ID JOIN District DIS ON DIS.DISTRICT_ID=L.DISTRICT_ID
                   WHERE LOWER(A.NAME) LIKE '%${keyword}%'
                   ORDER BY NAME`;
    const des = await database.query(query,params);

    const query2 = `WITH T(LOCATION_ID,COUNT) AS
                    (SELECT L1.LOCATION_ID,COUNT(DISTINCT A.ACCOMMODATION_ID)
                    FROM ACCOMMODATION A RIGHT JOIN Location L1 ON A.LOCATION_ID=L1.LOCATION_ID
                    GROUP BY L1.LOCATION_ID)

                    SELECT L.LOCATION_NAME,D.DISTRICT_NAME,DIV.DIVISION_NAME
                    FROM Location L JOIN T ON T.LOCATION_ID=L.LOCATION_ID JOIN District D ON D.DISTRICT_ID=L.DISTRICT_ID JOIN Division DIV ON DIV.DIVISION_ID=D.DIVISION_ID
                    WHERE LOWER(L.LOCATION_NAME) LIKE '%${keyword}%' AND T.COUNT>0
                    ORDER BY T.COUNT DESC, L.LOCATION_NAME ASC`;
    const sDis = await database.query(query2,params);

    const query3 = `WITH T(DISTRICT_ID,COUNT) AS
                    (SELECT D2.DISTRICT_ID,COUNT(DISTINCT A.ACCOMMODATION_ID)
                    FROM ACCOMMODATION A JOIN Location L ON A.LOCATION_ID=L.LOCATION_ID RIGHT JOIN DISTRICT D2 ON D2.DISTRICT_ID=L.DISTRICT_ID
                    GROUP BY D2.DISTRICT_ID)

                    SELECT D.DISTRICT_NAME, DIV.DIVISION_NAME
                    FROM District D JOIN T ON T.DISTRICT_ID=D.DISTRICT_ID JOIN Division DIV ON DIV.DIVISION_ID=D.DIVISION_ID 
                    WHERE LOWER(D.DISTRICT_NAME) LIKE '%${keyword}%' AND T.COUNT>0
                    ORDER BY T.COUNT DESC, D.DISTRICT_NAME ASC`;
    const dis = await database.query(query3,params);

    const query4 = `WITH T(DIVISION_ID,COUNT) AS
                    (SELECT D3.DIVISION_ID,COUNT(DISTINCT A.ACCOMMODATION_ID)
                    FROM ACCOMMODATION A JOIN Location L ON A.LOCATION_ID=L.LOCATION_ID JOIN DISTRICT D2 ON D2.DISTRICT_ID=L.DISTRICT_ID RIGHT JOIN Division D3 ON D3.DIVISION_ID = D2.DIVISION_ID
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

router.get("/fetch/location",async(req,res)=>{
    const location = req.query.name.replace(`'`,`''`);

    const query = `SELECT A.*,L.LOCATION_NAME,DIS.DISTRICT_NAME,DIV.DIVISION_NAME
                        FROM ACCOMMODATION A LEFT JOIN Location L ON A.LOCATION_ID=L.LOCATION_ID 
                        LEFT JOIN District DIS ON DIS.DISTRICT_ID=L.DISTRICT_ID
                        LEFT JOIN Division DIV ON DIV.DIVISION_ID=DIS.DIVISION_ID
                   WHERE L.LOCATION_NAME='${location}'
                   ORDER BY A.RATING DESC`;
    const params = [];
    const ans = await database.query(query,params);

    res.status(200).json(ans);
});

router.get("/fetch/district",async(req,res)=>{
    const district = req.query.name.replace(`'`,`''`);

    const query = `SELECT A.*,L.LOCATION_NAME,DIS.DISTRICT_NAME,DIV.DIVISION_NAME
                        FROM ACCOMMODATION A LEFT JOIN Location L ON A.LOCATION_ID=L.LOCATION_ID 
                        LEFT JOIN District DIS ON DIS.DISTRICT_ID=L.DISTRICT_ID
                        LEFT JOIN Division DIV ON DIV.DIVISION_ID=DIS.DIVISION_ID
                   WHERE DIS.DISTRICT_NAME='${district}'
                   ORDER BY A.RATING DESC`;
    const params = [];
    const ans = await database.query(query,params);

    res.status(200).json(ans);
});

router.get("/fetch/division",async(req,res)=>{
    const division = req.query.name.replace(`'`,`''`);

    const query = `SELECT A.*,L.LOCATION_NAME,DIS.DISTRICT_NAME,DIV.DIVISION_NAME
                        FROM ACCOMMODATION A LEFT JOIN Location L ON A.LOCATION_ID=L.LOCATION_ID 
                        LEFT JOIN District DIS ON DIS.DISTRICT_ID=L.DISTRICT_ID
                        LEFT JOIN Division DIV ON DIV.DIVISION_ID=DIS.DIVISION_ID
                   WHERE DIV.DIVISION_NAME='${division}'
                   ORDER BY A.RATING DESC`;
    const params = [];
    const ans = await database.query(query,params);
    res.status(200).json(ans);
});

router.get("/fetch/accommodation-name",async(req,res)=>{
    const name = req.query.name.replace(`'`,`''`);

    const query = `SELECT A.*,L.LOCATION_NAME,DIS.DISTRICT_NAME,DIV.DIVISION_NAME
                        FROM ACCOMMODATION A LEFT JOIN Location L ON A.LOCATION_ID=L.LOCATION_ID 
                        LEFT JOIN District DIS ON DIS.DISTRICT_ID=L.DISTRICT_ID
                        LEFT JOIN Division DIV ON DIV.DIVISION_ID=DIS.DIVISION_ID
                   WHERE A.NAME='${name}'
                   ORDER BY A.RATING DESC`;
    const params = [];
    const ans = await database.query(query,params);

    res.status(200).json(ans[0]);
});

router.get("/fetch",async(req,res)=>{
    const keyword = req.query.keyword.replace(`'`,`''`).toLowerCase();

    const query = `SELECT A.*,L.LOCATION_NAME,DIS.DISTRICT_NAME,DIV.DIVISION_NAME
                        FROM ACCOMMODATION A LEFT JOIN Location L ON A.LOCATION_ID=L.LOCATION_ID 
                        LEFT JOIN District DIS ON DIS.DISTRICT_ID=L.DISTRICT_ID
                        LEFT JOIN Division DIV ON DIV.DIVISION_ID=DIS.DIVISION_ID
                   WHERE LOWER(A.NAME) LIKE '%${keyword}%'
                   OR LOWER(L.LOCATION_NAME) LIKE '%${keyword}%'
                   OR LOWER(DIS.DISTRICT_NAME) LIKE '%${keyword}%'
                   OR LOWER(DIV.DIVISION_NAME) LIKE '%${keyword}%'
                   ORDER BY A.RATING DESC`;
    const params = [];
    const ans = await database.query(query,params);

    const result = {
        status: false,
        data: undefined
    }

    if(ans.length!==0)
    {
        result.status = true;
        result.data = ans;
    }

    res.status(200).json(result);
});

router.get("/review-rating/:accommodationId/:customerId",async(req,res)=>{
    const id = req.params.accommodationId;
    const customerId = req.params.customerId;

    const query = 
    `
        SELECT RATING FROM RATING
        WHERE CUSTOMER_ID=${customerId} AND ITEM_ID=${id} AND ITEM_TYPE='accommodation'
    `;

    const params = [];

    const ans = await database.query(query,params);

    let result;
    if(ans.length===0)
    {
        result = 0;
    }
    else
    {
        result = ans[0].RATING;
    }

    res.status(200).json(result);
});

router.get("/review-rating/:accommodationId",async(req,res)=>{
    const id = req.params.accommodationId;

    const query = 
    `
        SELECT RE.REVIEW, RA.RATING, RE.CREATED_AT, U.USERNAME
        FROM REVIEW RE JOIN RATING RA ON RE.ITEM_ID=RA.ITEM_ID AND RE.ITEM_TYPE=RA.ITEM_TYPE AND RE.CUSTOMER_ID=RA.CUSTOMER_ID JOIN USERS U ON U.USER_ID=RE.CUSTOMER_ID
        WHERE RE.ITEM_ID=${id} AND RE.ITEM_TYPE='accommodation'
        ORDER BY RE.CREATED_AT DESC
    `;

    const params = [];

    const ans = await database.query(query,params);
    res.status(200).json(ans);
});

router.post("/review-rating/:id",async(req,res)=>{
    const id = req.params.id;
    const review = req.body.review;
    const rating = req.body.rating;
    const customerId = req.body.customerId;

    const params = [];
    if(rating!==0)
    {
        const query1 = 
        `
            SELECT * FROM RATING
            WHERE CUSTOMER_ID=${customerId} AND ITEM_ID=${id} AND ITEM_TYPE='accommodation'
        `
        const ans = await database.query(query1,params);

        if(ans.length===0)
        {
            const query2 = 
            `
                INSERT INTO RATING (ITEM_ID,ITEM_TYPE,RATING,CUSTOMER_ID)
                VALUES (${id},'accommodation','${rating}',${customerId})
            `
            await database.query(query2,params);
        }
        else
        {
            const query2 = 
            `
                UPDATE RATING SET RATING=${rating} WHERE ITEM_ID=${id} AND ITEM_TYPE='accommodation' AND CUSTOMER_ID=${customerId}
            `
            await database.query(query2,params);
        }

        const ratingUpdateQuery = 
        `
            UPDATE ACCOMMODATION 
            SET RATING=(SELECT ROUND(AVG(RATING),1) FROM RATING WHERE ITEM_ID=${id} AND ITEM_TYPE='accommodation') 
            WHERE ACCOMMODATION_ID=${id}
        `
        await database.query(ratingUpdateQuery,params);
    }

    if(review.length!==0)
    {
        const query3 = 
        `
            INSERT INTO REVIEW (ITEM_ID,ITEM_TYPE,REVIEW,CUSTOMER_ID)
            VALUES (${id},'accommodation','${review}',${customerId})
        `
        await database.query(query3,params);
    }

    await database.query('commit',params);

    res.status(200).json({status:'ok'});
});

module.exports = router;