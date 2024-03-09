const router = require("express-promise-router")();
const database = require('../database');

router.get('/destination', async (req, res) => {
    const { userId, itemId } = req.query;

    const params = [];
    let query = `SELECT * FROM DESTINATION_WISHLIST WHERE CUSTOMER_ID=${userId} AND DESTINATION_ID=${itemId}`;
    const result = await database.query(query, params);

    res.json(result.length > 0);
});

router.get('/accommodation', async (req, res) => {
    const { userId, itemId } = req.query;

    const params = [];
    let query = `SELECT * FROM ACCOMMODATION_WISHLIST WHERE CUSTOMER_ID=${userId} AND ACCOMMODATION_ID=${itemId}`;
    const result = await database.query(query, params);

    res.json(result.length > 0);
});

router.get('/restaurant', async (req, res) => {
    const { userId, itemId } = req.query;

    const params = [];
    let query = `SELECT * FROM RESTAURANT_WISHLIST WHERE CUSTOMER_ID=${userId} AND RESTAURANT_ID=${itemId}`;
    const result = await database.query(query, params);

    res.json(result.length > 0);
});

router.post('/destination', async (req, res) => {
    const { userId, itemId } = req.body;

    const params = [];
    let query = `INSERT INTO DESTINATION_WISHLIST(CUSTOMER_ID, DESTINATION_ID) VALUES(${userId}, ${itemId})`;
    await database.query(query, params);

    res.json({ status: true });
});

router.delete('/destination', async (req, res) => {
    const { userId, itemId } = req.body;

    const params = [];
    let query = `DELETE FROM DESTINATION_WISHLIST WHERE CUSTOMER_ID=${userId} AND DESTINATION_ID=${itemId}`;
    await database.query(query, params);

    res.json({ status: true });
});

router.post('/accommodation', async (req, res) => {
    const { userId, itemId } = req.body;

    const params = [];
    let query = `INSERT INTO ACCOMMODATION_WISHLIST(CUSTOMER_ID, ACCOMMODATION_ID) VALUES(${userId}, ${itemId})`;
    await database.query(query, params);

    res.json({ status: true });
});

router.delete('/accommodation', async (req, res) => {
    const { userId, itemId } = req.body;

    const params = [];
    let query = `DELETE FROM ACCOMMODATION_WISHLIST WHERE CUSTOMER_ID=${userId} AND ACCOMMODATION_ID=${itemId}`;
    await database.query(query, params);

    res.json({ status: true });
});

router.post('/restaurant', async (req, res) => {
    const { userId, itemId } = req.body;

    const params = [];
    let query = `INSERT INTO RESTAURANT_WISHLIST(CUSTOMER_ID, RESTAURANT_ID) VALUES(${userId}, ${itemId})`;
    await database.query(query, params);

    res.json({ status: true });
});

router.delete('/restaurant', async (req, res) => {
    const { userId, itemId } = req.body;

    const params = [];
    let query = `DELETE FROM RESTAURANT_WISHLIST WHERE CUSTOMER_ID=${userId} AND RESTAURANT_ID=${itemId}`;
    await database.query(query, params);

    res.json({ status: true });
});

module.exports = router;