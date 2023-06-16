const mongoose = require('mongoose');

const Product = require('../models/productModel')

const reviewSchema = new mongoose.Schema({
    reviewTitle: {
        type: String,
        required: [true, 'Review should have a title'],
    },
    reviewDescription: {
        type: String,
        required: [true, 'Review should have a description'],
    },
    reviewRating: {
        type: Number,
        min: [1, 'Raing should have more than 1.0'],
        max: [5, 'Raing should have less than 5.0'],
        required: [true, 'Review should have a rating'],
    },
    reviewCount: Number,
    createdAt: {
        type: Date,
        default: new Date(Date.now())
    },
    product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    },
},
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// ----------indexing on the basis of the user and product id ------------
reviewSchema.index({
    product: 1, user: 1
}, {
    unique: true
});

reviewSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'user',
        select: 'name photo'
    });
    next();
});

reviewSchema.statics.calcAverageRatings = async function(productId) {
    const stats = await this.aggregate([
        {
            $match: { product: productId }
        },
        {
            $group: {
                _id: '$product',
                numberOfRatings: { $sum: 1 },
                averageRatings: { $avg: '$reviewRating' }
            }
        }
    ]);

    if (stats.length > 0) {
        await Product.findByIdAndUpdate(productId, {
            ratingAverage: stats[0].averageRatings,
            ratingQuantity: stats[0].numberOfRatings
        });
    } else {
        await Product.findByIdAndUpdate(productId, {
            ratingAverage: 4.5,
            ratingQuantity: 0
        });
    }
};

reviewSchema.post('save', function(next) {
    this.constructor.calcAverageRatings(this.product);
});

reviewSchema.pre(/^findOneAnd/, async function(next) {
    this.r = await this.findOne();
    next();
});

reviewSchema.post(/^findOneAnd/, async function(next) {
    await this.r.constructor.calcAverageRatings(this.r.product);

});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;