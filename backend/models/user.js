// Importation
const mongoose = require ('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Declaration du Schema
const userSchema = mongoose.Schema({
    email : {type : String, required : true, unique : true},
    password : {type : String, required : true}
});

userSchema.plugin(uniqueValidator);

// exports
module.exports = mongoose.model('User', userSchema);