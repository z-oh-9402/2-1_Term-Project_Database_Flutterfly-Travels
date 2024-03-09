const router = require("express-promise-router")();
const database = require('../database');

router.get("/check-tripname",async(req,res)=>{
    const {tripName} = req.query;
    const oracledb = database.oracledb;
    const query = 
     `BEGIN
        :ret := CHECK_TRIP_NAME(:tripName);
      END;`;

    const binds = {
      ret: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      tripName: tripName,
    };
    const ans = await database.query2(query,binds);

    result = ans.ret;

    res.status(200).json(result);
});

router.get('/for-customer', async (req, res) => {
    const id = req.query.customerId;
    const query = `SELECT T.*, U.*, A.EXPERIENCE_YEARS, A.FEE
                   FROM Trip T LEFT JOIN USERS U ON U.USER_ID=T.AGENT_ID LEFT JOIN AGENT A ON A.AGENT_ID=U.USER_ID
                   WHERE T.CUSTOMER_ID = ${id}`;
    const params = [];
    const result = await database.query(query,params);

    for(let trip of result)
    {
        const query = `SELECT D.NAME, L.LOCATION_NAME, DIS.DISTRICT_NAME, TD.*
                       FROM Trip_Destination TD JOIN DESTINATION D ON TD.DESTINATION_ID = D.DESTINATION_ID 
                       JOIN LOCATION L ON D.LOCATION_ID=L.LOCATION_ID 
                       JOIN DISTRICT DIS ON L.DISTRICT_ID=DIS.DISTRICT_ID
                       WHERE TD.TRIP_ID = ${trip.TRIP_ID}`;
        const reservations = await database.query(query, params);
        trip.DESTINATIONS = reservations;
    }

    for(let trip of result)
    {
        const query = `SELECT A.ACCOMMODATION_ID, A.NAME, AD.*, B.* 
                       FROM BOOKING B JOIN ACCOMMODATION_BOOKING AD ON B.BOOKING_ID=AD.ACCOMMODATION_BOOKING_ID
                       JOIN ACCOMMODATION A ON A.ACCOMMODATION_ID=AD.ACCOMMODATION_ID
                       WHERE B.TRIP_ID = ${trip.TRIP_ID}`;
        const reservations = await database.query(query, params);
        trip.ACCOMMODATIONS = reservations;
    }

    for(let trip of result)
    {
        const query = `SELECT R.RESTAURANT_ID, R.NAME, RD.*, B.* 
                       FROM BOOKING B JOIN RESTAURANT_BOOKING RD ON B.BOOKING_ID=RD.RESTAURANT_BOOKING_ID
                       JOIN RESTAURANT R ON R.RESTAURANT_ID=RD.RESTAURANT_ID
                       WHERE B.TRIP_ID = ${trip.TRIP_ID}`;
        const reservations = await database.query(query, params);
        trip.RESTAURANTS = reservations;
    }

    for(let trip of result)
    {
        const query = `SELECT * 
                       FROM BOOKING B JOIN FLIGHT_BOOKING FD ON B.BOOKING_ID=FD.FLIGHT_BOOKING_ID
                       JOIN FLIGHT F ON F.FLIGHT_ID=FD.FLIGHT_ID
                       WHERE B.TRIP_ID = ${trip.TRIP_ID}`;
        const reservations = await database.query(query, params);
        trip.FLIGHTS = reservations;
    }

    res.json(result);
})

router.get('/for-agent', async (req, res) => {
    const id = req.query.agentId;
    const query = `SELECT T.*, U.*, C.PASSPORT_NUMBER
                   FROM Trip T LEFT JOIN USERS U ON U.USER_ID=T.CUSTOMER_ID LEFT JOIN CUSTOMER C ON C.CUSTOMER_ID=U.USER_ID
                   WHERE T.AGENT_ID = ${id}`;
    const params = [];
    const result = await database.query(query,params);

    for(let trip of result)
    {
        const query = `SELECT D.NAME, TD.*
                       FROM Trip_Destination TD JOIN DESTINATION D ON TD.DESTINATION_ID = D.DESTINATION_ID
                       WHERE TD.TRIP_ID = ${trip.TRIP_ID}`;
        const reservations = await database.query(query, params);
        trip.DESTINATIONS = reservations;
    }

    for(let trip of result)
    {
        const query = `SELECT A.NAME, AD.*, B.* 
                       FROM BOOKING B JOIN ACCOMMODATION_BOOKING AD ON B.BOOKING_ID=AD.ACCOMMODATION_BOOKING_ID
                       JOIN ACCOMMODATION A ON A.ACCOMMODATION_ID=AD.ACCOMMODATION_ID
                       WHERE B.TRIP_ID = ${trip.TRIP_ID}`;
        const reservations = await database.query(query, params);
        trip.ACCOMMODATIONS = reservations;
    }

    for(let trip of result)
    {
        const query = `SELECT R.NAME, RD.*, B.* 
                       FROM BOOKING B JOIN RESTAURANT_BOOKING RD ON B.BOOKING_ID=RD.RESTAURANT_BOOKING_ID
                       JOIN RESTAURANT R ON R.RESTAURANT_ID=RD.RESTAURANT_ID
                       WHERE B.TRIP_ID = ${trip.TRIP_ID}`;
        const reservations = await database.query(query, params);
        trip.RESTAURANTS = reservations;
    }

    for(let trip of result)
    {
        const query = `SELECT * 
                       FROM BOOKING B JOIN FLIGHT_BOOKING FD ON B.BOOKING_ID=FD.FLIGHT_BOOKING_ID
                       JOIN FLIGHT F ON F.FLIGHT_ID=FD.FLIGHT_ID
                       WHERE B.TRIP_ID = ${trip.TRIP_ID}`;
        const reservations = await database.query(query, params);
        trip.FLIGHTS = reservations;
    }

    res.json(result);
})

