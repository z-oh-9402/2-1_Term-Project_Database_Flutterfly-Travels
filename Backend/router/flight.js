const router = require("express-promise-router")();
const database = require('../database');

router.get('/airports', async (req, res) => {
    const query = `SELECT A.IATA_CODE, A.NAME, D.DISTRICT_NAME
                   FROM AIRPORT A LEFT JOIN LOCATION L ON A.LOCATION_ID=L.LOCATION_ID
                   LEFT JOIN DISTRICT D ON L.DISTRICT_ID=D.DISTRICT_ID
                   ORDER BY A.AIRPORT_ID`;
    const result = await database.query(query, []);

    res.status(200).json(result);
});

router.post('/filtered-flights', async (req, res) => {
    const { departureAirport, arrivalAirport, seatClass, flightStyle } = req.body;

    let params = [departureAirport, arrivalAirport, seatClass, flightStyle, "filtered_flights_cursor"]

    await database.query(`BEGIN`,[]);
    
    let result = await database.query(`CALL FETCH_FILTERED_FLIGHTS($1, $2, $3, $4, $5)`, params);
    const cursor = result[0].p_cursor;

    result = await database.query(`FETCH ALL IN "${cursor}"`, []);

    await database.query(`CLOSE "${cursor}"`,[]);

    res.status(200).json(result);
});

module.exports = router;