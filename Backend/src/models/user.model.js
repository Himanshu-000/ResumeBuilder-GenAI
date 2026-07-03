const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username : {
        type : String,
        unique : [ true , "Username alreay taken"],
        required : true,
    },
    email : {
        type : String,
        unique : [ true , "account alreay exists"],
        required : true,
    },

    password :  {
        type : String,
        required : true,
    }

})

const UserModel = mongoose.model("user" , UserSchema)

module.exports = UserModel;