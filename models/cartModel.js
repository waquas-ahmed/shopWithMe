const mongoose = require('mongoose');
const validator = require('validator');

const cartSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        type: String,
        required: [true, 'A product must have an product id!!']
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        type: String,
        required: [true, 'A cart must have an user id!!']
    }
},
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

cartSchema.index({
    productId: 1
}, {
    unique: true
});

cartSchema.pre(/^find/, function(next){
    this.populate({
        path: 'productId',
        select: 'name discountPrice image'
    });
    next();
});

const cart = mongoose.model('cart', cartSchema);

module.exports = cart