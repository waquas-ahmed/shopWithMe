const AppError =  require('../utility/appError');
const catchAsync = require('../utility/catchAsync');
const Review = require('../models/reviewModel');
const Product = require('../models/productModel')

exports.getAllReviews = catchAsync(async(req, res, next) => {

    const reviews = await Review.find();

    res.status(200).json({
        status: 'success',
        results: reviews.length,
        data: {
            reviews
        }
    });
});

exports.createReview = async(req, res, next) => {

    try {
        req.body.product = req.params.productId;
        req.body.user = req.user.id;
        const newReview = await Review.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                review: newReview
            }
        });
    } catch(error) {
        return next(new AppError('You already added review.😁', 401));
    }
};

exports.deleteReview = catchAsync(async(req, res, next) => {
    const review = await Review.findByIdAndDelete(req.params.reviewId);
    if (!review) return next(new AppError('This review is not there please select the correct Id', 401));

    res.status(204).json({
        status: 'success',
        data: null
    });
});