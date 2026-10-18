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

    // An empty airport or seat class is sent as NULL, which the procedure reads as "any"
    let params = [departureAirport || null, arrivalAirport || null, seatClass || null, flightStyle, "filtered_flights_cursor"]

    // The cursor opened by the procedure only exists on the connection that called it, so all steps share one
    const result = await database.transaction(async (client) => {
        const call = await client.query(`CALL FETCH_FILTERED_FLIGHTS($1, $2, $3, $4, $5)`, params);
        const cursor = call.rows[0].p_cursor;

        const flights = await client.query(`FETCH ALL IN "${cursor}"`);
        await client.query(`CLOSE "${cursor}"`);

        return flights.rows;
    });

    res.status(200).json(result);
});

module.exports = router;