const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const productSchema = new mongoose.Schema({
    productId: {
        type: Number,
        required: [true, 'A product must have an product id!!']
    },
    name: {
        type: String,
        required: [true, 'A product must have a name!!']
    },
    price: {
        type: Number,
        required: [true, 'A product must have a price']
    },
    totalStock: Number,
    brand: {
        type: String,
        required: [true, 'A product must contain brand name']
    },
    image: String,
    genderCategory: String,
    composition: {
        type: Object
    },
    description: [Array],
    availability: {
        type: String,
        default: false
    },
    washCare: Array,
    discountOff: String,
    discountPrice: {
        type: Number,
        validate: {
            validator: function(val) {
                    return val < this.price;
            },
            message: 'Discount price ({VALUE}) should be below regular price'
        }
    },
    slug: String,
    ratingAverage: {
        type: Number,
        default: 4.8,
        min: [1, 'Raing should have more than 1.0'],
        max: [5, 'Raing should have less than 5.0'],
    },
    ratingQuantity: {
        type: Number,
        default: 0
    },
},
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// virtual populate

productSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'product',
    localField: '_id'
});

productSchema.pre('save', function(next) {
    this.slug = slugify(this.name, {lower: true})
    next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product