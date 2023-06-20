const express = require('express');

const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');

const router = express.Router();

router.get('/', reviewController.getAllReviews);
router.route('/:reviewId').delete(authController.protect, authController.restrictTo('user'), reviewController.deleteReview)
router.route('/product/:productId').post(authController.protect, authController.restrictTo('user'), reviewController.createReview);
// router.route('/product/:productId').post(authController.isSignedIn, authController.restrictTo('user'), reviewController.createReview);

module.exports = router;