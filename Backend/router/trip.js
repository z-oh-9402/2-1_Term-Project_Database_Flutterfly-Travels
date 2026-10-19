const router = require("express-promise-router")();
const database = require('../database');
const { requireAuth, requireRole, requireSelfOrAdmin, canAccessTrip, bookingEditProblem } = require('../auth');

router.use(requireAuth);

// True if value is a plain positive integer id (rejects things like "1 OR 1=1" before they reach a query)
const isId = (value) => /^\d+$/.test(String(value));

// Columns of USERS that may be sent to other users (everything except the password)
const PUBLIC_USER_COLUMNS = `U.USER_ID, U.USERNAME, U.FIRST_NAME, U.LAST_NAME, U.USER_TYPE, U.EMAIL, U.PHOTO`;

// Adds each trip's destinations, accommodations, restaurants and flights to it as nested arrays
const attachTripItems = async (trips) => {
    for(let trip of trips)
    {
        const params = [trip.trip_id];

        trip.destinations = await database.query(
            `SELECT D.NAME, L.LOCATION_NAME, DIS.DISTRICT_NAME, TD.*
             FROM Trip_Destination TD JOIN DESTINATION D ON TD.DESTINATION_ID = D.DESTINATION_ID
             JOIN LOCATION L ON D.LOCATION_ID=L.LOCATION_ID
             JOIN DISTRICT DIS ON L.DISTRICT_ID=DIS.DISTRICT_ID
             WHERE TD.TRIP_ID = $1`, params);

        trip.accommodations = await database.query(
            `SELECT A.ACCOMMODATION_ID, A.NAME, AD.*, B.*
             FROM BOOKING B JOIN ACCOMMODATION_BOOKING AD ON B.BOOKING_ID=AD.ACCOMMODATION_BOOKING_ID
             JOIN ACCOMMODATION A ON A.ACCOMMODATION_ID=AD.ACCOMMODATION_ID
             WHERE B.TRIP_ID = $1`, params);

        // RD.* comes after B.* so the reservation's BOOKING_DATE is not overwritten by BOOKING.BOOKING_DATE (always NULL)
        trip.restaurants = await database.query(
            `SELECT R.RESTAURANT_ID, R.NAME, L.LOCATION_NAME, B.*, RD.*
             FROM BOOKING B JOIN RESTAURANT_BOOKING RD ON B.BOOKING_ID=RD.RESTAURANT_BOOKING_ID
             JOIN RESTAURANT R ON R.RESTAURANT_ID=RD.RESTAURANT_ID
             LEFT JOIN LOCATION L ON R.LOCATION_ID=L.LOCATION_ID
             WHERE B.TRIP_ID = $1`, params);

        trip.flights = await database.query(
            `SELECT *
             FROM BOOKING B JOIN FLIGHT_BOOKING FD ON B.BOOKING_ID=FD.FLIGHT_BOOKING_ID
             JOIN FLIGHT F ON F.FLIGHT_ID=FD.FLIGHT_ID
             WHERE B.TRIP_ID = $1`, params);
    }
    return trips;
}

const fetchTrip = async (tripId) => {
    const rows = await database.query(`SELECT TRIP_ID, CUSTOMER_ID, AGENT_ID, TRIP_STATUS FROM Trip WHERE TRIP_ID = $1`, [tripId]);
    return rows[0];
}

// True if agentId is an agent whose account has been approved (the only agents AgentSearch shows)
const isApprovedAgent = async (agentId) => {
    if(!isId(agentId))
    {
        return false;
    }
    const rows = await database.query(`SELECT AGENT_ID FROM AGENT WHERE AGENT_ID = $1 AND ACC_STATUS = 'OK'`, [agentId]);
    return rows.length !== 0;
}

// Whether the logged-in customer already has a trip with this name (1) or not (-1)
router.get("/check-tripname",async(req,res)=>{
    const params = [req.query.tripName, req.user.id];
    const query = `SELECT CHECK_TRIP_NAME($1, $2)`;
    const ans = await database.query(query,params);

    const result = ans[0].check_trip_name;

    res.status(200).json(result);
});

