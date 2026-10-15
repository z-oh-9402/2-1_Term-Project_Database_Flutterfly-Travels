const router = require("express-promise-router")();
const database = require('../database');
const { requireAuth, requireRole } = require('../auth');

// Only customers have wishlists
router.use(requireAuth, requireRole('customer'));

// Every route acts on the logged-in user's own wishlist (req.user.id); a userId sent by the client is ignored
router.get('/fetch', async (req, res) => {
    const userId = req.user.id;

    const params = [userId];
    let query = `SELECT DW.WISHLIST_ID, D.* 
                 FROM DESTINATION_WISHLIST DW JOIN DESTINATION D ON DW.DESTINATION_ID=D.DESTINATION_ID
                 WHERE CUSTOMER_ID=$1`;
    const destinations = await database.query(query, params);

    query = `SELECT AW.WISHLIST_ID, A.* 
             FROM ACCOMMODATION_WISHLIST AW JOIN ACCOMMODATION A ON AW.ACCOMMODATION_ID=A.ACCOMMODATION_ID
             WHERE CUSTOMER_ID=$1`;
    const accommodations = await database.query(query, params);

    query = `SELECT RW.WISHLIST_ID, R.*
             FROM RESTAURANT_WISHLIST RW JOIN RESTAURANT R ON RW.RESTAURANT_ID=R.RESTAURANT_ID
             WHERE CUSTOMER_ID=$1`;
    const restaurants = await database.query(query, params);

    const result = 
        [
            {
                category: "destination",
                items: destinations,
            },
            {
                category: "accommodation",
                items: accommodations,
            },
            {
                category: "restaurant",
                items: restaurants,
            }
        ];

    res.json(result);
});

router.get('/destination', async (req, res) => {
    const { itemId } = req.query;

    const params = [req.user.id, itemId];
    let query = `SELECT * FROM DESTINATION_WISHLIST WHERE CUSTOMER_ID=$1 AND DESTINATION_ID=$2`;
    const result = await database.query(query, params);

    res.json(result.length > 0);
});

router.get('/accommodation', async (req, res) => {
    const { itemId } = req.query;

    const params = [req.user.id, itemId];
    let query = `SELECT * FROM ACCOMMODATION_WISHLIST WHERE CUSTOMER_ID=$1 AND ACCOMMODATION_ID=$2`;
    const result = await database.query(query, params);

    res.json(result.length > 0);
});

router.get('/restaurant', async (req, res) => {
    const { itemId } = req.query;

    const params = [req.user.id, itemId];
    let query = `SELECT * FROM RESTAURANT_WISHLIST WHERE CUSTOMER_ID=$1 AND RESTAURANT_ID=$2`;
    const result = await database.query(query, params);

    res.json(result.length > 0);
});

router.post('/destination', async (req, res) => {
    const { itemId } = req.body;

    const params = [req.user.id, itemId];
    let query = `INSERT INTO DESTINATION_WISHLIST(CUSTOMER_ID, DESTINATION_ID) VALUES($1, $2)`;
    await database.query(query, params);

    res.json({ status: true });
});

router.delete('/destination', async (req, res) => {
    const { itemId } = req.body;

    const params = [req.user.id, itemId];
    let query = `DELETE FROM DESTINATION_WISHLIST WHERE CUSTOMER_ID=$1 AND DESTINATION_ID=$2`;
    await database.query(query, params);

    res.json({ status: true });
});

router.post('/accommodation', async (req, res) => {
    const { itemId } = req.body;

    const params = [req.user.id, itemId];
    let query = `INSERT INTO ACCOMMODATION_WISHLIST(CUSTOMER_ID, ACCOMMODATION_ID) VALUES($1, $2)`;
    await database.query(query, params);

    res.json({ status: true });
});

router.delete('/accommodation', async (req, res) => {
    const { itemId } = req.body;

    const params = [req.user.id, itemId];
    let query = `DELETE FROM ACCOMMODATION_WISHLIST WHERE CUSTOMER_ID=$1 AND ACCOMMODATION_ID=$2`;
    await database.query(query, params);

    res.json({ status: true });
});

router.post('/restaurant', async (req, res) => {
    const { itemId } = req.body;

    const params = [req.user.id, itemId];
    let query = `INSERT INTO RESTAURANT_WISHLIST(CUSTOMER_ID, RESTAURANT_ID) VALUES($1, $2)`;
    await database.query(query, params);

    res.json({ status: true });
});

router.delete('/restaurant', async (req, res) => {
    const { itemId } = req.body;

    const params = [req.user.id, itemId];
    let query = `DELETE FROM RESTAURANT_WISHLIST WHERE CUSTOMER_ID=$1 AND RESTAURANT_ID=$2`;
    await database.query(query, params);

    res.json({ status: true });
});

module.exports = router;