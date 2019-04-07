const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const Schema = mongoose.Schema;

//User Model
const UserSchema = new Schema({
    username: {
        type: String,
        minlength: [6, 'Minimum length of username must be 6 characters'],
        trim: true,
        lowercase: true,
        required: true,
        unique: true
    },
    password: {
        type: String,
        minlength: [6, 'Minimum length of password must be 6 characters'],
    },
    avatar: String,
    firstName: String,
    lastName: String,
    email: String,
    isAdmin: {
        type: Boolean,
        default: false
    }
});

UserSchema.plugin(passportLocalMongoose)
const User = mongoose.model('User', UserSchema);

module.exports = User;