// A customer's own trips (or any customer's, for an admin)
router.get('/for-customer', requireSelfOrAdmin(req => req.query.customerId), async (req, res) => {
    const id = req.query.customerId;
    if(!isId(id))
    {
        res.status(400).json({message: "Invalid customer id"});
        return;
    }

    const query = `SELECT T.*, ${PUBLIC_USER_COLUMNS}, A.EXPERIENCE_YEARS, A.FEE
                   FROM Trip T LEFT JOIN USERS U ON U.USER_ID=T.AGENT_ID LEFT JOIN AGENT A ON A.AGENT_ID=U.USER_ID
                   WHERE T.CUSTOMER_ID = $1`;
    const result = await database.query(query,[id]);

    res.json(await attachTripItems(result));
})

// An agent's own trips (or any agent's, for an admin)
router.get('/for-agent', requireSelfOrAdmin(req => req.query.agentId), async (req, res) => {
    const id = req.query.agentId;
    if(!isId(id))
    {
        res.status(400).json({message: "Invalid agent id"});
        return;
    }

    const query = `SELECT T.*, ${PUBLIC_USER_COLUMNS}, C.PASSPORT_NUMBER
                   FROM Trip T LEFT JOIN USERS U ON U.USER_ID=T.CUSTOMER_ID LEFT JOIN CUSTOMER C ON C.CUSTOMER_ID=U.USER_ID
                   WHERE T.AGENT_ID = $1`;
    const result = await database.query(query,[id]);

    res.json(await attachTripItems(result));
})

// Completed trips of all customers, shown to customers as ideas in the "Suggested" tab of Trips.jsx.
// The customer's identity (CUSTOMER_ID) is left out; only the agent's public username/id is included.
router.get('/fetch-complete-trips', requireRole('customer', 'admin'), async (req, res) => {
    const query = `SELECT T.TRIP_ID, T.AGENT_ID, T.NAME, T.DEPARTURE_DATE, T.RETURN_DATE, T.TOTAL_COST, T.DISCOUNT, T.RATING, T.TRIP_STATUS,
                          U.USERNAME, U.USER_ID
                   FROM Trip T LEFT JOIN USERS U ON T.AGENT_ID=U.USER_ID
                   WHERE T.TRIP_STATUS = 'COMPLETED'
                   ORDER BY T.RATING`;
    const result = await database.query(query,[]);

    res.json(await attachTripItems(result));
})

router.get('/fetch-pending-trips', requireRole('admin'), async (req, res) => {
    const query = `SELECT T.*, A.USERNAME AS AGENT_NAME, C.USERNAME AS CUSTOMER_NAME
                   FROM Trip T LEFT JOIN USERS A ON T.AGENT_ID=A.USER_ID JOIN USERS C ON T.CUSTOMER_ID=C.USER_ID
                   WHERE T.TRIP_STATUS = 'PENDING'
                   ORDER BY T.RATING`;
    const result = await database.query(query,[]);

    res.json(await attachTripItems(result));
})

// The trip's customer picks an agent for a trip that is still waiting for one (Trips.jsx "Set Agent")
router.put('/update-agent', async (req, res) => {
    const {agentId, tripId} = req.body;
    if(!isId(tripId))
    {
        res.status(400).json({message: "Invalid trip id"});
        return;
    }
    if(!(await canAccessTrip(req.user, tripId)))
    {
        res.status(403).json({message: "Not allowed"});
        return;
    }

    const trip = await fetchTrip(tripId);
    if(!trip)
    {
        res.status(404).json({message: "Trip not found"});
        return;
    }
    if(req.user.role !== 'admin' && trip.customer_id !== req.user.id)
    {
        res.status(403).json({message: "Not allowed"});
        return;
    }
    if(trip.trip_status !== 'REQUESTING')
    {
        res.status(409).json({message: "The agent can only be changed before an agent accepts the trip"});
        return;
    }
    if(!(await isApprovedAgent(agentId)))
    {
        res.status(400).json({message: "Invalid agent"});
        return;
    }

    const query = `UPDATE Trip
                   SET AGENT_ID = $1
                   WHERE TRIP_ID = $2`;
    await database.query(query,[agentId, tripId]);
    res.status(200).json("Agent updated successfully");
});

