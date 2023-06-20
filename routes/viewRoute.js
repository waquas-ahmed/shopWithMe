const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.isSignedIn);
router.get('/', viewController.getHomepage);
router.get('/product/:slug/p/:productId', viewController.getProductpage);
router.get('/search', viewController.getSearchResultpage);
router.get('/login', viewController.getLoginForm);
router.get('/myaccount', viewController.getAccount);

module.exports = router;