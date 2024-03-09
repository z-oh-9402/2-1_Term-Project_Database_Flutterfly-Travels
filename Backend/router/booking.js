const router = require("express-promise-router")();
const { query } = require("express");
const database = require('../database');

router.post("/add-accommodation-booking", async (req, res) => {
    const { itemId, tripId, checkInDate, checkOutDate, numberOfRooms, totalCost, bookingType } = req.body;

    const oracledb = database.oracledb;
    let query = 
    `BEGIN
        :ret := GET_BOOKING_ID(:tripId, :bookingType, :totalCost);
     END;`;

    const binds = {
        ret: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        tripId: tripId,
        bookingType: bookingType,
        totalCost: totalCost,
    };
    const ans = await database.query2(query,binds);
    const bookingId = ans.ret;

    query = `INSERT INTO ACCOMMODATION_BOOKING (ACCOMMODATION_BOOKING_ID, NUMBER_OF_ROOMS, ACCOMMODATION_ID, CHECK_IN, CHECK_OUT)
             VALUES (${bookingId}, ${numberOfRooms}, ${itemId}, TO_TIMESTAMP('${checkInDate}', 'MM/DD/YYYY, HH24:MI:SS'), TO_TIMESTAMP('${checkOutDate}', 'MM/DD/YYYY, HH24:MI:SS'))`;

    await database.query(query,[]);
    await database.query("COMMIT",[]);

    res.status(200).json({status: "ok"});
});

router.post("/add-destination-booking", async (req, res) => {
    const { itemId, tripId, checkInDate, checkOutDate } = req.body;

    const query = `INSERT INTO TRIP_DESTINATION (TRIP_ID, DESTINATION_ID, DEPARTURE_DATE, RETURN_DATE)
                VALUES (${tripId}, ${itemId}, TO_TIMESTAMP('${checkInDate}', 'MM/DD/YYYY, HH24:MI:SS'), TO_TIMESTAMP('${checkOutDate}', 'MM/DD/YYYY, HH24:MI:SS'))`;
    const params = [];
    
    const ans = await database.query(query,params);
    await database.query("COMMIT",params);

    res.status(200).json({status: "ok"});
});

router.post("/add-flight-booking", async (req, res) => {
    const { itemId, tripId, departureDate, returnDate, numberOfSeats, seatClass, flightStyle, totalCost, bookingType } = req.body;

    const oracledb = database.oracledb;
    let query = 
    `BEGIN
        :ret := GET_BOOKING_ID(:tripId, :bookingType, :totalCost);
     END;`;

    const binds = {
        ret: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        tripId: tripId,
        bookingType: bookingType,
        totalCost: totalCost,
    };
    const ans = await database.query2(query,binds);
    const bookingId = ans.ret;

    if(returnDate !== undefined)
    {
        query = `INSERT INTO FLIGHT_BOOKING (FLIGHT_BOOKING_ID, NUMBER_OF_SEATS, FLIGHT_ID, DEPARTURE_AT, ARRIVAL_AT, SEAT_CLASS, FLIGHT_STYLE)
             VALUES (${bookingId}, ${numberOfSeats}, ${itemId}, TO_TIMESTAMP('${departureDate}', 'MM/DD/YYYY, HH24:MI:SS'), TO_TIMESTAMP('${returnDate}', 'MM/DD/YYYY, HH24:MI:SS'), '${seatClass}', '${flightStyle}')`;
    }
    else
    {
        query = `INSERT INTO FLIGHT_BOOKING (FLIGHT_BOOKING_ID, NUMBER_OF_SEATS, FLIGHT_ID, DEPARTURE_AT, SEAT_CLASS, FLIGHT_STYLE)
             VALUES (${bookingId}, ${numberOfSeats}, ${itemId}, TO_TIMESTAMP('${departureDate}', 'MM/DD/YYYY, HH24:MI:SS'), '${seatClass}', '${flightStyle}')`;
    }

    await database.query(query,[]);
    await database.query("COMMIT",[]);

    res.status(200).json({status: "ok"});
});

router.delete("/delete-booking", async (req, res) => {
    const { bookingId } = req.query;

    let query = `SELECT COST, TRIP_ID FROM BOOKING WHERE BOOKING_ID = ${bookingId}`;
    const params = []
    const ans = await database.query(query,params);

    const cost = ans[0].COST;
    const tripId = ans[0].TRIP_ID;

    query = `DELETE FROM BOOKING WHERE BOOKING_ID = ${bookingId}`;
    await database.query(query,params);

    query = `UPDATE TRIP
             SET TOTAL_COST = TOTAL_COST - ${cost}
             WHERE TRIP_ID = ${tripId}`;
    await database.query(query,params);

    await database.query("COMMIT",params);

    res.status(200).json({status: "ok"});
});

module.exports = router;