// The trip's agent accepts (status -> UPDATING) or declines (agent removed) a trip request (AgentTrip.jsx agentDecision)
router.put('/update-trip', async (req, res) => {
    const {tripStatus, tripId, agentId} = req.body;
    if(!isId(tripId))
    {
        res.status(400).json({message: "Invalid trip id"});
        return;
    }
    if(!(await canAccessTrip(req.user, tripId)))
    {
        res.status(403).json({message: "Not allowed"});
        return;
    }

    const trip = await fetchTrip(tripId);
    if(!trip)
    {
        res.status(404).json({message: "Trip not found"});
        return;
    }
    if(req.user.role !== 'admin' && trip.agent_id !== req.user.id)
    {
        res.status(403).json({message: "Not allowed"});
        return;
    }
    if(trip.trip_status !== 'REQUESTING')
    {
        res.status(409).json({message: "This trip is not waiting for the agent's decision"});
        return;
    }

    let query;
    let params;
    if(agentId===null)
    {
        query = `UPDATE Trip
                 SET AGENT_ID = NULL
                 WHERE TRIP_ID = $1`;
        params = [tripId];
    }
    else
    {
        if(tripStatus !== 'UPDATING')
        {
            res.status(400).json({message: "Invalid trip status"});
            return;
        }
        query = `UPDATE Trip
                 SET TRIP_STATUS = $1
                 WHERE TRIP_ID = $2`;
        params = [tripStatus, tripId];
    }

    await database.query(query,params);
    res.status(200).json("Trip status updated successfully");
})

router.put('/update-trip-status', async (req, res) => {
    const {tripStatus, tripId} = req.body;

    // Housekeeping called by every client on page load (App.jsx): once a trip's return day is over, a confirmed trip
    // is marked completed, and one that never got confirmed is marked dropped. It only closes trips that are over,
    // so any logged-in user may run it; tripId is ignored.
    if(tripStatus==='COMPLETED')
    {
        const query = `UPDATE Trip
                       SET TRIP_STATUS = CASE WHEN TRIP_STATUS = 'CONFIRMED' THEN 'COMPLETED' ELSE 'DROPPED' END
                       WHERE TRIP_STATUS IN ('REQUESTING', 'UPDATING', 'PENDING', 'CONFIRMED') AND RETURN_DATE < CURRENT_DATE`;
        await database.query(query,[]);
        res.status(200).json("Trip status updated successfully");
        return;
    }

    if(tripStatus!=='PENDING' && tripStatus!=='CONFIRMED')
    {
        res.status(400).json({message: "Invalid trip status"});
        return;
    }
    if(!isId(tripId))
    {
        res.status(400).json({message: "Invalid trip id"});
        return;
    }
    if(!(await canAccessTrip(req.user, tripId)))
    {
        res.status(403).json({message: "Not allowed"});
        return;
    }

    const trip = await fetchTrip(tripId);
    if(!trip)
    {
        res.status(404).json({message: "Trip not found"});
        return;
    }

    if(tripStatus==='PENDING')
    {
        // The customer sends the trip their agent has built to the admin (Trips.jsx customerConfirm)
        if(req.user.role !== 'admin' && trip.customer_id !== req.user.id)
        {
            res.status(403).json({message: "Not allowed"});
            return;
        }
        if(trip.trip_status !== 'UPDATING')
        {
            res.status(409).json({message: "Only a trip that is being updated can be sent for approval"});
            return;
        }
    }
    if(tripStatus==='CONFIRMED' && req.user.role !== 'admin')
    {
        // Only an admin approves a trip (ProfileHomePage.jsx uses /admin-decision for that)
        res.status(403).json({message: "Not allowed"});
        return;
    }

    const query = `UPDATE Trip
                   SET TRIP_STATUS = $1
                   WHERE TRIP_ID = $2`;
    await database.query(query,[tripStatus, tripId]);
    res.status(200).json("Trip status updated successfully");
})

