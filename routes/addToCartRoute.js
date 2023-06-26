const express = require('express');
const addToCartController = require('../controllers/addToCartController');
const authController = require('../controllers/authController');

const router = express.Router();

router.route('/getAllInCart').get(authController.protect, addToCartController.getAllInCart);
router.route('/addToCart/:productId').post(authController.protect, addToCartController.createProductAddtocart);
router.route('/deleteFromCart/:productId').delete(authController.protect, addToCartController.deleteProductAddtocart);

module.exports = router