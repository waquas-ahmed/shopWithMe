const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const crypto = require('crypto');

const catchAsync = require('../utility/catchAsync');
const AppError = require('../utility/appError');
const User = require('../models/userModel');
const sendEmail = require('../utility/email')

const signToken = (id) => {
    return jwt.sign(
        {
            id
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN
        }

    )
}

const createSendToken = (user, status, res) => {

    const token = signToken(user._id);

    // creating options for the cookie
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true
    };
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true; // agar secure true hoga to postman ke response mein wo cookies nhi dikhega

    res.cookie('jwt', token, cookieOptions);

    // Removing password from the response
    user.password = undefined;

    res.status(200).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
};

exports.signup = catchAsync(async(req, res) => {

    if(req.file) req.body.photo = req.file.filename;
    const newUser = await User.create(req.body);

    // will pass limited fields to the user so that user won;t add any role
    // const newUser = await User.create({
    //     name: req.body.name,
    //     email: req.body.email,
    //     password: req.body.password,
    //     passwordConfirm: req.body.passwordConfirm,
    //     photo: req.body.photo
    // });

    // email sending part
    const url = '/myaccount';
    await new sendEmail(newUser, url).sendWelcome();

    createSendToken(newUser, 200, res);
});

exports.login = catchAsync(async (req, res, next) => {
    const {email, password} = req.body;

    // 1) check if email and password are provided by user or not
    if (!email || !password) return next(new AppError('Please provide email and password!!', 400));

    // 2) check if user is exist or not
    const user = await User.findOne({email});
    if (!user) return next(new AppError('This user is not exist!! Please check your email!', 401));

    // 3) check user enter password and database password matches or not!!
    if (!(await user.correctPassword(password, user.password))) return next(new AppError('Entered password is not correct!! Please enter the correct password.', 401));

    // 4) If every thing ok then the token to the client
    createSendToken(user, 200, res);
});

exports.logout = catchAsync(async (req, res, next) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 1 * 1000),
        httpOnly: true
    })
    res.status(200).json({
        status: 'success'
    })
});

exports.forgotPassword = catchAsync(async (req, res, next) => {

    // 1) find the user in the database who lost his password
    const user = await User.findOne({ email: req.body.email });


    // 2) condition: user is there in our record or not
    if (!user) return next(new AppError('You are not in our record!! Please check your email or do the signup!'));

    // 3) if user exist then create random crypto token
    const resetToken = user.createPasswordResetToken();

    // 4) saving the entire functionality to the database that we just create resetToken
    await user.save({validateBeforeSave: false});

    // 5) then send that token to the mailtrap so that user will have verify before setting new one
    const resetContainTokenUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
    const message = `Forgot your password!? Submit the PATCH request on the URL ${resetContainTokenUrl} So that you can set a new password.\n
    If not then ignore this mail`

    try {
        await sendEmail({
            email: user.email,
            subject: 'You password reset token which is valid for 10 mins',
            message
        });

        res.status(200).json({
            status: 'success',
            message: 'Token sent to you email'
        });
    } catch (error) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({
            validateBeforeSave: false
        });

        return next(new AppError('There was an issue while sending the email. Please try again later', 500));
    }
});

exports.resetPassword = catchAsync(async(req, res, next) => {

    // 1) find the user on the basis of the token
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    });

    // 2) checking user is there or not on the basis of token from mail and should be unexpired
    if (!user) return next(new AppError('Token is invalid or has expired!!!', 400));

    // 3) if token is valid and not expired then set the new password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetExpires = undefined;
    user.passwordResetToken = undefined;

    // 4) saving the above resetting to the databse
    await user.save();

    // 5) update changePasswordAt property for the user - doing in the user model
    // 6) Now will create jwt means log in the user to the website
    createSendToken(user, 201, res);

});

exports.updatePassword = catchAsync(async (req, res, next) => {

    // 1) find the user on the basis of the logged in one
    const user = await User.findById(req.user.id);

    // 2) if user is there then will compare the current input password
    if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
        return next(new AppError('Your current password is incorrect!! Please check that', 401))
    }

    // 3) if input password is correct then set the new one with confirm password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;

    // 4) save the passwords in the database
    await user.save();
    createSendToken(user, 201, res);
});


exports.protect = catchAsync(async (req, res, next) => {

    // 1) Getting token and check if it is there or not
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.jwt) {
        token = req.cookies.jwt;
    }

    // 2) check wheather token is there or not, if not then user is not logged in
    if (!token) next(new AppError('You are not logged in!! Please login to get the access!!'));

    // 3) verification of the token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 4) check the user is there or not in the Database
    const user = await User.findById(decoded.id);

    // Grant access on the basis of logged in user
    req.user = user;
    next();
});

exports.isSignedIn = catchAsync(async (req, res, next) => {

     if (req.cookies && req.cookies.jwt) {
        // 1) verification of the token
        const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);

        // 2) check the user is there or not in the Database
        const currentUser = await User.findById(decoded.id);
        if(!currentUser) return next();

        // 3) There is logged in user
         req.userIs = currentUser;
         res.locals.user = currentUser;
         return next();
    }
    next();
});

exports.restrictTo = (roleCurrent) => {
    return (req, res, next) => {
        if (req.user.role !== roleCurrent) {
            return next(new AppError('You are not allowed to do this action!!', 403))
        }
        next();
    }
};