const fs = require('fs');

const Product = require('../models/productModel');
const ApiFeatures = require('../utility/apiFeatures');
const catchAsync = require('../utility/catchAsync');
const AppError = require('../utility/appError');
const { match } = require('assert');

exports.getAllProducts = catchAsync(async (req, res, next) => {
    // console.log('hey ', req.user.name);
        // Api features are executing here to filter, sort, limit and paginate
        const features = new ApiFeatures(Product.find(), req.query)
        .filter()
        .regex()
        .sort()
        .limit()
        .paginate();

        // Execute query
        const products = await features.query;

        res.status(200).json({
            status: 'success',
            results: products.length,
            data: {
                products
            }
        });
});

exports.getProduct = catchAsync(async (req, res, next) => {

        const product = await Product.findById(req.params.id).populate('reviews');

        // throwing error when product not matched
        if (!product) return next(new AppError('No Product found with this ID', 404));

        res.status(200).json({
            status: 'success',
            data: {
                product
            }
        });
});


exports.createProduct = catchAsync(async (req, res) => {
        const product = await Product.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                product
            }
        });
})


exports.updateProduct = catchAsync(async (req, res) => {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
        res.status(200).json({
        status: 'success',
        data: {
            product
        }
    });

})

exports.deleteProduct = catchAsync(async (req, res) => {
        await Product.findByIdAndDelete(req.params.id)
        res.status(204).json({
            status: 'success',
            data: null
        });
})