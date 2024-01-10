const router = require("express-promise-router")();

router.use("/customer",require('./customer'));

module.exports = router;