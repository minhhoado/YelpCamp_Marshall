let mongoose = require('mongoose');
let passportLocalMongoose = require("passport-local-mongoose");

let UserSchema = new mongoose.Schema({
    username: {type: String, unique: true, required: true},
    email: {type: String, unique: true, required: true},
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    password: String
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",UserSchema);