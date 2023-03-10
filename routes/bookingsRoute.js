const router = require('express').Router();
const controller = require('../controllers/bookings');

router.post('/add-booking', controller.add);
router.post('/update-booking/:id', controller.update);
router.get('/get-bookings', controller.get);
router.get('/get-booking/:id', controller.getSingle);
router.delete('/delete-booking/:id', controller.delete);

module.exports = router;