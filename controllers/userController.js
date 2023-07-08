const catchAsync = require('../utility/catchAsync');
const User = require('../models/userModel');
const AppError = require('../utility/appError');

const sharp = require('sharp');
const multer = require('multer');

// const multerStorage = multer.diskStorage({
//     destination: (req, file, cb)=> {
//         cb(null, 'public/img/users');
//     },
//     filename: (req, file, cb) => {
//         const ext = file.mimetype.split('/')[1]
//         cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//     }
// });

// ab as a buffer store karenge memory mein
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new AppError('This is not an image! Please upload only the image',400), false);
    }
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = catchAsync(async(req, res, next) => {

    if(!req.file) return next();
    // req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
    req.file.filename = `user-${req.body.email}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer).resize(500, 500).toFormat('jpeg').jpeg({quality: 90}).toFile(`public/img/users/${req.file.filename}`);
    next();
});

exports.updateMe = catchAsync(async (req, res, next) => {

    // 0) Checking for the changes in the photo field
    if(req.file) req.body.photo = req.file.filename;

    // 1) create error when user passes password/passwordConfirm data
    if (req.body.password || req.body.passwordConfirm) return next(new AppError('This route is not for the Password / passwordConfirm! Please check /api/v1/users/updatePassword', 401))

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

exports.getUser = catchAsync(async(req, res) => {

    const user = await User.findById(req.params.id);
    if (!user) return next(new AppError('No User found with this ID', 404));
    res.status(200).json({
       status: 'success',
       data: {
        user
       }
    });
});

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

exports.getMe = (req, res, next)=> {
    req.params.id = req.user.id;
    next();
};