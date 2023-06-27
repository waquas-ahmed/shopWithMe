const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Product = require('../models/productModel');
const AddToCart = require('../models/addToCartModel');
// const Booking = require('../models/bookingModel');
const catchAsync = require('../utility/catchAsync');
// const factory = require('./handlerFactory');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
    // 1)  Get the currently booked tour

    const quantityObj = JSON.parse(req.params.obj);

    const products = await AddToCart.find({ userId : req.user.id });

    // // 2) create checkout session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        success_url: `${req.protocol}://${req.get('host')}/?product=''&user=${req.user.id}&price=''`,
        cancel_url: `${req.protocol}://${req.get('host')}/mycart`,
        customer_email: req.user.email,
        client_reference_id: req.user.id,

        // line_items: [
        //     {
        //      price_data: {
        //       currency: "usd",
        //       product_data: {
        //         name: product.name,
        //         // description: product.description[1],
        //         images: [`${product.image}`],
        //       },
        //       unit_amount: product.discountPrice * 100,
        //     },
        //     quantity: 4,
        //     },
        //   ],

        line_items: products.map(product => {
          const storeItem = product;
          return {
            price_data: {
              currency: "inr",
              product_data: {
                name: storeItem.productId.name,
                // description: product.description[1],
                images: [`${storeItem.productId.image}`],
              },
              unit_amount: storeItem.productId.discountPrice * 100,
            },
            // quantity: quantityObj.find(item => Object.keys(item) === storeItem.productId.id ? Object.values(item) : ''),
            quantity: quantityObj[storeItem.productId.id],
          }
        }),
        mode: 'payment'
    });
    // 3) create session as response
    res.status(200).json({
        status: 'success',
        session
    });
});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {

  // This is only the TEMPORARY because it is UNSECURE: everyone can make booking with paying.
  // const { tour, user, price } = req.query;
  // if(!tour && !user && !price) return next();

  // // await Booking.create({tour, user, price});
  // res.redirect(req.originalUrl.split('?')[0]);
});