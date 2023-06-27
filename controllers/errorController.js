const AppError = require('../utility/appError');

const handleCastErrorDB = error => {
    const message = `Invalid ${error.path}: ${error.value}`;
    return new AppError(message, 400);
}

const handleDuplicateFieldsDB = err => {
    const field = Object.keys(err.keyValue);
    const value = Object.values(err.keyValue);
    // console.log(err)
    const message = `Duplicate field Value: ${value}. Please use another ${field} !!`;
    return new AppError(message, 400);
}

const handleSyntaxErrorDB = err => {
    const message = 'Some Unexpected input data, Please verify your input data';
    return new AppError(message, 400);
}

const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(er => er.message);
    const message = `Invalid Input data: ${errors.join(' || ')}`;
    return new AppError(message, 400);
}

const sendErrorDev = (err, res) => {

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    });
}

const sendErrorProd = (err, res) => {
    // operational  trusted error: sending error to the customer
    if (err.operational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    } else {
    // programming or other unknown error so that we wont send error details to the customer
        res.status(500).json({
            status: 'error',
            message: err
            // status: 'error',
            // message: 'Something went very wrong!'
        });
    }
}

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    }
    if (process.env.NODE_ENV === 'production') {
        let error = {...err}
        error.name = err.name;
        error.message = err.message;

        // If id not shows in the in the DB - throwing casst error
        if (error.name === 'CastError') error = handleCastErrorDB(error);
        if (error.code === 11000) error = handleDuplicateFieldsDB(error);
        if (error.name === 'SyntaxError') error = handleSyntaxErrorDB(error);
        if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
        // if (error.name === 'MongooseError') error = handleMongoErrorDB(error);
        // console.log(error)
        sendErrorProd(error, res);
    }
}