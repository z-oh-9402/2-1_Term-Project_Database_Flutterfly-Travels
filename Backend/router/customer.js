const router = require("express-promise-router")();
const database = require('../database');
const bcrypt = require('bcryptjs');
const { upload, savePhoto, deletePhoto } = require('../file_handling');
const { signToken, requireAuth, requireSelfOrAdmin } = require('../auth');

router.get("/fetch", requireAuth, requireSelfOrAdmin(req => req.query.customerId), async(req,res)=>{
    const query = `SELECT C.passport_number, C.trip_booked, P.type_name
                   FROM Customer C LEFT JOIN CUSTOMER_PREFERENCE CP ON C.CUSTOMER_ID=CP.CUSTOMER_ID LEFT JOIN Place_Type P ON CP.PREFERENCE_ID=P.PLACE_TYPE_ID
                   WHERE C.CUSTOMER_ID=$1`;
    const params = [req.query.customerId];
    const ans = await database.query(query,params);

    let pref = [];
    for(let data of ans)
    {
        if(data.type_name!=null)
        {
            pref.push(data.type_name);
        }    
    }
    ans[0].preferences = pref;

    res.status(200).json(ans[0]);
});

// router.get("/:username",async(req,res)=>{
//     const query = `SELECT *
//                    FROM Users
//                    WHERE USERNAME=$1`;
//     const params = [req.params.username];
//     const ans = await database.query(query,params);

//     const result = {
//         status: ans.length === 0
//     }

//     res.status(200).json(result);
// });

router.post("/", upload.single('file'), async(req,res)=>{
    const user = req.body;
    user.preferences = JSON.parse(user.preferences);

    const plaintextPassword = user.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plaintextPassword, salt);

    // The photo is uploaded first, so its URL can be stored with the user
    const photo = req.file ? await savePhoto(req.file) : "";

    // The user, customer and preference rows are created together or not at all
    let newUser;
    try {
        newUser = await database.transaction(async (client) => {
            let query = `INSERT INTO Users (USERNAME, PASSWORD, FIRST_NAME, LAST_NAME, USER_TYPE, EMAIL, PHOTO)
                         VALUES ($1, $2, $3, $4, $5, $6, $7)
                         RETURNING *`;
            let params = [user.username, hashedPassword, user.firstName, user.lastName, 'customer', user.email, photo];
            const ans = (await client.query(query,params)).rows;

            query = `INSERT INTO Customer (CUSTOMER_ID,PASSPORT_NUMBER,TRIP_BOOKED)
                     VALUES ($1,$2,$3)`;
            params = [ans[0].user_id, user.passportNumber, 0]
            await client.query(query,params);

            delete ans[0].password;
            ans[0].passport_number = user.passportNumber;
            ans[0].trip_booked = 0;
            ans[0].preferences = [];
            
            for(let i=0;i<user.preferences.length;i++)
            {
                query = `INSERT INTO Customer_Preference (CUSTOMER_ID,PREFERENCE_ID) 
                         VALUES ($1,$2)`;
                params = [ans[0].user_id, user.preferences[i].id];
                await client.query(query,params);

                ans[0].preferences.push(user.preferences[i].name);
            }

            return ans[0];
        });
    }
    catch(error) {
        // Discard the photo already uploaded for this failed signup
        deletePhoto(photo);
        throw error;
    }

    newUser.token = signToken(newUser);
    res.status(200).json(newUser);
});

router.put("/:userId", requireAuth, requireSelfOrAdmin(req => req.params.userId), upload.single('file'), async(req,res)=>{
    const user = req.body;
    user.preferences = JSON.parse(user.preferences);
    const userId = req.params.userId;

    // The username must be free, or already belong to this user
    const taken = await database.query(`SELECT USER_ID FROM Users WHERE USERNAME=$1 AND USER_ID<>$2`,[user.username, userId]);
    if(taken.length!==0) {
        res.status(409).json({ message: "This username is already taken. Use another one." });
        return;
    }

    const photo_query = `SELECT PHOTO
                         FROM Users
                         WHERE USER_ID = $1`;
    const prev_user = await database.query(photo_query,[userId]);

    // An empty password means "keep the current one"
    let hashedPassword = null;
    if(user.password) {
        const salt = await bcrypt.genSalt(10);
        hashedPassword = await bcrypt.hash(user.password, salt);
    }

    // No new photo means "keep the current one"
    const photo = req.file ? await savePhoto(req.file) : null;

    // Users, Customer and the preference list are updated together or not at all
    let preferences = [];
    try {
        await database.transaction(async (client) => {
            let query = `UPDATE Users
                         SET USERNAME=$1, PASSWORD=COALESCE($2, PASSWORD),FIRST_NAME=$3,LAST_NAME=$4,EMAIL=$5, PHOTO=COALESCE($6, PHOTO)
                         WHERE USER_ID=$7`;
            let params = [user.username, hashedPassword, user.firstName, user.lastName, user.email, photo, userId];
            await client.query(query,params);

            query = `UPDATE Customer
                     SET PASSPORT_NUMBER=$1
                     WHERE CUSTOMER_ID=$2`
            await client.query(query,[user.passportNumber, userId]);

            query = `DELETE FROM Customer_Preference
                     WHERE CUSTOMER_ID=$1`;
            await client.query(query,[userId]);

            for(let i=0;i<user.preferences.length;i++)
            {
                query = `INSERT INTO Customer_Preference (CUSTOMER_ID,PREFERENCE_ID) 
                         VALUES ($1,$2)`;
                await client.query(query,[userId, user.preferences[i].id]);

                preferences.push(user.preferences[i].name);
            }
        });
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

    const res_query = `SELECT U.*,C.PASSPORT_NUMBER,C.TRIP_BOOKED
                       FROM Users U LEFT JOIN Customer C ON  U.USER_ID=C.CUSTOMER_ID
                       WHERE USER_ID=$1`;
    let ans = await database.query(res_query,[userId]);

    ans[0].preferences = preferences;
    delete ans[0].password;
    
    const result = ans[0];
    res.status(200).json(result);
});

module.exports = router;
