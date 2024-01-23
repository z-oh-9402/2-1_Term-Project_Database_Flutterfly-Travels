const router = require("express-promise-router")();

router.use("/customer",require('./customer'));
router.use("/agent",require('./agent'));
router.use("/destination",require('./destination'));

module.exports = router;