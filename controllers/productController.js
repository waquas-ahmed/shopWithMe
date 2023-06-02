const fs = require('fs');

const Product = require('../models/productModel');

// exports.checkID = async (req, res, next, value) => {
//     console.log('value',value)
//     const product = await Product.findById(value);
//     console.log('product',value)
//     if (!product) return res.status(404).json({
//         status: 'error',
//         message: 'Invalid ID'
//     });
//     next();
// }

exports.getAllProducts = async (req, res) => {
    const products = await Product.find()
    res.status(200).json({
        status: 'success',
        results: products.length,
        data: {
            products
        }
    });
}

exports.getProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await Product.findById(id);

        res.status(200).json({
            status: 'success',
            data: {
                product
            }
        });

    } catch (error) {
        res.status(404).json({
            status: 'error',
            message: error
        });
    }

}


exports.createProduct = (req, res) => {
    const newProduct = req.body;
    products.push(newProduct);
    fs.writeFile(`${__dirname}/../dev-data/data/all-data-trimRecords.json`, JSON.stringify(products), err => {
        res.status(201).json({
            status: 'success',
            data: {
                product: newProduct
            }
        });
    });
}


exports.updateProduct = (req, res) => {
    const id = req.params.id;

    res.status(200).json({
        status: 'success',
        data: {
            product: '<Updated product here..>'
        }
    });
}

exports.deleteProduct = (req, res) => {

    res.status(204).json({
        status: 'success',
        data: null
    });
}