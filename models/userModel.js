const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A user must have a name!']
    },
    email: {
        type: String,
        required: [true, 'A user must have an email!'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email!!']
    },
    photo: {
        type: String,
        default: 'user-default.jpg'
    },
    password: {
        type: String,
        required: [true, 'Please provide a password!!'],
        minlength: 8
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password!!'],
        validate: {
            // this validator will check if both password and passwordConfirm same or not
            validator: function(value) {
                return this.password === value
            },
            message: `Passwords are not same!!! (password) and (passwordConfirm) should be same!`
        }
    }
});

userSchema.pre('save', async function(next) {
    // this logic works when somebody do something with the password fields
    if (!this.isModified('password')) return next();

    // hashing the password before saving to the database
    this.password = await bcrypt.hash(this.password, 12);

    // making now passwordConfirm as undefined before saving
    this.passwordConfirm = undefined;

    next(); //this helps to run the next middleware if there is any
})

const User = mongoose.model('User', userSchema);

module.exports = User;