// importation
const mongoose = require('mongoose');

//Declaration du schema sauce
const sauceSchema = mongoose.Schema({
    userId : {type: String, required : true , unique : true},
    name: {type : String, required: true},
    manufacturer: {type : String, required: true},
    description: {type : String, required: true},
    mainPepper: {type : String, required: true},
    imageUrl: {type : String, required: true},
    heat: {type : Number, required: true},
    likes: {type : Number, required : false , default : 0},
    dislikes: {type : Number, required : false , default : 0},
    usersLiked: {type : Array, required : false},
    usersDisliked: {type : Array, required : false},
});

//export du modèle
module.exports = mongoose.model('Sauce', sauceSchema);