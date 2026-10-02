const userModel = require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/blacklist.model")

/**
 * @name registerUserController
 * @description register a new user , expects username , email and password in thr request
 * @access Public
 */

async function registerUserController(req, res) {

const  {username , email , password} = req.body
if(!username || !email || !password){
    return res.status(400).json({
        message: "username , email and password are required"
    })

}
const isUserAlreadyExist = await userModel.findOne({
    $or: [{username}, {email}]
})
if(isUserAlreadyExist){
    return res.status(400).json({
        message: "username or email already taken"
    })
}
const hash = await bcrypt.hash(password, 10)
const user = await userModel.create({
    username,
    email,
    password: hash    

})
const token = jwt.sign(
    {id: user._id, username: user.username},
    process.env.JWT_SECRET,
    {expiresIn: "1d"}
)

res.cookie("token", token)


res.status(201).json({
    message: "user created successfully",
    user: {
        id: user._id,
        username: user.username,
        email: user.email
    }
    
})
}

/**
 * 
 * @name loginUserController
 * @description login a user , expects email and password in the request body
 * @access Public   
 */
async function loginUserController(req, res) {
    const {email, password} = req.body
    const user = await userModel.findOne({email})
    if(!user){
        return res.status(400).json({
            message: "invalid email or password"
        })
    }
   const isPasswordValid = await bcrypt.compare(password, user.password)
   if(!isPasswordValid){
    return res.status(400).json({
        message: "invalid email or password"
    })
   }
    const token = jwt.sign(
        {id: user._id, username: user.username},
        process.env.JWT_SECRET,
        {expiresIn: "1d"}
    )
    res.cookie("token", token)
    res.status(200).json({
        message: "user logged in successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

/**
 * @name logoutUserController
 * @description logout a user by clearing the token cookie and blacklisting the token
 * @access Public   
 */

async function logoutUserController(req, res) {
    // Attempt to get token from cookies or Authorization header
    const token = req.cookies?.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
    
    console.log("Token received for logout:", token);

    if (token) {
        try {
            await tokenBlacklistModel.create({ token });
            console.log("Token blacklisted successfully");
        } catch (error) {
            console.error("Error blacklisting token:", error);
        }
    } else {
        console.log("No token found in request to blacklist");
    }

    res.clearCookie("token");
    res.status(200).json({
        message: "user logged out successfully"
    });  
}
/**
 * @name getMeController
 * @description Get the currently logged-in user's information
 * @access Private
 */
async function getMeController(req, res) {
    const user = await userModel.findById(req.user.id)
    res.status(200).json({
        message: "user fetched successfully",
        user: {
            id : user._id,
            username: user.username,
            email: user.email
        }
    })
}
module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController
}

