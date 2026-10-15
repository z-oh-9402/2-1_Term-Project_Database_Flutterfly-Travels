const router = require("express-promise-router")();
const database = require('../database');
const bcrypt = require('bcryptjs');
const { upload, deleting } = require('../file_handling');

router.get("/review-rating/:agentId/:customerId",async(req,res)=>{
    const id = req.params.agentId;
    const customerId = req.params.customerId;

    const query = 
    `
        SELECT RATING FROM RATING
        WHERE CUSTOMER_ID=${customerId} AND ITEM_ID=${id} AND ITEM_TYPE='agent'
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

router.get("/review-rating/:agentId",async(req,res)=>{
    const id = req.params.agentId;

    const query = 
    `
        SELECT RE.REVIEW, RA.RATING, TO_CHAR(RE.CREATED_AT, 'DD Mon, YYYY - HH12:MI:SS AM') AS CREATED_AT, U.USERNAME
        FROM REVIEW RE JOIN RATING RA ON RE.ITEM_ID=RA.ITEM_ID AND RE.ITEM_TYPE=RA.ITEM_TYPE AND RE.CUSTOMER_ID=RA.CUSTOMER_ID JOIN USERS U ON U.USER_ID=RE.CUSTOMER_ID
        WHERE RE.ITEM_ID=${id} AND RE.ITEM_TYPE='agent'
        ORDER BY RE.CREATED_AT DESC
    `;

    const params = [];

    const ans = await database.query(query,params);
    res.status(200).json(ans);
});

router.get("/pending-agents",async(req,res)=>{
    const query = `SELECT U.*, A.EXPERIENCE_YEARS, A.FEE, A.ACC_STATUS
                   FROM Users U RIGHT JOIN Agent A ON U.USER_ID = A.AGENT_ID
                   WHERE ACC_STATUS = 'PENDING'`;
    const params = [];
    const ans = await database.query(query,params);

    res.status(200).json(ans);
});

router.get("/search",async(req,res)=>{
    const query = `SELECT U.*, A.EXPERIENCE_YEARS, A.FEE, A.RATING
                   FROM USERS U JOIN Agent A ON U.USER_ID = A.AGENT_ID 
                   WHERE U.USERNAME LIKE '%${req.query.keyword}%' AND A.ACC_STATUS='OK'`;
    const params = [];
    const ans = await database.query(query,params);

    res.status(200).json({
        status: ans.length>0,
        data: ans
    });
});

router.get("/fetch/:agentId",async(req,res)=>{
    
    const query = `SELECT U.*, A.EXPERIENCE_YEARS, A.FEE, A.RATING
                   FROM USERS U JOIN Agent A ON U.USER_ID = A.AGENT_ID 
                   WHERE A.AGENT_ID=${req.params.agentId}`;
    const params = [];
    const ans = await database.query(query,params);

    res.status(200).json(ans[0]);
});

router.get("/:agentId",async(req,res)=>{
    const query = `SELECT *
                   FROM Agent
                   WHERE AGENT_ID=${req.params.agentId}`;
    const params = [];
    const ans = await database.query(query,params);

    res.status(200).json(ans[0]);
});

router.post("/review-rating/:id",async(req,res)=>{
    const id = req.params.id;
    const reviews = req.body.review;
    const rating = req.body.rating;
    const customerId = req.body.customerId;

    const review = reviews.replace(`'`,`''`);

    const params = [];
    if(rating!==0)
    {
        const query1 = 
        `
            SELECT * FROM RATING
            WHERE CUSTOMER_ID=${customerId} AND ITEM_ID=${id} AND ITEM_TYPE='agent'
        `
        const ans = await database.query(query1,params);

        if(ans.length===0)
        {
            const query2 = 
            `
                INSERT INTO RATING (ITEM_ID,ITEM_TYPE,RATING,CUSTOMER_ID)
                VALUES (${id},'agent','${rating}',${customerId})
            `
            await database.query(query2,params);
        }
        else
        {
            const query2 = 
            `
                UPDATE RATING SET RATING=${rating} WHERE ITEM_ID=${id} AND ITEM_TYPE='agent' AND CUSTOMER_ID=${customerId}
            `
            await database.query(query2,params);
        }

        const ratingUpdateQuery = 
        `
            UPDATE AGENT
            SET RATING=(SELECT ROUND(AVG(RATING),1) FROM RATING WHERE ITEM_ID=${id} AND ITEM_TYPE='agent') 
            WHERE AGENT_ID=${id}
        `
        await database.query(ratingUpdateQuery,params);
    }

    if(review.length!==0)
    {
        const query3 = 
        `
            INSERT INTO REVIEW (ITEM_ID,ITEM_TYPE,REVIEW,CUSTOMER_ID)
            VALUES (${id},'restaurant','${review}',${customerId})
        `
        await database.query(query3,params);
    }

    await database.query('commit',params);

    res.status(200).json({status:'ok'});
});

