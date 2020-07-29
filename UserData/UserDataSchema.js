const mongoose = require('mongoose');
const UserData = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    _id:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    cartItems:{
        type:Object
    }
})

module.exports = mongoose.model('User-data',UserData);