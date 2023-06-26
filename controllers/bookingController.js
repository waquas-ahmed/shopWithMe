const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Product = require('../models/productModel');
// const Booking = require('../models/bookingModel');
const catchAsync = require('../utility/catchAsync');
// const factory = require('./handlerFactory');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
    // 1)  Get the currently booked tour

    const product = await Product.findById(req.params.productId);

    // 2) create checkout session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        success_url: `${req.protocol}://${req.get('host')}/?product=${req.params.productId}&user=${req.user.id}&price=${product.price}`,
        cancel_url: `${req.protocol}://${req.get('host')}/product/${product.slug}`,
        customer_email: req.user.email,
        client_reference_id: req.params.productId,

        line_items: [
            {
             price_data: {
              currency: "usd",
              product_data: {
                name: product.name,
                // description: product.description[1],
                images: [`${product.image}`],
              },
              unit_amount: product.price * 100,
            },
            quantity: 4,
            },
          ],
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
  const { tour, user, price } = req.query;
  if(!tour && !user && !price) return next();

  // await Booking.create({tour, user, price});
  res.redirect(req.originalUrl.split('?')[0]);
});