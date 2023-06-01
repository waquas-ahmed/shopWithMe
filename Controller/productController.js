const fs = require('fs');

const products = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/all-data-trimRecords.json`));

exports.checkID = (req, res, next, value) => {
    const product = products.find(el => el.productId === value);
    if (!product) return res.status(404).json({
        status: 'error',
        message: 'Invalid ID'
    });
    next();
}

exports.getAllProducts = (req, res) => {
    res.status(200).json({
        status: 'success',
        results: products.length,
        data: {
            products
        }
    });
}

exports.getProduct = (req, res) => {
    const id = req.params.id;
    const product = products.find(el => el.productId === id);

    res.status(200).json({
        status: 'success',
        data: {
            product
        }
    });
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