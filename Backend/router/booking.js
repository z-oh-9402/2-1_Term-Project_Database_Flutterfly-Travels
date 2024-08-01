const router = require("express-promise-router")();
const { query } = require("express");
const database = require('../database');

router.post("/add-accommodation-booking", async (req, res) => {
    const { itemId, tripId, checkInDate, checkOutDate, numberOfRooms, totalCost, bookingType } = req.body;

    let params = [tripId, bookingType, totalCost]
    let query = `SELECT GET_BOOKING_ID($1, $2, $3)`;
    const ans = await database.query(query,params);
    const bookingId = ans[0].GET_BOOKING_ID;

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

router.post("/add-restaurant-booking", async (req, res) => {
    const {itemId, tripId, bookingDate, arrivalTime, departureTime, numberOfSeats, totalCost, bookingType} = req.body;

    let params = [tripId, bookingType, totalCost]
    let query = `SELECT GET_BOOKING_ID($1, $2, $3)`;
    const ans = await database.query(query,params);
    const bookingId = ans[0].GET_BOOKING_ID;

    query = `INSERT INTO RESTAURANT_BOOKING (RESTAURANT_BOOKING_ID, NUMBER_OF_SEATS, RESTAURANT_ID, BOOKING_DATE, ARRIVAL_TIME, DEPARTURE_TIME)
             VALUES (${bookingId}, ${numberOfSeats}, ${itemId}, TO_DATE('${bookingDate}', 'MM/DD/YYYY, HH24:MI:SS'), TO_TIMESTAMP('${arrivalTime}', 'HH:MI AM'), TO_TIMESTAMP('${departureTime}', 'HH:MI AM'))`;

    await database.query(query,[]);
    await database.query("COMMIT",[]);

    res.status(200).json({status: "ok"});
});

router.post("/add-flight-booking", async (req, res) => {
    const { itemId, tripId, departureDate, returnDate, numberOfSeats, seatClass, flightStyle, totalCost, bookingType } = req.body;

    let params = [tripId, bookingType, totalCost]
    let query = `SELECT GET_BOOKING_ID($1, $2, $3)`;
    const ans = await database.query(query,params);
    const bookingId = ans[0].GET_BOOKING_ID;

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