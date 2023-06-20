const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
// const multer = require('multer');

// const upload = multer({dest: 'public/img/users'})

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch('/updatePassword', authController.protect, authController.updatePassword);
// router.patch('/updateMe', authController.protect, upload.single('photo'), userController.updateMe);
router.patch('/updateMe', authController.protect, userController.uploadUserPhoto, userController.resizeUserPhoto, userController.updateMe);
router.patch('/deleteMe', authController.protect, userController.deleteMe);
router.route('/me').get(authController.protect, userController.getMe, userController.getUser);

router.route('/').get(userController.getAllUsers).post(userController.createUser);
router.route('/:id').get(userController.getUser).patch(userController.updateUser).delete(userController.deleteUser);

module.exports = router