router.get('/fetch-complete-trips', async (req, res) => {
    const query = `SELECT T.*, U.USERNAME 
                   FROM Trip T LEFT JOIN USERS U ON T.AGENT_ID=U.USER_ID
                   WHERE T.TRIP_STATUS = 'COMPLETED'
                   ORDER BY T.RATING`;
    const params = [];
    const result = await database.query(query,params);

    for(let trip of result)
    {
        const query = `SELECT D.NAME, L.LOCATION_NAME, DIS.DISTRICT_NAME, TD.*
                       FROM Trip_Destination TD JOIN DESTINATION D ON TD.DESTINATION_ID = D.DESTINATION_ID 
                            JOIN LOCATION L ON D.LOCATION_ID=L.LOCATION_ID 
                            JOIN DISTRICT DIS ON L.DISTRICT_ID=DIS.DISTRICT_ID
                       WHERE TD.TRIP_ID = ${trip.TRIP_ID}`;
        const reservations = await database.query(query, params);
        trip.DESTINATIONS = reservations;
    }

    for(let trip of result)
    {
        const query = `SELECT A.NAME, AD.*, B.* 
                       FROM BOOKING B JOIN ACCOMMODATION_BOOKING AD ON B.BOOKING_ID=AD.ACCOMMODATION_BOOKING_ID
                       JOIN ACCOMMODATION A ON A.ACCOMMODATION_ID=AD.ACCOMMODATION_ID
                       WHERE B.TRIP_ID = ${trip.TRIP_ID}`;
        const reservations = await database.query(query, params);
        trip.ACCOMMODATIONS = reservations;
    }

    for(let trip of result)
    {
        const query = `SELECT R.NAME, RD.*, B.* 
                       FROM BOOKING B JOIN RESTAURANT_BOOKING RD ON B.BOOKING_ID=RD.RESTAURANT_BOOKING_ID
                       JOIN RESTAURANT R ON R.RESTAURANT_ID=RD.RESTAURANT_ID
                       WHERE B.TRIP_ID = ${trip.TRIP_ID}`;
        const reservations = await database.query(query, params);
        trip.RESTAURANTS = reservations;
    }

    for(let trip of result)
    {
        const query = `SELECT * 
                       FROM BOOKING B JOIN FLIGHT_BOOKING FD ON B.BOOKING_ID=FD.FLIGHT_BOOKING_ID
                       JOIN FLIGHT F ON F.FLIGHT_ID=FD.FLIGHT_ID
                       WHERE B.TRIP_ID = ${trip.TRIP_ID}`;
        const reservations = await database.query(query, params);
        trip.FLIGHTS = reservations;
    }

    res.json(result);
})

router.get('/fetch-pending-trips', async (req, res) => {
    const query = `SELECT T.*, A.USERNAME AS AGENT_NAME, C.USERNAME AS CUSTOMER_NAME 
                   FROM Trip T LEFT JOIN USERS A ON T.AGENT_ID=A.USER_ID JOIN USERS C ON T.CUSTOMER_ID=C.USER_ID
                   WHERE T.TRIP_STATUS = 'PENDING'
                   ORDER BY T.RATING`;
    const params = [];
    const result = await database.query(query,params);

    for(let trip of result)
    {
        const query = `SELECT D.NAME, L.LOCATION_NAME, DIS.DISTRICT_NAME, TD.*
                       FROM Trip_Destination TD JOIN DESTINATION D ON TD.DESTINATION_ID = D.DESTINATION_ID 
                            JOIN LOCATION L ON D.LOCATION_ID=L.LOCATION_ID 
                            JOIN DISTRICT DIS ON L.DISTRICT_ID=DIS.DISTRICT_ID
                       WHERE TD.TRIP_ID = ${trip.TRIP_ID}`;
        const reservations = await database.query(query, params);
        trip.DESTINATIONS = reservations;
    }

    for(let trip of result)
    {
        const query = `SELECT A.NAME, AD.*, B.* 
                       FROM BOOKING B JOIN ACCOMMODATION_BOOKING AD ON B.BOOKING_ID=AD.ACCOMMODATION_BOOKING_ID
                       JOIN ACCOMMODATION A ON A.ACCOMMODATION_ID=AD.ACCOMMODATION_ID
                       WHERE B.TRIP_ID = ${trip.TRIP_ID}`;
        const reservations = await database.query(query, params);
        trip.ACCOMMODATIONS = reservations;
    }

    for(let trip of result)
    {
        const query = `SELECT R.NAME, RD.*, B.* 
                       FROM BOOKING B JOIN RESTAURANT_BOOKING RD ON B.BOOKING_ID=RD.RESTAURANT_BOOKING_ID
                       JOIN RESTAURANT R ON R.RESTAURANT_ID=RD.RESTAURANT_ID
                       WHERE B.TRIP_ID = ${trip.TRIP_ID}`;
        const reservations = await database.query(query, params);
        trip.RESTAURANTS = reservations;
    }

    for(let trip of result)
    {
        const query = `SELECT * 
                       FROM BOOKING B JOIN FLIGHT_BOOKING FD ON B.BOOKING_ID=FD.FLIGHT_BOOKING_ID
                       JOIN FLIGHT F ON F.FLIGHT_ID=FD.FLIGHT_ID
                       WHERE B.TRIP_ID = ${trip.TRIP_ID}`;
        const reservations = await database.query(query, params);
        trip.FLIGHTS = reservations;
    }

    res.json(result);
})

