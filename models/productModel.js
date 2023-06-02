const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A product must have a name title']
    },
    price: {
        type: Number,
        required: [true, 'A product must have a price']
    }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product