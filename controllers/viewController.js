const catchAsync = require('../utility/catchAsync')
const Product = require('../models/productModel');
const addToCart = require('../models/cartModel');
const ApiFeatures = require('../utility/apiFeatures');
const Booking = require('../models/bookingModel')


exports.getHomepage = catchAsync(async (req, res) => {

    // t-shirt is there for all category
    const tshirtProducts = await Product.find({ name : { $regex : /t-shirt/i }});

    // exclusive offers which is more than 46% off
    const exlusiveOffers = await Product.find({ discountOff : { $gt : '46' }});

    // exclusive offers which is more than 46% off
    const reviewedProducts = await Product.find({ ratingQuantity : { $gt : '0' } });
    // console.log(reviewedProducts.length)

    res.status(200).render('home', {
        title: 'Home Page',
        exlusiveOffers,
        tshirtProducts: tshirtProducts.slice(3, 15),
        reviewedProducts
    });


    // res.status(200).json({
    //     results: tshirtProducts.length,
    //     data: {
    //         prodcts: tshirtProducts
    //     }
    // })
});

exports.getProductpage = catchAsync(async (req, res) => {

    // console.log(req.userIs)
    // t-shirt is there for all category
    const productPage = await Product.findOne({ slug : req.params.slug, productId : req.params.productId}).populate({
        path: 'reviews',
        // fields: 'review rating user'
    });


    res.status(200).render('product', {
        title: 'Prouct Page',
        productPage
    });


    // res.status(200).json({
    //     results: productPage.length,
    //     data: {
    //         prodcts: productPage
    //     }
    // });
});

exports.getSearchResultpage = catchAsync(async (req, res) => {
    let features;
    let productResults;
    let totalProducts;
    let totalNumberOfPages;
    let paginationUrl = req.originalUrl;
    paginationUrl = paginationUrl.includes('page') ? paginationUrl : `${paginationUrl}&page=1`;

    // check if page field is there in the query object or not
    if (req.query && !req.query.page) req.query.page = '1';

    if (req.query.searchTerms && req.query.searchTerms.toLowerCase().includes('all') && req.query.genderCategory === 'all') {
        req.query.page = 1;
        productResults = await Product.find();
        totalProducts = productResults.length;
    } else {
        features = new ApiFeatures(Product.find(), req.query)
        .filter()
        .regex()
        .sort()
        .limit();

        // total products on the category
        totalProducts = (await features.query).length;
        totalNumberOfPages = Math.ceil(totalProducts/12);

        // pagination
        if (req.query.page) {
            productResults = await features.paginate();
        }

        // Execute query
        productResults = await features.query;
    }


    // men all products
    const menAllProducts = await Product.find({ genderCategory: 'men'});

    // women all products
    const womenAllProducts = await Product.find({ genderCategory: 'women'});

    // boys all products
    const boysAllProducts = await Product.find({ genderCategory: 'boys'});

    // girls all products
    const girlsAllProducts = await Product.find({ genderCategory: 'girls'});

    // check if there is no product then render the error page
    if (!totalProducts) {
        return res.status(200).render('error', {
            title: 'No Search Results',
            searchTerms: req.query.searchTerms
        })
    }

    res.status(200).render('searchPage', {
        title: 'Search Results',
        productResults,
        totalProducts,
        menAllProducts,
        womenAllProducts,
        boysAllProducts,
        girlsAllProducts,
        totalNumberOfPages,
        paginationUrl
    });

        // res.status(200).json({
        // results: products.length,
        // data: {
        //     products
        // }
    // })
});

exports.getSignupForm = (req, res) => {
    res.status(200).render('signup', {
        title: 'Create your account!'
    });
}

exports.getLoginForm = (req, res) => {
    res.status(200).render('login', {
        title: 'Log into your account'
    });
}

exports.getAccount = (req, res) => {
    res.status(200).render('myaccount', {
        title: 'My Account Chart'
    });
}

exports.getCart = catchAsync(async(req, res) => {

    const allProductsInCart = await addToCart.find({userId: req.userIs.id});

    res.status(200).render('mycart', {
        title: 'My Cart',
        cartProduct: allProductsInCart
    });
});

exports.orderHistory = catchAsync(async(req, res) => {

    const allProductsFromBooking = await Booking.find({userId: req.userIs.id});

    // console.log(allProductsFromBooking)
    // console.log(allProductsFromBooking.length)
    res.status(200).render('bookings', {
        title: 'Your Order History',
        bookings: allProductsFromBooking
    });
});

exports.getPolicy = (req, res) => {
    res.status(200).render('generalTextPolicy', {
        title: 'our policy'
    });
}

exports.getContact = (req, res) => {
    res.status(200).render('generalTextContact', {
        title: 'contact us'
    });
}

exports.getAboutus = (req, res) => {
    res.status(200).render('generalTextAbout', {
        title: 'about us'
    });
}
