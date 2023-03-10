const router = require("express").Router();
const bookings = require("./bookingsRoute");
router.use("/bookings", bookings);

module.exports = [
  router
];