router.post("/", upload.single('file'), async(req,res)=>{
    const user = req.body;

    const plaintextPassword = user.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plaintextPassword, salt);

    if(req.file === undefined) {
        req.file = { filename: "" }
    }

    const query = `INSERT INTO Users (USERNAME, PASSWORD, FIRST_NAME, LAST_NAME, USER_TYPE, EMAIL, PHOTO)
                   VALUES ($1, $2, $3, $4, $5, $6, $7)`;
    let params = [user.username, hashedPassword, user.firstName, user.lastName, user.userType, user.email, req.file.filename];
    await database.query(query,params);

    const res_query = `SELECT *
                       FROM Users
                       WHERE USERNAME='${user.username}'`;
    params = [];
    let ans = await database.query(res_query,params);

    const query2 = `INSERT INTO Agent (AGENT_ID,EXPERIENCE_YEARS,FEE, ACC_STATUS, RATING)
                    VALUES (${ans[0].user_id},${user.experience},${user.fee},'PENDING', 0)`;
    await database.query(query2,params);

    ans[0].password = user.password;
    ans[0].experience_years = user.experience;
    ans[0].fee = user.fee;
    ans[0].acc_status = "PENDING";
    ans[0].rating = 0;

    await database.query('commit',params);

    res.status(200).json(ans[0]);
});

router.put("/acceptRequest/:agentId", async (req, res) => {
    const agentId = req.params.agentId;

    const query = `UPDATE Agent
                   SET ACC_STATUS = 'OK'
                   WHERE AGENT_ID = ${agentId}`;
    const params = [];
    await database.query(query, params);
    await database.query('commit', params);

    res.status(200).json({
        status: 1,
        message: `Agent with ID ${agentId} has been approved.`
    });
});

router.put("/declineRequest/:agentId", async (req, res) => {
    const agentId = req.params.agentId;

    const query = `UPDATE Agent
                   SET ACC_STATUS = 'DECLINED'
                   WHERE AGENT_ID = ${agentId}`;
    const params = [];
    await database.query(query, params);
    await database.query('commit', params);

    res.status(200).json({
        status: 1,
        message: `Agent with ID ${agentId} has been declined.`
    });
});

router.put("/:userId",async(req,res)=>{
    const user = req.body;

    let result = {
        status: false,
        data: undefined
    }

    const check_query = `SELECT * FROM Users WHERE USERNAME='${user.username}'`;
    const params = [];
    let ans = await database.query(check_query,params);

    if(ans.length===0  || ans[0].USER_ID!==req.params.userId)
    {
        const plaintextPassword = user.password;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(plaintextPassword, salt);

        const query = `UPDATE Users
                       SET USERNAME='${user.username}',PASSWORD='${hashedPassword}',FIRST_NAME='${user.firstName}',LAST_NAME='${user.lastName}',EMAIL='${user.email}'
                       WHERE USER_ID=${req.params.userId}`;
        await database.query(query,params);
        await database.query('commit',params);

        const res_query = `SELECT U.*, A.EXPERIENCE_YEARS, A.FEE
                           FROM Users U LEFT JOIN Agent A ON U.USER_ID = A.AGENT_ID
                           WHERE USER_ID=${req.params.userId}`;
        ans = await database.query(res_query,params);
        result.status = true;
        result.data = ans[0];
    }

    res.status(200).json(result);
});

module.exports = router;