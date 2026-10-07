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

const  {username , email , password, otp} = req.body
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

res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "none" })


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
    res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "none" })
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

    res.clearCookie("token", { httpOnly: true, secure: true, sameSite: "none" });
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

const OtpModel = require('../models/otp.model');
const { sendOtpEmail } = require('../services/email.service');

// Generate 6 digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * @name requestOtpController
 * @description Request an OTP for password reset or verification
 * @access Public
 */
async function requestOtpController(req, res) {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await userModel.findOne({ email });
    if (!user) {
        // Still return success to prevent email enumeration, or return 404
        return res.status(404).json({ message: 'No account found with this email' });
    }

    const otp = generateOTP();
    
    // Save or update OTP
    await OtpModel.findOneAndDelete({ email });
    await OtpModel.create({ email, otp });

    // Send email
    const emailSent = await sendOtpEmail(email, otp);
    
    if (emailSent) {
        res.status(200).json({ message: 'OTP sent to email successfully' });
    } else {
        res.status(500).json({ message: 'Failed to send email. Check SMTP settings.' });
    }
}

/**
 * @name verifyOtpAndResetPasswordController
 * @description Verify the OTP and reset the user password
 * @access Public
 */
async function verifyOtpAndResetPasswordController(req, res) {
    const { email, otp, newPassword } = req.body;
    
    if (!email || !otp || !newPassword) {
        return res.status(400).json({ message: 'Email, OTP, and new password are required' });
    }

    const otpRecord = await OtpModel.findOne({ email, otp });
    
    if (!otpRecord) {
        return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const hash = await bcrypt.hash(newPassword, 10);
    await userModel.findOneAndUpdate({ email }, { password: hash });
    
    // Clean up used OTP
    await OtpModel.findOneAndDelete({ email });

    res.status(200).json({ message: 'Password reset successfully. You can now login.' });
}


/**
 * @name googleLoginController
 * @description Login or Register a user via Google
 * @access Public
 */
async function googleLoginController(req, res) {
    const { email, username, googleId, profilePicture } = req.body;
    
    if (!email) {
        return res.status(400).json({ message: 'Email is required from Google' });
    }

    try {
        let user = await userModel.findOne({ email });
        
        // If user doesn't exist, register them automatically
        if (!user) {
            // Generate a random secure password for Google-registered users
            const randomPassword = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10);
            const hash = await bcrypt.hash(randomPassword, 10);
            
            // Try to use the Google display name, or fallback to email prefix
            const finalUsername = username || email.split('@')[0];
            
            user = await userModel.create({
                username: finalUsername,
                email,
                password: hash
            });
        }
        
        const token = jwt.sign(
            {id: user._id, username: user.username},
            process.env.JWT_SECRET,
            {expiresIn: "1d"}
        );

        res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "none" });
        
        res.status(200).json({
            message: "User authenticated via Google successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (err) {
        console.error("Google Auth Error:", err);
        res.status(500).json({ message: "Failed to authenticate with Google" });
    }
}


/**
 * @name requestRegistrationOtpController
 * @description Request an OTP for new user registration
 * @access Public
 */
async function requestRegistrationOtpController(req, res) {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await userModel.findOne({ email });
    if (user) {
        return res.status(400).json({ message: 'Email is already registered' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    await require('../models/otp.model').findOneAndDelete({ email });
    await require('../models/otp.model').create({ email, otp });

    const { sendOtpEmail } = require('../services/email.service');
    const emailSent = await sendOtpEmail(email, otp);
    
    if (emailSent) {
        res.status(200).json({ message: 'OTP sent to email successfully' });
    } else {
        res.status(500).json({ message: 'Failed to send verification email.' });
    }
}
module.exports = {
    requestRegistrationOtpController,
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController,
    requestOtpController,
    verifyOtpAndResetPasswordController,
    googleLoginController
};;







