const path = require('path');
const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');

const productRouter = require('./routes/productRoute');
const userRouter = require('./routes/userRoute');
const reviewRouter = require('./routes/reviewRoute');
const viewRouter = require('./routes/viewRoute');
const bookingRouter = require('./routes/bookingRoute');
const addToCartRouter = require('./routes/addToCartRoute');
const errorController = require('./controllers/errorController');
const AppError = require('./utility/appError');

const app = express();

// setting of the pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// serving static data
app.use(express.static(path.join(__dirname, 'public')));

// this 3rd party middleware gives the details of the route or logging and also size
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// parsing body data to JSON in at our end
app.use(express.json());

// cookie oarser
app.use(cookieParser());
app.use((req, res, next)=>{
    // console.log(req.cookies);
    next();
})

// Data sanitizing against NoSQL query injection
app.use(mongoSanitize());

// serving static file
app.use(express.static(`${__dirname}/public`));

// ROUTES
app.use('/', viewRouter);

app.use('/api/v1/products', productRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);
app.use('/api/v1/shoppings', addToCartRouter);

app.all('*', (req, res, next) => {
     next(new AppError(`Can not find this URL ${req.originalUrl} on the server`, 404));
});

app.use(errorController);

module.exports = app;