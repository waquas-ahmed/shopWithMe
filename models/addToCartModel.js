const mongoose = require('mongoose');
const validator = require('validator');

const addToCartSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        type: String,
        required: [true, 'A product must have an product id!!']
    },
    userId: {
        type: String,
        required: [true, 'A cart must have an user id!!']
    }
},
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

addToCartSchema.index({
    productId: 1
}, {
    unique: true
});

addToCartSchema.pre(/^find/, function(next){
    this.populate({
        path: 'productId',
        select: 'name discountPrice image'
    });
    next();
});

const addToCart = mongoose.model('addToCart', addToCartSchema);

module.exports = addToCart