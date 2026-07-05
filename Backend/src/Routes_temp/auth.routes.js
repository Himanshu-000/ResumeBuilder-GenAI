const {Router} = require("express")
const auth_controller = require("../contollers/auth.controller")
const authMiddleweare = require("../middleweare/auth.middleweare")

const auth_router = Router();

/**
 * @routes POST /api/auth/register
 * @description : Creating a new user
 * @access : public
 */

auth_router.post("/register", auth_controller.registerUserController)

/**
 * @routes GET /api/auth/login
 * @description : login register user
 * @access : public
 */
auth_router.post("/login",auth_controller.loginUser)


/**
 * @routes GET /api/auth/logot
 * @description : logout user
 * @access : public
 */
auth_router.get("/logout",auth_controller.logoutUser)

/**
 * @routes GET /api/auth/get-met
 * @description : get the currennt loggde in user details
 * @access : private
 */

auth_router.get("/get-me",authMiddleweare.authUser , auth_controller.getMecontroller)


module.exports = auth_router;