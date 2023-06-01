const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const productRouter = require('./routes/productRoute');
const userRouter = require('./routes/userRoute');

const app = express();

// parsing body data to JSON in at our end
app.use(express.json());

// this 3rd party middleware gives the details of the route or logging and also size
app.use(morgan('dev'))

// ROUTES

app.use('/api/v1/products', productRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;