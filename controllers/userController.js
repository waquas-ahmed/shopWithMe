const catchAsync = require('../utility/catchAsync');
const User = require('../models/userModel');
const AppError = require('../utility/appError');

exports.updateMe = catchAsync(async (req, res, next) => {

    // 1) create error when user passes password/passwordConfirm data
    if (req.body.password || req.body.passwordConfirm) return next(new AppError('This route is not for the Password / passwordConfirm! Please check 127.0.0.1:8000/api/v1/users/updatePassword', 401))

    // 2) change the name or email in the database
    const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(201).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    });
});

exports.deleteMe = catchAsync(async (req, res, next) => {

    // 1) Find the user and disable it on the basis of logged in
    await User.findByIdAndUpdate(req.user.id, {active: false});

    res.status(204).json({
        status: 'sucess',
        data: null
    });
});

exports.getAllUsers = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!'
    });
};

exports.getUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!'
    });
};

exports.createUser = catchAsync(async (req, res) => {

    const newUser = await User.create(req.body);
    res.status(200).json({
        status: 'success',
        data: {
            user: newUser
        }
    });
});

exports.updateUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!'
    });
};

exports.deleteUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!'
    });
};