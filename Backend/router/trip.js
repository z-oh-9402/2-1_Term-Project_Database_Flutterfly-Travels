const router = require("express-promise-router")();
const database = require('../database');

router.get('/:userId', async (req, res) => {
    const { userId } = req.params;
    const query = `SELECT * FROM Trip WHERE CUSTOMER_ID = ${userId}`;
    const params = [];
    const result = await database.query(query,params);
    res.json(result);
})

module.exports = router;