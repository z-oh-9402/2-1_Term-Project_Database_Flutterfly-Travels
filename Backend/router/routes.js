const router = require("express-promise-router")();

router.use("/user",require('./user'));
router.use("/customer",require('./customer'));
router.use("/agent",require('./agent'));
router.use("/destination",require('./destination'));
router.use("/accommodation",require('./accommodation'));
router.use("/restaurant",require('./restaurant'));
router.use("/flight",require('./flight'));
router.use("/booking",require('./booking'));
router.use("/trip",require('./trip'));
router.use("/wishlist",require('./wishlist'));
router.use("/chat",require('./chat'));

module.exports = router;