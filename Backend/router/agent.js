const router = require("express-promise-router")();
const database = require('../database');
const bcrypt = require('bcryptjs');

router.get("/:agentId",async(req,res)=>{
    const query = `SELECT C.passport_number, C.trip_booked, P.type_name
                   FROM Customer C ON C.CUSTOMER_ID=U.USER_ID LEFT JOIN CUSTOMER_PREFERENCE CP ON C.CUSTOMER_ID=CP.CUSTOMER_ID LEFT JOIN Place_Type P ON CP.PREFERENCE_ID=P.PLACE_TYPE_ID
                   WHERE C.CUSTOMER_ID=${req.params.customerId}`;
    const params = [];
    const ans = await database.query(query,params);

    let pref = [];
    for(let data of ans)
    {
        if(data.TYPE_NAME!=null)
        {
            pref.push(data.TYPE_NAME);
        }    
    }
    ans[0].PREFERENCES = pref;

    res.status(200).json(ans[0]);
});

module.exports = router;