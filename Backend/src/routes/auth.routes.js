const {Router}= require("express");
const authController = require("../controllers/auth.controller")
const authRouter = Router()
const authMiddleware = require("../middlewares/auth.middleware")

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

/**
 * @route GET /api/auth/get-me
 * @description Get the currently logged-in user's information
 * @access Private       
 */
authRouter.get("/get-me", authMiddleware.authUser, authController.getMeController)
 
module.exports = authRouter