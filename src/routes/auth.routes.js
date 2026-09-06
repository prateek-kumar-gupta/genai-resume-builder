const {Router}= require("express");
const authController = require("../controllers/auth.controller")
const authRouter = Router()

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public   
 */

authRouter.post("/register", authController.registerUserController)


/**
 * @route POST /api/auth/login
 * @description Login a user with email and password
 * @access Public       
 */

authRouter.post("/login", authController.loginUserController)

/**
 * @route GET /api/auth/logout
 * @description Logout a user by clearing the token cookie
 * @access public        
 */
authRouter.get("/logout", authController.logoutUserController)
module.exports = authRouter