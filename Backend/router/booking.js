const router = require("express-promise-router")();
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

module.exports = router;