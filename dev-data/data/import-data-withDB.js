const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const Product = require('../../models/productModel');
const User = require('../../models/userModel');

dotenv.config({path: './config.env'});

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(()=>{
    console.log('Database connected successfully!!');
});

const products = JSON.parse(fs.readFileSync(`${__dirname}/all-data-trimRecords.json`));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`));

const importData = async () => {
    try {
        await Product.create(products);
        await User.create(users, { validateBeforeSave: false });

        console.log('Data Uploaded successfully!!');
    } catch (error) {
        console.log('Data not uploaded!', error);
    }
    process.exit();
}

const deleteData = async () => {
    try {
        await Product.deleteMany();
        await User.deleteMany();
        console.log('Data deleted successfully!!');
    } catch (error) {
        console.log('Data not deleted!!');
    }
    process.exit();
}

if(process.argv[2] === '--import') {
    importData();
} else if(process.argv[2] === '--delete') {
    deleteData();
}
