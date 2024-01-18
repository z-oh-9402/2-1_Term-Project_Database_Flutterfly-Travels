const router = require("express-promise-router")();

router.use("/customer",require('./customer'));
router.use("/agent",require('./agent'));

module.exports = router;