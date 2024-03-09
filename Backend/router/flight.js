const router = require("express-promise-router")();
const database = require('../database');

router.post('/filtered-flights', async (req, res) => {
    const { departureAirport, arrivalAirport, seatClass, flightStyle } = req.body;

    const params = [];
    let query = `SELECT AIRPORT_ID FROM AIRPORT WHERE IATA_CODE = '${departureAirport}'`;
    let result = await database.query(query, params);
    const departureAirportId = result[0].AIRPORT_ID;

    query = `SELECT AIRPORT_ID FROM AIRPORT WHERE IATA_CODE = '${arrivalAirport}'`;
    result = await database.query(query, params);
    const arrivalAirportId = result[0].AIRPORT_ID;

    if(seatClass === "Economy")
    {
        query = `SELECT FLIGHT_ID, FLIGHT_STYLE, AIRLINE_NAME, IMAGE, TO_CHAR(DEPARTURE_TIME, 'YYYY-MM-DD')||'T'||TO_CHAR(DEPARTURE_TIME, 'HH24:MI:SS')||'Z' DEPARTURE_TIME, TO_CHAR(ARRIVAL_TIME, 'YYYY-MM-DD')||'T'||TO_CHAR(ARRIVAL_TIME, 'HH24:MI:SS')||'Z' ARRIVAL_TIME${flightStyle === "Round Trip" ? ", ECONOMY_SEAT_PRICE*2 SEAT_PRICE, RETURN_DEPARTURE_TIME, RETURN_ARRIVAL_TIME" : ", ECONOMY_SEAT_PRICE SEAT_PRICE"}
                 FROM FLIGHT
                 WHERE departure_airport_id=${departureAirportId} AND arrival_airport_id=${arrivalAirportId} AND FLIGHT_STYLE='${flightStyle}'
                 ORDER BY DEPARTURE_TIME`;
    }
    else if(seatClass === "Business")
    {
        query = `SELECT FLIGHT_ID, FLIGHT_STYLE, AIRLINE_NAME, IMAGE, TO_CHAR(DEPARTURE_TIME, 'YYYY-MM-DD')||'T'||TO_CHAR(DEPARTURE_TIME, 'HH24:MI:SS')||'Z' DEPARTURE_TIME, TO_CHAR(ARRIVAL_TIME, 'YYYY-MM-DD')||'T'||TO_CHAR(ARRIVAL_TIME, 'HH24:MI:SS')||'Z' ARRIVAL_TIME${flightStyle === "Round Trip" ? ", BUSINESS_SEAT_PRICE*2 SEAT_PRICE, RETURN_DEPARTURE_TIME, RETURN_ARRIVAL_TIME" : ", BUSINESS_SEAT_PRICE SEAT_PRICE"}
                 FROM FLIGHT
                 WHERE departure_airport_id=${departureAirportId} AND arrival_airport_id=${arrivalAirportId} AND FLIGHT_STYLE='${flightStyle}'
                 ORDER BY DEPARTURE_TIME`;
    }
    else
    {
        query = `SELECT FLIGHT_ID, FLIGHT_STYLE, AIRLINE_NAME, IMAGE, TO_CHAR(DEPARTURE_TIME, 'YYYY-MM-DD')||'T'||TO_CHAR(DEPARTURE_TIME, 'HH24:MI:SS')||'Z' DEPARTURE_TIME, TO_CHAR(ARRIVAL_TIME, 'YYYY-MM-DD')||'T'||TO_CHAR(ARRIVAL_TIME, 'HH24:MI:SS')||'Z' ARRIVAL_TIME${flightStyle === "Round Trip" ? ", FIRST_SEAT_PRICE*2 SEAT_PRICE, RETURN_DEPARTURE_TIME, RETURN_ARRIVAL_TIME" : ", FIRST_SEAT_PRICE SEAT_PRICE"}
                 FROM FLIGHT
                 WHERE departure_airport_id=${departureAirportId} AND arrival_airport_id=${arrivalAirportId} AND FLIGHT_STYLE='${flightStyle}'
                 ORDER BY DEPARTURE_TIME`;
    }
    
    result = await database.query(query, params);
    res.json(result);
});

module.exports = router;