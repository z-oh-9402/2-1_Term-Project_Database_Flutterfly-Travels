const router = require("express-promise-router")();
const database = require('../database');
const bcrypt = require('bcryptjs');
const { upload, savePhoto, deletePhoto } = require('../file_handling');
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
        SELECT RE.REVIEW_ID, RE.REVIEW, RA.RATING, TO_CHAR(RE.CREATED_AT, 'DD Mon YYYY') AS CREATED_AT, U.USERNAME, U.PHOTO
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
    const query = `SELECT U.*, A.EXPERIENCE_YEARS, A.FEE, A.RATING, A.RATING_COUNT
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
    
    const query = `SELECT U.*, A.EXPERIENCE_YEARS, A.FEE, A.RATING, A.RATING_COUNT
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

    // Only customers the agent has worked with (a trip of theirs the agent accepted) can rate or review them
    const worked = await database.query(
        `SELECT 1 FROM TRIP WHERE CUSTOMER_ID=$1 AND AGENT_ID=$2 AND TRIP_STATUS <> 'REQUESTING' LIMIT 1`,
        [customerId, id]);
    if(worked.length===0)
    {
        res.status(403).json({ message: "You can review an agent once they have taken one of your trips" });
        return;
    }
    if(!rating)
    {
        res.status(400).json({ message: "Please choose a rating" });
        return;
    }

    // Rating and review are saved together or not at all
    await database.transaction(async (client) => {
        if(rating)
        {
            // One rating per customer per item; the update_item_rating trigger recalculates the item's average
            const query1 = 
            `
                INSERT INTO RATING (ITEM_ID,ITEM_TYPE,RATING,CUSTOMER_ID)
                VALUES ($1,'agent',$2,$3)
                ON CONFLICT (CUSTOMER_ID,ITEM_TYPE,ITEM_ID) DO UPDATE SET RATING = EXCLUDED.RATING
            `
            await client.query(query1,[id, rating, customerId]);
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

    // The photo is uploaded first, so its URL can be stored with the user
    const photo = req.file ? await savePhoto(req.file) : "";

    // The user row and the agent row are created together or not at all
    let newUser;
    try {
        newUser = await database.transaction(async (client) => {
            const query = `INSERT INTO Users (USERNAME, PASSWORD, FIRST_NAME, LAST_NAME, USER_TYPE, EMAIL, PHOTO)
                           VALUES ($1, $2, $3, $4, $5, $6, $7)
                           RETURNING *`;
            const params = [user.username, hashedPassword, user.firstName, user.lastName, 'agent', user.email, photo];
            const ans = (await client.query(query,params)).rows;

            const query2 = `INSERT INTO Agent (AGENT_ID,EXPERIENCE_YEARS,FEE, ACC_STATUS, RATING)
                            VALUES ($1,$2,$3,'PENDING', 0)`;
            await client.query(query2,[ans[0].user_id, user.experience, user.fee]);

            return ans[0];
        });
    }
    catch(error) {
        // Discard the photo already uploaded for this failed signup
        deletePhoto(photo);
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
    if(ans.length===0 || ans[0].user_id===userId)
    {
        const prev_user = await database.query(`SELECT PHOTO FROM Users WHERE USER_ID=$1`,[userId]);

        // An empty password means "keep the current one"
        let hashedPassword = null;
        if(user.password) {
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(user.password, salt);
        }

        // No new photo means "keep the current one"
        const photo = req.file ? await savePhoto(req.file) : null;

        const query = `UPDATE Users
                       SET USERNAME=$1, PASSWORD=COALESCE($2, PASSWORD), FIRST_NAME=$3, LAST_NAME=$4, EMAIL=$5, PHOTO=COALESCE($6, PHOTO)
                       WHERE USER_ID=$7`;
        try {
            await database.query(query,[user.username, hashedPassword, user.firstName, user.lastName, user.email, photo, userId]);
        }
        catch(error) {
            // Discard the photo already uploaded for this failed update
            deletePhoto(photo);
            throw error;
        }

        // Replace the photo only when a new one was uploaded (old one removed once the update succeeded)
        if(photo && prev_user.length!==0) {
            deletePhoto(prev_user[0].photo);
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