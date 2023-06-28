const addToCart = require('../models/cartModel');
// const Booking = require('../models/bookingModel');
const catchAsync = require('../utility/catchAsync');
// const factory = require('./handlerFactory');

exports.createProductAddtocart = catchAsync(async (req, res, next) => {
    console.log(req.params.productId)
    console.log(req.user.id)
    const addToCartProductAdded = await addToCart.create({ productId: req.params.productId, userId: req.user.id });

    console.log(addToCartProductAdded)
    res.status(201).json({
        status: 'success',
        data: {
            addToCartProduct: addToCartProductAdded
        }
    });
});

exports.deleteProductAddtocart = catchAsync(async (req, res, next) => {

    await addToCart.findOneAndDelete({ _id: req.params.productId });

    res.status(204).json({
        status: 'success',
        data: null
    });
});


exports.getAllInCart = catchAsync(async (req, res, next) => {

    const allInCarts = await addToCart.find({ userId: req.user.id });

    res.status(200).json({
        status: 'success',
        data: {
            products: allInCarts
        }
    });
});