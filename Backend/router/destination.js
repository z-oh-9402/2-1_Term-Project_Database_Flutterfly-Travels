const router = require("express-promise-router")();
const database = require('../database');
const bcrypt = require('bcryptjs');

router.post("/",async(req,res)=>{
    const categories = req.body;

    let result = []

    for(let category of categories){
        const query = `SELECT D.*
                   FROM DESTINATION D RIGHT JOIN DESTINATION_TYPE DT ON D.DESTINATION_ID=DT.DESTINATION_ID
                   WHERE DT.PLACE_TYPE='${category}'`;
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