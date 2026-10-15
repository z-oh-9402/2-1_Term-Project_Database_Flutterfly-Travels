const router = require("express-promise-router")();
const database = require('../database');
const { requireAuth, canAccessTrip } = require('../auth');

router.use(requireAuth);

// True if value is a plain positive integer id (rejects things like "1 OR 1=1" before they reach a query)
const isId = (value) => /^\d+$/.test(String(value));

// Sends an error response and returns false unless the logged-in user may change this trip's bookings:
// they must be the trip's customer or agent (or an admin), and the trip must be UPDATING (being built by the agent),
// which is the only state in which the frontend offers to add or remove bookings.
const checkCanEditTrip = async (req, res, tripId) => {
    if(!isId(tripId))
    {
        res.status(400).json({message: "Invalid trip id"});
        return false;
    }
    if(!(await canAccessTrip(req.user, tripId)))
    {
        res.status(403).json({message: "Not allowed"});
        return false;
    }

    const rows = await database.query(`SELECT TRIP_STATUS FROM TRIP WHERE TRIP_ID = $1`, [tripId]);
    if(rows.length === 0)
    {
        res.status(404).json({message: "Trip not found"});
        return false;
    }
    if(req.user.role !== 'admin' && rows[0].trip_status !== 'UPDATING')
    {
        res.status(409).json({message: "Bookings can only be changed while the trip is being updated"});
        return false;
    }
    return true;
}

const isValidCost = (cost) => Number.isFinite(Number(cost)) && Number(cost) >= 0;

router.post("/add-accommodation-booking", async (req, res) => {
    const { itemId, tripId, checkInDate, checkOutDate, numberOfRooms, totalCost } = req.body;

    if(!(await checkCanEditTrip(req, res, tripId)))
    {
        return;
    }
    if(!isValidCost(totalCost))
    {
        res.status(400).json({message: "Invalid cost"});
        return;
    }

    await database.transaction(async (client) => {
        const ans = await client.query(`SELECT GET_BOOKING_ID($1, $2, $3)`, [tripId, 'ACCOMMODATION', totalCost]);
        const bookingId = ans.rows[0].get_booking_id;

        const query = `INSERT INTO ACCOMMODATION_BOOKING (ACCOMMODATION_BOOKING_ID, NUMBER_OF_ROOMS, ACCOMMODATION_ID, CHECK_IN, CHECK_OUT)
                       VALUES ($1, $2, $3, TO_TIMESTAMP($4, 'MM/DD/YYYY, HH24:MI:SS'), TO_TIMESTAMP($5, 'MM/DD/YYYY, HH24:MI:SS'))`;
        await client.query(query, [bookingId, numberOfRooms, itemId, checkInDate, checkOutDate]);
    });

    res.status(200).json({status: "ok"});
});

router.post("/add-destination-booking", async (req, res) => {
    const { itemId, tripId, checkInDate, checkOutDate } = req.body;

    if(!(await checkCanEditTrip(req, res, tripId)))
    {
        return;
    }

    const query = `INSERT INTO TRIP_DESTINATION (TRIP_ID, DESTINATION_ID, DEPARTURE_DATE, RETURN_DATE)
                   VALUES ($1, $2, TO_TIMESTAMP($3, 'MM/DD/YYYY, HH24:MI:SS'), TO_TIMESTAMP($4, 'MM/DD/YYYY, HH24:MI:SS'))`;
    await database.query(query,[tripId, itemId, checkInDate, checkOutDate]);

    res.status(200).json({status: "ok"});
});