router.put('/admin-decision', requireRole('admin'), async (req, res) => {
    const {tripId} = req.body;
    if(!isId(tripId))
    {
        res.status(400).json({message: "Invalid trip id"});
        return;
    }

    const query = `UPDATE Trip
             SET TRIP_STATUS = 'CONFIRMED'
             WHERE TRIP_ID = $1`;

    await database.query(query,[tripId]);
    res.status(200).json("Trip status updated successfully");
})

// A customer creates a trip for themself and requests an agent (CreateTrip.jsx)
router.post('/', requireRole('customer'), async (req, res) => {
    const {agentId, name, departureDate, returnDate} = req.body;

    if(agentId !== undefined && agentId !== null && !(await isApprovedAgent(agentId)))
    {
        res.status(400).json({message: "Invalid agent"});
        return;
    }
    if(typeof name !== 'string' || name.trim() === '')
    {
        res.status(400).json({message: "The trip needs a name"});
        return;
    }
    const taken = await database.query(`SELECT CHECK_TRIP_NAME($1, $2)`, [name, req.user.id]);
    if(taken[0].check_trip_name === 1)
    {
        res.status(409).json({message: "You already have a trip with this name"});
        return;
    }

    // A new trip always starts as a request with no cost, discount or rating, whatever the request body says
    const query = `INSERT INTO Trip (CUSTOMER_ID, AGENT_ID, NAME, DEPARTURE_DATE, RETURN_DATE, TOTAL_COST, DISCOUNT, RATING, TRIP_STATUS)
                   VALUES ($1, $2, $3, TO_DATE($4, 'MM/DD/YYYY'), TO_DATE($5, 'MM/DD/YYYY'), 0, 0, 0, 'REQUESTING')
                   RETURNING TRIP_ID`;
    const params = [req.user.id, agentId ?? null, name, departureDate, returnDate];
    const rows = await database.query(query,params);

    // the id lets a booking popup add its booking to the trip it just created
    res.status(200).json({tripId: rows[0].trip_id});
})

router.delete('/admin-decision', requireRole('admin'), async (req, res) => {
    const {tripId} = req.body;
    if(!isId(tripId))
    {
        res.status(400).json({message: "Invalid trip id"});
        return;
    }

    const query = `DELETE FROM Trip
                   WHERE TRIP_ID = $1`;

    await database.query(query,[tripId]);
    res.status(200).json("Trip status updated successfully");
})

// The trip's customer or agent removes a destination, under the same rules as other bookings (bookingEditProblem in auth.js)
router.delete('/delete-destination', async (req, res) => {
    const {tripDestinationId} = req.query;
    if(!isId(tripDestinationId))
    {
        res.status(400).json({message: "Invalid trip destination id"});
        return;
    }

    const rows = await database.query(`SELECT TRIP_ID FROM Trip_Destination WHERE TRIP_DESTINATION_ID = $1`, [tripDestinationId]);
    if(rows.length === 0)
    {
        res.status(404).json({message: "Destination not found"});
        return;
    }
    const problem = await bookingEditProblem(req.user, rows[0].trip_id);
    if(problem)
    {
        res.status(problem[0]).json({message: problem[1]});
        return;
    }

    const query = `DELETE FROM Trip_Destination
                   WHERE TRIP_DESTINATION_ID = $1`;
    await database.query(query,[tripDestinationId]);
    res.status(200).json("Destination removed from the trip");
})

// The trip's customer deletes their trip (Trips.jsx deleteTrip)
router.delete('/delete-trip', async (req, res) => {
    const {tripId} = req.query;
    if(!isId(tripId))
    {
        res.status(400).json({message: "Invalid trip id"});
        return;
    }
    if(!(await canAccessTrip(req.user, tripId)))
    {
        res.status(403).json({message: "Not allowed"});
        return;
    }

    const trip = await fetchTrip(tripId);
    if(!trip)
    {
        res.status(404).json({message: "Trip not found"});
        return;
    }
    if(req.user.role !== 'admin' && trip.customer_id !== req.user.id)
    {
        res.status(403).json({message: "Not allowed"});
        return;
    }

    const query = `DELETE FROM Trip
                   WHERE TRIP_ID = $1`;
    await database.query(query,[tripId]);
    res.status(200).json("Trip deleted successfully");
})

module.exports = router;
