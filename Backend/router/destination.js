const router = require("express-promise-router")();
const database = require('../database');
const { requireAuth, requireRole } = require('../auth');
const { placeJoins, listParam, browseConditions, sendPage } = require('../browse');

router.get("/search",async(req,res)=>{
    const keyword = req.query.keyword.toLowerCase();

    const params = [`%${keyword}%`];
    const query = `SELECT D.NAME, L.LOCATION_NAME, DIS.DISTRICT_NAME
                   FROM Destination D JOIN Location L ON D.LOCATION_ID=L.LOCATION_ID JOIN District DIS ON DIS.DISTRICT_ID=L.DISTRICT_ID
                   WHERE LOWER(NAME) LIKE $1
                   ORDER BY NAME`;
    const des = await database.query(query,params);

    const query2 = `WITH T(LOCATION_ID,COUNT) AS
                    (SELECT L1.LOCATION_ID,COUNT(DISTINCT D.DESTINATION_ID)
                    FROM Destination D RIGHT JOIN Location L1 ON D.LOCATION_ID=L1.LOCATION_ID
                    GROUP BY L1.LOCATION_ID)

                    SELECT L.LOCATION_NAME,D.DISTRICT_NAME,DIV.DIVISION_NAME
                    FROM Location L JOIN T ON T.LOCATION_ID=L.LOCATION_ID JOIN District D ON D.DISTRICT_ID=L.DISTRICT_ID JOIN Division DIV ON DIV.DIVISION_ID=D.DIVISION_ID
                    WHERE LOWER(L.LOCATION_NAME) LIKE $1 AND T.COUNT>0
                    ORDER BY T.COUNT DESC, L.LOCATION_NAME ASC`;
    const sDis = await database.query(query2,params);

    const query3 = `WITH T(DISTRICT_ID,COUNT) AS
                    (SELECT D2.DISTRICT_ID,COUNT(DISTINCT D1.DESTINATION_ID)
                    FROM Destination D1 JOIN Location L ON D1.LOCATION_ID=L.LOCATION_ID RIGHT JOIN DISTRICT D2 ON D2.DISTRICT_ID=L.DISTRICT_ID
                    GROUP BY D2.DISTRICT_ID)

                    SELECT D.DISTRICT_NAME, DIV.DIVISION_NAME
                    FROM District D JOIN T ON T.DISTRICT_ID=D.DISTRICT_ID JOIN Division DIV ON DIV.DIVISION_ID=D.DIVISION_ID 
                    WHERE LOWER(D.DISTRICT_NAME) LIKE $1 AND T.COUNT>0
                    ORDER BY T.COUNT DESC, D.DISTRICT_NAME ASC`;
    const dis = await database.query(query3,params);

    const query4 = `WITH T(DIVISION_ID,COUNT) AS
                    (SELECT D3.DIVISION_ID,COUNT(DISTINCT D1.DESTINATION_ID)
                    FROM Destination D1 JOIN Location L ON D1.LOCATION_ID=L.LOCATION_ID JOIN DISTRICT D2 ON D2.DISTRICT_ID=L.DISTRICT_ID RIGHT JOIN Division D3 ON D3.DIVISION_ID = D2.DIVISION_ID
                    GROUP BY D3.DIVISION_ID)

                    SELECT D.DIVISION_NAME
                    FROM Division D JOIN T ON T.DIVISION_ID=D.DIVISION_ID
                    WHERE LOWER(D.DIVISION_NAME) LIKE $1 AND T.COUNT>0
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

router.get("/fetch/destination-name",async(req,res)=>{
    const name = req.query.name;

    const query = `SELECT D.*,L.LOCATION_NAME,DIS.DISTRICT_NAME,DIV.DIVISION_NAME
                        FROM DESTINATION D LEFT JOIN Location L ON D.LOCATION_ID=L.LOCATION_ID 
                        LEFT JOIN District DIS ON DIS.DISTRICT_ID=L.DISTRICT_ID
                        LEFT JOIN Division DIV ON DIV.DIVISION_ID=DIS.DIVISION_ID
                   WHERE D.NAME=$1
                   ORDER BY D.RATING DESC`;
    const params = [name];
    const ans = await database.query(query,params);

    if(ans.length===0) {
        res.status(404).json({ message: "Not found" });
        return;
    }

    const query2 = `SELECT P.TYPE_NAME
            FROM DESTINATION_TYPE D LEFT JOIN PLACE_TYPE P ON D.PLACE_TYPE_ID = P.PLACE_TYPE_ID
            WHERE D.DESTINATION_ID = $1`;
    const result2 = await database.query(query2,[ans[0].destination_id]);
    ans[0].type = result2;

    res.status(200).json(ans[0]);
});

// One page of the Destinations section, each destination with its place types.
// Takes the parameters in browse.js, plus ?types=Mountains,Lakes (at least one of these types)
router.get("/fetch",async(req,res)=>{
    const where = browseConditions(req.query, 'D');
    const types = listParam(req.query.types);
    if(types.length!==0)
    {
        where.add(`EXISTS (SELECT 1 FROM DESTINATION_TYPE DT2 JOIN PLACE_TYPE P2 ON P2.PLACE_TYPE_ID=DT2.PLACE_TYPE_ID
                           WHERE DT2.DESTINATION_ID=D.DESTINATION_ID AND P2.TYPE_NAME=ANY(?))`, types);
    }

    // the type joins give one row per destination and type; GROUP BY folds them back into one row per destination
    await sendPage(req, res, {
        select: `D.*,L.LOCATION_NAME,DIS.DISTRICT_NAME,DIV.DIVISION_NAME,
                 COALESCE(JSON_AGG(JSON_BUILD_OBJECT('type_name',P.TYPE_NAME)) FILTER (WHERE P.TYPE_NAME IS NOT NULL), '[]') AS TYPE`,
        from: `FROM DESTINATION D ${placeJoins('D')}
                        LEFT JOIN DESTINATION_TYPE DT ON DT.DESTINATION_ID=D.DESTINATION_ID
                        LEFT JOIN PLACE_TYPE P ON P.PLACE_TYPE_ID=DT.PLACE_TYPE_ID`,
        where,
        groupBy: 'GROUP BY D.DESTINATION_ID,L.LOCATION_NAME,DIS.DISTRICT_NAME,DIV.DIVISION_NAME',
        orderBy: 'D.RATING DESC,D.NAME,D.DESTINATION_ID',
    });
});

router.get("/review-rating/:destinationId/:customerId",async(req,res)=>{
    const id = req.params.destinationId;
    const customerId = req.params.customerId;

    const query = 
    `
        SELECT RATING FROM RATING
        WHERE CUSTOMER_ID=$1 AND ITEM_ID=$2 AND ITEM_TYPE='destination'
    `;
    const params = [customerId, id];
    const ans = await database.query(query,params);

    let result;
    if(ans.length===0)
    {
        result = 0;
    }
    else
    {
        result = ans[0].rating;
    }

    res.status(200).json(result);
});

router.get("/review-rating/:destinationId",async(req,res)=>{
    const id = req.params.destinationId;

    const query = 
    `
        SELECT RE.REVIEW, RA.RATING, TO_CHAR(RE.CREATED_AT, 'DD Mon, YYYY - HH12:MI:SS AM') AS CREATED_AT, U.USERNAME
        FROM REVIEW RE JOIN RATING RA ON RE.ITEM_ID=RA.ITEM_ID AND RE.ITEM_TYPE=RA.ITEM_TYPE AND RE.CUSTOMER_ID=RA.CUSTOMER_ID JOIN USERS U ON U.USER_ID=RE.CUSTOMER_ID
        WHERE RE.ITEM_ID=$1 AND RE.ITEM_TYPE='destination'
        ORDER BY RE.CREATED_AT DESC
    `;

    const params = [id];

    const ans = await database.query(query,params);
    res.status(200).json(ans);
});

// Only customers can rate/review; the reviewer is always the logged-in user
router.post("/review-rating/:id", requireAuth, requireRole('customer'), async(req,res)=>{
    const id = req.params.id;
    const review = req.body.review;
    const rating = req.body.rating;
    const customerId = req.user.id;

    // Rating and review are saved together or not at all
    await database.transaction(async (client) => {
        if(rating)
        {
            // One rating per customer per item; the update_item_rating trigger recalculates the item's average
            const query1 = 
            `
                INSERT INTO RATING (ITEM_ID,ITEM_TYPE,RATING,CUSTOMER_ID)
                VALUES ($1,'destination',$2,$3)
                ON CONFLICT (CUSTOMER_ID,ITEM_TYPE,ITEM_ID) DO UPDATE SET RATING = EXCLUDED.RATING
            `
            await client.query(query1,[id, rating, customerId]);
        }

        if(review && review.length!==0)
        {
            const query3 = 
            `
                INSERT INTO REVIEW (ITEM_ID,ITEM_TYPE,REVIEW,CUSTOMER_ID)
                VALUES ($1,'destination',$2,$3)
            `
            await client.query(query3,[id, review, customerId]);
        }
    });

    res.status(200).json({status:'ok'});
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
                        WHERE P.TYPE_NAME=$1
                        ORDER BY D.RATING DESC, D.RATING_COUNT DESC, D.NAME`;
        const params = [category];
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
