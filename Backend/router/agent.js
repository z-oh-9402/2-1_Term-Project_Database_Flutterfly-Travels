const router = require("express-promise-router")();
const database = require('../database');
const bcrypt = require('bcryptjs');
const { upload, deleting } = require('../file_handling');
const { signToken, requireAuth, requireRole, requireSelfOrAdmin } = require('../auth');

router.get("/review-rating/:agentId/:customerId",async(req,res)=>{
    const id = req.params.agentId;
    const customerId = req.params.customerId;

    const query = 
    `
        SELECT RATING FROM RATING
        WHERE CUSTOMER_ID=$1 AND ITEM_ID=$2 AND ITEM_TYPE='agent'
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

router.get("/review-rating/:agentId",async(req,res)=>{
    const id = req.params.agentId;

    const query = 
    `
        SELECT RE.REVIEW, RA.RATING, TO_CHAR(RE.CREATED_AT, 'DD Mon, YYYY - HH12:MI:SS AM') AS CREATED_AT, U.USERNAME
        FROM REVIEW RE JOIN RATING RA ON RE.ITEM_ID=RA.ITEM_ID AND RE.ITEM_TYPE=RA.ITEM_TYPE AND RE.CUSTOMER_ID=RA.CUSTOMER_ID JOIN USERS U ON U.USER_ID=RE.CUSTOMER_ID
        WHERE RE.ITEM_ID=$1 AND RE.ITEM_TYPE='agent'
        ORDER BY RE.CREATED_AT DESC
    `;

    const params = [id];

    const ans = await database.query(query,params);
    res.status(200).json(ans);
});

router.get("/pending-agents", requireAuth, requireRole('admin'), async(req,res)=>{
    const query = `SELECT U.*, A.EXPERIENCE_YEARS, A.FEE, A.ACC_STATUS
                   FROM Users U RIGHT JOIN Agent A ON U.USER_ID = A.AGENT_ID
                   WHERE ACC_STATUS = 'PENDING'`;
    const params = [];
    const ans = await database.query(query,params);
    ans.forEach(agent => delete agent.password);

    res.status(200).json(ans);
});

router.get("/search",async(req,res)=>{
    const query = `SELECT U.*, A.EXPERIENCE_YEARS, A.FEE, A.RATING
                   FROM USERS U JOIN Agent A ON U.USER_ID = A.AGENT_ID 
                   WHERE U.USERNAME LIKE $1 AND A.ACC_STATUS='OK'`;
    const params = [`%${req.query.keyword}%`];
    const ans = await database.query(query,params);
    ans.forEach(agent => delete agent.password);

    res.status(200).json({
        status: ans.length>0,
        data: ans
    });
});

router.get("/fetch/:agentId",async(req,res)=>{
    
    const query = `SELECT U.*, A.EXPERIENCE_YEARS, A.FEE, A.RATING
                   FROM USERS U JOIN Agent A ON U.USER_ID = A.AGENT_ID 
                   WHERE A.AGENT_ID=$1`;
    const params = [req.params.agentId];
    const ans = await database.query(query,params);
    ans.forEach(agent => delete agent.password);

    if(ans.length===0) {
        res.status(404).json({ message: "Not found" });
        return;
    }

    res.status(200).json(ans[0]);
});

router.get("/:agentId",async(req,res)=>{
    const query = `SELECT *
                   FROM Agent
                   WHERE AGENT_ID=$1`;
    const params = [req.params.agentId];
    const ans = await database.query(query,params);

    if(ans.length===0) {
        res.status(404).json({ message: "Not found" });
        return;
    }

    res.status(200).json(ans[0]);
});

// Only customers can rate/review; the reviewer is always the logged-in user
router.post("/review-rating/:id", requireAuth, requireRole('customer'), async(req,res)=>{
    const id = req.params.id;
    const review = req.body.review;
    const rating = req.body.rating;
    const customerId = req.user.id;

    // Rating upsert, average recompute and review insert succeed or fail together
    await database.transaction(async (client) => {
        if(rating!==0)
        {
            const query1 = 
            `
                SELECT * FROM RATING
                WHERE CUSTOMER_ID=$1 AND ITEM_ID=$2 AND ITEM_TYPE='agent'
            `
            const ans = (await client.query(query1,[customerId, id])).rows;

            if(ans.length===0)
            {
                const query2 = 
                `
                    INSERT INTO RATING (ITEM_ID,ITEM_TYPE,RATING,CUSTOMER_ID)
                    VALUES ($1,'agent',$2,$3)
                `
                await client.query(query2,[id, rating, customerId]);
            }
            else
            {
                const query2 = 
                `
                    UPDATE RATING SET RATING=$1 WHERE ITEM_ID=$2 AND ITEM_TYPE='agent' AND CUSTOMER_ID=$3
                `
                await client.query(query2,[rating, id, customerId]);
            }

            const ratingUpdateQuery = 
            `
                UPDATE AGENT
                SET RATING=(SELECT ROUND(AVG(RATING),1) FROM RATING WHERE ITEM_ID=$1 AND ITEM_TYPE='agent') 
                WHERE AGENT_ID=$1
            `
            await client.query(ratingUpdateQuery,[id]);
        }

        if(review && review.length!==0)
        {
            const query3 = 
            `
                INSERT INTO REVIEW (ITEM_ID,ITEM_TYPE,REVIEW,CUSTOMER_ID)
                VALUES ($1,'agent',$2,$3)
            `
            await client.query(query3,[id, review, customerId]);
        }
    });

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

    // The user row and the agent row are created together or not at all
    let newUser;
    try {
        newUser = await database.transaction(async (client) => {
            const query = `INSERT INTO Users (USERNAME, PASSWORD, FIRST_NAME, LAST_NAME, USER_TYPE, EMAIL, PHOTO)
                           VALUES ($1, $2, $3, $4, $5, $6, $7)
                           RETURNING *`;
            const params = [user.username, hashedPassword, user.firstName, user.lastName, 'agent', user.email, req.file.filename];
            const ans = (await client.query(query,params)).rows;

            const query2 = `INSERT INTO Agent (AGENT_ID,EXPERIENCE_YEARS,FEE, ACC_STATUS, RATING)
                            VALUES ($1,$2,$3,'PENDING', 0)`;
            await client.query(query2,[ans[0].user_id, user.experience, user.fee]);

            return ans[0];
        });
    }
    catch(error) {
        // Discard the photo multer already saved for this failed signup
        req.file.filename && deleting("uploads/"+req.file.filename);
        throw error;
    }

    delete newUser.password;
    newUser.experience_years = user.experience;
    newUser.fee = user.fee;
    newUser.acc_status = "PENDING";
    newUser.rating = 0;

    newUser.token = signToken(newUser);
    res.status(200).json(newUser);
});

router.put("/acceptRequest/:agentId", requireAuth, requireRole('admin'), async (req, res) => {
    const agentId = req.params.agentId;

    const query = `UPDATE Agent
                   SET ACC_STATUS = 'OK'
                   WHERE AGENT_ID = $1`;
    const params = [agentId];
    await database.query(query, params);

    res.status(200).json({
        status: 1,
        message: `Agent with ID ${agentId} has been approved.`
    });
});

router.put("/declineRequest/:agentId", requireAuth, requireRole('admin'), async (req, res) => {
    const agentId = req.params.agentId;

    const query = `UPDATE Agent
                   SET ACC_STATUS = 'DECLINED'
                   WHERE AGENT_ID = $1`;
    const params = [agentId];
    await database.query(query, params);

    res.status(200).json({
        status: 1,
        message: `Agent with ID ${agentId} has been declined.`
    });
});

router.put("/:userId", requireAuth, requireSelfOrAdmin(req => req.params.userId), upload.single('file'), async(req,res)=>{
    const user = req.body;
    const userId = Number(req.params.userId);

    let result = {
        status: false,
        data: undefined
    }

    const check_query = `SELECT USER_ID FROM Users WHERE USERNAME=$1`;
    let ans = await database.query(check_query,[user.username]);

    // The username must be free, or already belong to this user
    if(ans.length!==0 && ans[0].user_id!==userId)
    {
        // Discard the photo multer already saved for this rejected update
        req.file && deleting("uploads/"+req.file.filename);
    }
    else
    {
        const prev_user = await database.query(`SELECT PHOTO FROM Users WHERE USER_ID=$1`,[userId]);

        // An empty password means "keep the current one"
        let hashedPassword = null;
        if(user.password) {
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(user.password, salt);
        }

        const query = `UPDATE Users
                       SET USERNAME=$1, PASSWORD=COALESCE($2, PASSWORD), FIRST_NAME=$3, LAST_NAME=$4, EMAIL=$5, PHOTO=COALESCE($6, PHOTO)
                       WHERE USER_ID=$7`;
        await database.query(query,[user.username, hashedPassword, user.firstName, user.lastName, user.email, req.file ? req.file.filename : null, userId]);

        // Replace the photo only when a new one was uploaded (old file removed once the update succeeded)
        if(req.file && prev_user.length!==0 && prev_user[0].photo) {
            deleting("uploads/"+prev_user[0].photo);
        }

        const res_query = `SELECT U.*, A.EXPERIENCE_YEARS, A.FEE
                           FROM Users U LEFT JOIN Agent A ON U.USER_ID = A.AGENT_ID
                           WHERE USER_ID=$1`;
        ans = await database.query(res_query,[userId]);
        delete ans[0].password;
        result.status = true;
        result.data = ans[0];
    }

    res.status(200).json(result);
});

module.exports = router;