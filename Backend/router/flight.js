const router = require("express-promise-router")();
const database = require('../database');

router.post('/filtered-flights', async (req, res) => {
    const { departureAirport, arrivalAirport, seatClass, flightStyle } = req.body;

    const oracledb = database.oracledb;
    const query = `BEGIN 
                   FETCH_FILTERED_FLIGHTS (:departureAirport , :arrivalAirport, :seatClass, :flightStyle, :cursor);
                   END;`;

    const binds = {
        departureAirport: departureAirport,
        arrivalAirport: arrivalAirport,
        seatClass: seatClass,
        flightStyle: flightStyle,
        cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
    };

    const result = await database.query2(query, binds);

    const resultSet = await result.cursor.getRows();
    await result.cursor.close();

    res.status(200).json(resultSet);
});

module.exports = router;