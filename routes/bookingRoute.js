const express = require('express');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');


const router = express.Router();

router.get('/checkout-session/:productId', authController.protect, bookingController.getCheckoutSession)
router.get('/checkout-session/fromCart/:obj', authController.protect, bookingController.getCheckoutSession)
// router.get('/checkout-session/booking', authController.protect, bookingController.createBookingCheckout)

module.exports = router;