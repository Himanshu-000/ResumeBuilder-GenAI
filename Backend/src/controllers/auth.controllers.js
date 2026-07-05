const userModel = require("../models/user.model");
const bycrpt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const Blacklistedtoken = require("../models/blacklist.model")

/**
 * @name: ragisternewuser
 * @description Create new user , expects username , email , paswword 
 * @access :public
 */

async function registerUserController(req , res) {
 
    const { username , email  , password} = req.body;

    if(!username || !email || !password){
        return res.status(400).json({ message : "Please provide username email or password"})
    }

    const isUserExists = await userModel.findOne({
        $or : [{username},{email}]
    })

    if(isUserExists){
        return res.status(400).json({ message : "User is already exists"})
    }

     const hash = await bycrpt.hash(password , 10)
  
     const user = await userModel.create({
         username,
         email,
         password : hash 
     })

      // creating a jwt token by the use of user data {id and username } 
     const token = jwt.sign(
        {id : user._id , username: user.username},
        process.env.JWT_SECRET , 
        {expiresIn : "1d"}
     )

     res.cookie("token" , token)

     res.status(201).json({
        message : " User register successfully " , 
        user : {
            id : user._id,
            username : user.username,
            email : user.email
        }
     })

}

async function loginUser(req , res) {

    const {email , password} = req.body;

    const user = await userModel.findOne({email});

    if(!user){
        return res.status(400).json({message : "Invalid user or password"})
    }
     
    const ispasswordvalid = await bycrpt.compare(password , user.password);
    
    if(!ispasswordvalid){
        return res.status(400).json({message : "Invalid user or password"})
    }

    const token = jwt.sign(
        {id : user._id , username: user.username },
        process.env.JWT_SECRET,
        {expiresIn :  "1d"}
    )
    res.cookie("token" , token)

     res.status(200).json({
          message : "user login successfully",
          user : {
            id : user._id,
            username : user.username,
            email : user.email
          }
     })
}

async function logoutUser(req , res) {

    try{const token = req.cookies.token

    if(token){
        await Blacklistedtoken.create({token})   
    }

    res.clearCookie("token");

    res.status(200).json({ message : "User Logout succussfully"})
}catch(err){
    console.log(err);
    res.status(401).json({
        message : "(err)"
    })
}
    
}

async function getMecontroller(req , res) {
    
    const user = await userModel.findById(req.user.id)

    res.status(200).json({
        message : "user fetch successfully",

        user : {
         id : user._id,
         username : user.username,
         email : user.email
        }
    })
}

module.exports = { registerUserController , loginUser , logoutUser , getMecontroller}