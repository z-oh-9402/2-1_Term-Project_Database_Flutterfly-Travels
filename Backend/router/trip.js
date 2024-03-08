const router = require("express-promise-router")();
const database = require('../database');

router.get('/for-customer', async (req, res) => {
    const id = req.query.customerId;
    const query = `SELECT T.*, U.*, A.EXPERIENCE_YEARS, A.FEE
                   FROM Trip T LEFT JOIN USERS U ON U.USER_ID=T.AGENT_ID JOIN AGENT A ON A.AGENT_ID=U.USER_ID
                   WHERE T.CUSTOMER_ID = ${id}`;
    const params = [];
    const result = await database.query(query,params);

    for(let trip of result)
    {
        const query = `SELECT D.DESTINATION_ID, D.NAME, TD.*
                       FROM Trip_Destination TD JOIN DESTINATION D ON TD.DESTINATION_ID = D.DESTINATION_ID
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
                   FROM Trip T LEFT JOIN USERS U ON U.USER_ID=T.CUSTOMER_ID JOIN CUSTOMER C ON C.CUSTOMER_ID=U.USER_ID
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

router.post('/', async (req, res) => {
    const {customerId, agentId, name, departureDate, returnDate, totalCost, discount, rating, tripStatus} = req.body;
    console.log(req.body);
    
    const query = `INSERT INTO Trip (CUSTOMER_ID, NAME, DEPARTURE_DATE, RETURN_DATE, TOTAL_COST, DISCOUNT, RATING)
                   VALUES (${customerId},'${name}',TO_DATE('${departureDate}', 'MM/DD/YYYY'),TO_DATE('${returnDate}', 'MM/DD/YYYY'),${totalCost},${discount},${rating})`;
    const params = [];
    await database.query(query,params);

    const res_query = `SELECT *
                       FROM Trip
                       WHERE TRIP_STATUS IS NULL`;
    let ans = await database.query(res_query,params);
    console.log(ans[0].TRIP_ID);

    let query2;
    if(agentId!==null)
    {
        query2 = `UPDATE Trip
                  SET AGENT_ID = ${agentId}, TRIP_STATUS = '${tripStatus}'
                  WHERE TRIP_ID = ${ans[0].TRIP_ID}`;
    }
    else
    {
        query2 = `UPDATE Trip
                  SET TRIP_STATUS = '${tripStatus}'
                  WHERE TRIP_ID = ${ans[0].TRIP_ID}`;
    }
    await database.query(query2,params);

    await database.query('commit',params);

    res.status(200).json("Trip added successfully");
})

module.exports = router;