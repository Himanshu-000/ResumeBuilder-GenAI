const mongoose = require("mongoose");

const BlacklistedToekn = new mongoose.Schema({
    token : {
        type : String,
        required : [true , "Token is required!"],
    }
},{
     timestamps : true
    
})

const BlackelistedModel = mongoose.model("BlackListToken" , BlacklistedToekn)

module.exports = BlackelistedModel;