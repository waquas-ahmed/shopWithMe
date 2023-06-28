// const mongoose = require('mongoose');
// const validator = require('validator');

// const bookingSchema = new mongoose.Schema({
//     productId: {
//         type: mongoose.Schema.ObjectId,
//         ref: 'Product',
//         type: Array,
//         required: [true, 'A booking must have an product id!!']
//     },
//     userId: {
//         type: String,
//         required: [true, 'A booking must have an user id!!']
//     },
//     createdAt: {
//         type: Number,
//         default: Date.now()
//     },
//     paid: {
//         type: Boolean,
//         default: true
//     }

// },
// {
//     toJSON: { virtuals: true },
//     toObject: { virtuals: true }
// });

// bookingSchema.pre(/^find/, function(next){
//     this.populate({
//         path: 'productId',
//         select: 'name discountPrice image'
//     });
//     next();
// });

// const booking = mongoose.model('Booking', bookingSchema);

// module.exports = booking;