router.post("/add-restaurant-booking", async (req, res) => {
    const {itemId, tripId, bookingDate, arrivalTime, departureTime, numberOfSeats, totalCost} = req.body;

    if(!(await checkCanEditTrip(req, res, tripId)))
    {
        return;
    }
    if(!isValidCost(totalCost))
    {
        res.status(400).json({message: "Invalid cost"});
        return;
    }

    await database.transaction(async (client) => {
        const ans = await client.query(`SELECT GET_BOOKING_ID($1, $2, $3)`, [tripId, 'RESTAURANT', totalCost]);
        const bookingId = ans.rows[0].get_booking_id;

        const query = `INSERT INTO RESTAURANT_BOOKING (RESTAURANT_BOOKING_ID, NUMBER_OF_SEATS, RESTAURANT_ID, BOOKING_DATE, ARRIVAL_TIME, DEPARTURE_TIME)
                       VALUES ($1, $2, $3, TO_DATE($4, 'MM/DD/YYYY, HH24:MI:SS'), TO_TIMESTAMP($5, 'HH:MI AM'), TO_TIMESTAMP($6, 'HH:MI AM'))`;
        await client.query(query, [bookingId, numberOfSeats, itemId, bookingDate, arrivalTime, departureTime]);
    });

    res.status(200).json({status: "ok"});
});

router.post("/add-flight-booking", async (req, res) => {
    const { itemId, tripId, departureDate, returnDate, numberOfSeats, seatClass, flightStyle, totalCost } = req.body;

    if(!(await checkCanEditTrip(req, res, tripId)))
    {
        return;
    }
    if(!isValidCost(totalCost))
    {
        res.status(400).json({message: "Invalid cost"});
        return;
    }

    await database.transaction(async (client) => {
        const ans = await client.query(`SELECT GET_BOOKING_ID($1, $2, $3)`, [tripId, 'FLIGHT', totalCost]);
        const bookingId = ans.rows[0].get_booking_id;

        let query;
        let params;
        if(returnDate !== undefined)
        {
            query = `INSERT INTO FLIGHT_BOOKING (FLIGHT_BOOKING_ID, NUMBER_OF_SEATS, FLIGHT_ID, DEPARTURE_AT, ARRIVAL_AT, SEAT_CLASS, FLIGHT_STYLE)
                     VALUES ($1, $2, $3, TO_TIMESTAMP($4, 'MM/DD/YYYY, HH24:MI:SS'), TO_TIMESTAMP($5, 'MM/DD/YYYY, HH24:MI:SS'), $6, $7)`;
            params = [bookingId, numberOfSeats, itemId, departureDate, returnDate, seatClass, flightStyle];
        }
        else
        {
            query = `INSERT INTO FLIGHT_BOOKING (FLIGHT_BOOKING_ID, NUMBER_OF_SEATS, FLIGHT_ID, DEPARTURE_AT, SEAT_CLASS, FLIGHT_STYLE)
                     VALUES ($1, $2, $3, TO_TIMESTAMP($4, 'MM/DD/YYYY, HH24:MI:SS'), $5, $6)`;
            params = [bookingId, numberOfSeats, itemId, departureDate, seatClass, flightStyle];
        }
        await client.query(query, params);
    });

    res.status(200).json({status: "ok"});
});

router.delete("/delete-booking", async (req, res) => {
    const { bookingId } = req.query;
    if(!isId(bookingId))
    {
        res.status(400).json({message: "Invalid booking id"});
        return;
    }

    const ans = await database.query(`SELECT TRIP_ID FROM BOOKING WHERE BOOKING_ID = $1`, [bookingId]);
    if(ans.length === 0)
    {
        res.status(404).json({message: "Booking not found"});
        return;
    }
    if(!(await checkCanEditTrip(req, res, ans[0].trip_id)))
    {
        return;
    }

    await database.transaction(async (client) => {
        // The cost is read from the deleted row itself, so a booking deleted twice at once is only subtracted once
        const deleted = await client.query(`DELETE FROM BOOKING WHERE BOOKING_ID = $1 RETURNING COST, TRIP_ID`, [bookingId]);
        if(deleted.rows.length === 0)
        {
            return;
        }

        const query = `UPDATE TRIP
                       SET TOTAL_COST = TOTAL_COST - $1
                       WHERE TRIP_ID = $2`;
        await client.query(query, [deleted.rows[0].cost, deleted.rows[0].trip_id]);
    });

    res.status(200).json({status: "ok"});
});

module.exports = router;
