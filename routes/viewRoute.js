const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const bookingController = require('../controllers/bookingController');

const router = express.Router();
router.get('/signUp', viewController.getSignupForm);

router.use(authController.isSignedIn);
// router.get('/', bookingController.createBookingCheckout, viewController.getHomepage);
router.get('/', viewController.getHomepage);
router.get('/product/:slug/p/:productId', viewController.getProductpage);
router.get('/search', viewController.getSearchResultpage);
router.get('/login', viewController.getLoginForm);
router.get('/myaccount', viewController.getAccount);

router.get('/mycart', viewController.getCart);

module.exports = router;