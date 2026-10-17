const router = require("express-promise-router")();
const database = require('../database');
const { requireAuth, requireRole } = require('../auth');
const { placeJoins, numberParam, browseConditions, sendPage } = require('../browse');

router.get("/search",async(req,res)=>{
    const keyword = req.query.keyword.toLowerCase();

    let params = [`%${keyword}%`];
    let query = `SELECT A.NAME, L.LOCATION_NAME, DIS.DISTRICT_NAME
                   FROM ACCOMMODATION A JOIN Location L ON A.LOCATION_ID=L.LOCATION_ID JOIN District DIS ON DIS.DISTRICT_ID=L.DISTRICT_ID
                   WHERE LOWER(A.NAME) LIKE $1
                   ORDER BY NAME`;
    const des = await database.query(query,params);

    query = `WITH T(LOCATION_ID,COUNT) AS
             (SELECT L1.LOCATION_ID,COUNT(DISTINCT A.ACCOMMODATION_ID)
             FROM ACCOMMODATION A RIGHT JOIN Location L1 ON A.LOCATION_ID=L1.LOCATION_ID
             GROUP BY L1.LOCATION_ID)

             SELECT L.LOCATION_NAME,D.DISTRICT_NAME,DIV.DIVISION_NAME
             FROM Location L JOIN T ON T.LOCATION_ID=L.LOCATION_ID JOIN District D ON D.DISTRICT_ID=L.DISTRICT_ID JOIN Division DIV ON DIV.DIVISION_ID=D.DIVISION_ID
             WHERE LOWER(L.LOCATION_NAME) LIKE $1 AND T.COUNT>0
             ORDER BY T.COUNT DESC, L.LOCATION_NAME ASC`;
    const sDis = await database.query(query,params);

    query = `WITH T(DISTRICT_ID,COUNT) AS
             (SELECT D2.DISTRICT_ID,COUNT(DISTINCT A.ACCOMMODATION_ID)
             FROM ACCOMMODATION A JOIN Location L ON A.LOCATION_ID=L.LOCATION_ID RIGHT JOIN DISTRICT D2 ON D2.DISTRICT_ID=L.DISTRICT_ID
             GROUP BY D2.DISTRICT_ID)

             SELECT D.DISTRICT_NAME, DIV.DIVISION_NAME
             FROM District D JOIN T ON T.DISTRICT_ID=D.DISTRICT_ID JOIN Division DIV ON DIV.DIVISION_ID=D.DIVISION_ID 
             WHERE LOWER(D.DISTRICT_NAME) LIKE $1 AND T.COUNT>0
             ORDER BY T.COUNT DESC, D.DISTRICT_NAME ASC`;
    const dis = await database.query(query,params);

    query = `WITH T(DIVISION_ID,COUNT) AS
             (SELECT D3.DIVISION_ID,COUNT(DISTINCT A.ACCOMMODATION_ID)
             FROM ACCOMMODATION A JOIN Location L ON A.LOCATION_ID=L.LOCATION_ID JOIN DISTRICT D2 ON D2.DISTRICT_ID=L.DISTRICT_ID RIGHT JOIN Division D3 ON D3.DIVISION_ID = D2.DIVISION_ID
             GROUP BY D3.DIVISION_ID)

             SELECT D.DIVISION_NAME
             FROM Division D JOIN T ON T.DIVISION_ID=D.DIVISION_ID
             WHERE LOWER(D.DIVISION_NAME) LIKE $1 AND T.COUNT>0
             ORDER BY T.COUNT DESC, D.DIVISION_NAME ASC`;
    const div = await database.query(query,params);

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

router.get("/fetch/accommodation-name",async(req,res)=>{
    const name = req.query.name;

    const query = `SELECT A.*,L.LOCATION_NAME,DIS.DISTRICT_NAME,DIV.DIVISION_NAME
                        FROM ACCOMMODATION A LEFT JOIN Location L ON A.LOCATION_ID=L.LOCATION_ID 
                        LEFT JOIN District DIS ON DIS.DISTRICT_ID=L.DISTRICT_ID
                        LEFT JOIN Division DIV ON DIV.DIVISION_ID=DIS.DIVISION_ID
                   WHERE A.NAME=$1
                   ORDER BY A.RATING DESC`;
    const params = [name];
    const ans = await database.query(query,params);

    if(ans.length===0) {
        res.status(404).json({ message: "Not found" });
        return;
    }

    res.status(200).json(ans[0]);
});

// One page of the Accommodations section. Takes the parameters in browse.js, plus ?minCapacity=, ?minClass=,
// ?minPrice= / ?maxPrice= (room price) and ?facilities=free_wifi,pool (all of these)
router.get("/fetch",async(req,res)=>{
    const where = browseConditions(req.query, 'A');
    where.add('A.ROOM_CAPACITY>=?', numberParam(req.query.minCapacity));
    where.add('A.ACCOMMODATION_CLASS>=?', numberParam(req.query.minClass));
    where.add('A.ROOM_PRICE>=?', numberParam(req.query.minPrice));
    where.add('A.ROOM_PRICE<=?', numberParam(req.query.maxPrice));
    where.addFacilities(req.query.facilities, ['free_wifi','parking','breakfast','pool','accessible']);

    await sendPage(req, res, {
        select: 'A.*,L.LOCATION_NAME,DIS.DISTRICT_NAME,DIV.DIVISION_NAME',
        from: `FROM ACCOMMODATION A ${placeJoins('A')}`,
        where,
        orderBy: 'A.RATING DESC,A.NAME,A.ACCOMMODATION_ID',
    });
});

router.get("/review-rating/:accommodationId/:customerId",async(req,res)=>{
    const id = req.params.accommodationId;
    const customerId = req.params.customerId;

    const query = 
    `
        SELECT RATING FROM RATING
        WHERE CUSTOMER_ID=$1 AND ITEM_ID=$2 AND ITEM_TYPE='accommodation'
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

router.get("/review-rating/:accommodationId",async(req,res)=>{
    const id = req.params.accommodationId;

    const query = 
    `
        SELECT RE.REVIEW, RA.RATING, TO_CHAR(RE.CREATED_AT, 'DD Mon, YYYY - HH12:MI:SS AM') AS CREATED_AT, U.USERNAME
        FROM REVIEW RE JOIN RATING RA ON RE.ITEM_ID=RA.ITEM_ID AND RE.ITEM_TYPE=RA.ITEM_TYPE AND RE.CUSTOMER_ID=RA.CUSTOMER_ID JOIN USERS U ON U.USER_ID=RE.CUSTOMER_ID
        WHERE RE.ITEM_ID=$1 AND RE.ITEM_TYPE='accommodation'
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
                VALUES ($1,'accommodation',$2,$3)
                ON CONFLICT (CUSTOMER_ID,ITEM_TYPE,ITEM_ID) DO UPDATE SET RATING = EXCLUDED.RATING
            `
            await client.query(query1,[id, rating, customerId]);
        }

        if(review && review.length!==0)
        {
            const query3 = 
            `
                INSERT INTO REVIEW (ITEM_ID,ITEM_TYPE,REVIEW,CUSTOMER_ID)
                VALUES ($1,'accommodation',$2,$3)
            `
            await client.query(query3,[id, review, customerId]);
        }
    });

    res.status(200).json({status:'ok'});
});

module.exports = router;