router.put('/update-agent', async (req, res) => {
    const {agentId, tripId} = req.body;
    const query = `UPDATE Trip
                   SET AGENT_ID = ${agentId}
                   WHERE TRIP_ID = ${tripId}`;
                   
    const params = [];
    await database.query(query,params);
    await database.query('commit',params);
    res.status(200).json("Agent updated successfully");
});

router.put('/update-trip', async (req, res) => {
    const {tripStatus, tripId, agentId} = req.body;

    let query;
    if(agentId===null)
    {
        query = `UPDATE Trip
                 SET AGENT_ID = NULL
                 WHERE TRIP_ID = ${tripId}`;
    }
    else
    {
        query = `UPDATE Trip
                 SET TRIP_STATUS = '${tripStatus}'
                 WHERE TRIP_ID = ${tripId}`;
    }
    
    const params = [];
    await database.query(query,params);
    await database.query('commit',params);
    res.status(200).json("Trip status updated successfully");
})

router.put('/update-trip-status', async (req, res) => {
    const {tripStatus, tripId} = req.body;

    let query;
    if(tripStatus==='COMPLETED')
    {
        query = `UPDATE Trip
                 SET TRIP_STATUS = '${tripStatus}'
                 WHERE TRIP_STATUS='CONFIRMED' AND RETURN_DATE < SYSDATE`;
    }
    if(tripStatus==='PENDING')
    {
        query = `UPDATE Trip
                 SET TRIP_STATUS = '${tripStatus}'
                 WHERE TRIP_ID = ${tripId}`;
    }
    if(tripStatus==='CONFIRMED')
    {
        query = `UPDATE Trip
                 SET TRIP_STATUS = '${tripStatus}'
                 WHERE TRIP_ID = ${tripId}`;
    }
    
    const params = [];
    await database.query(query,params);
    await database.query('commit',params);
    res.status(200).json("Trip status updated successfully");
})

router.put('/admin-decision', async (req, res) => {
    const {tripId} = req.body;

    const query = `UPDATE Trip
             SET TRIP_STATUS = 'CONFIRMED'
             WHERE TRIP_ID = ${tripId}`;
    const params = [];

    await database.query(query,params);
    await database.query('commit',params);
    res.status(200).json("Trip status updated successfully");
})

router.post('/', async (req, res) => {
    const {customerId, agentId, name, departureDate, returnDate, totalCost, discount, rating, tripStatus} = req.body;
    
    const query = `INSERT INTO Trip (CUSTOMER_ID, AGENT_ID, NAME, DEPARTURE_DATE, RETURN_DATE, TOTAL_COST, DISCOUNT, RATING, TRIP_STATUS)
                   VALUES (${customerId}, ${agentId},'${name}',TO_DATE('${departureDate}', 'MM/DD/YYYY'),TO_DATE('${returnDate}', 'MM/DD/YYYY'),${totalCost},${discount},${rating}, '${tripStatus}')`;
    const params = [];
    await database.query(query,params);

    await database.query('commit',params);

    res.status(200).json("Trip added successfully");
})

router.delete('/admin-decision', async (req, res) => {
    const {tripId} = req.body;

    const query = `DELETE FROM Trip
                   WHERE TRIP_ID = ${tripId}`;
    const params = [];

    await database.query(query,params);
    await database.query('commit',params);
    res.status(200).json("Trip status updated successfully");
})

router.delete('/delete-destination', async (req, res) => {
    const {tripDestinationId} = req.query;
    const query = `DELETE FROM Trip_Destination
                   WHERE TRIP_DESTINATION_ID = ${tripDestinationId}`;
    const params = [];
    await database.query(query,params);
    await database.query('commit',params);
    res.status(200).json("Trip deleted successfully");
})

router.delete('/delete-trip', async (req, res) => {
    const {tripId} = req.query;
    const query = `DELETE FROM Trip
                   WHERE TRIP_ID = ${tripId}`;
    const params = [];
    await database.query(query,params);
    await database.query('commit',params);
    res.status(200).json("Trip deleted successfully");
})

module.exports = router;