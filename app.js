const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const productRouter = require('./routes/productRoute');
const userRouter = require('./routes/userRoute');
const errorController = require('./controllers/errorController');
const AppError = require('./utility/appError');

const app = express();

// this 3rd party middleware gives the details of the route or logging and also size
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// parsing body data to JSON in at our end
app.use(express.json());

// serving static file
app.use(express.static(`${__dirname}/public`));

// ROUTES

app.use('/api/v1/products', productRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
     next(new AppError(`Can not find this URL ${req.originalUrl} on the server`, 404));
});

app.use(errorController);

module.exports = app;