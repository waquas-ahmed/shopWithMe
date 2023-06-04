const catchAsync = require('../utility/catchAsync');
const User = require('../models/userModel');

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