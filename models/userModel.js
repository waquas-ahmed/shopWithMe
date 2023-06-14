const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

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
    },
    role: {
        type: String,
        enum: {
            values: ['user', 'admin'],
            message: 'This field will accept user or admin!! Please add correct data'
        },
        default: 'user'
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
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
});

userSchema.pre('save', function(next) {
    if (!this.isModified('password') || this.isNew) next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
});

userSchema.pre(/^find/, function(next) {
    this.find({ active: { $ne : false } });
    next();
});

// ---------------------------------- METHODS -------------------------------------- //

userSchema.methods.correctPassword = async function(userEnteredPassword, passwordInDB) {
    // comparing the user entered password and the DB password
    return await bcrypt.compare(userEnteredPassword, passwordInDB);
}

userSchema.methods.createPasswordResetToken = function() {

    // 1) creating random token with the 32 bytes means total string lenght would be 64
    const resetToken = crypto.randomBytes(32).toString('hex');

    // 2) encrypting random token and this will reflect in the database
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
}

const User = mongoose.model('User', userSchema);

module.exports = User;