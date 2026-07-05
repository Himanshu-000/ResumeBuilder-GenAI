const {Router} = require("express")
const auth_controllers = require("../controllers/auth.controllers")
const authMiddleware = require("../middleware/auth.middleware")

const auth_router = Router();

/**
 * @routes POST /api/auth/register
 * @description : Creating a new user
 * @access : public
 */

auth_router.post("/register", auth_controllers.registerUserController)

/**
 * @routes GET /api/auth/login
 * @description : login register user
 * @access : public
 */
auth_router.post("/login",auth_controllers.loginUser)


/**
 * @routes GET /api/auth/logot
 * @description : logout user
 * @access : public
 */
auth_router.get("/logout",auth_controllers.logoutUser)

/**
 * @routes GET /api/auth/get-met
 * @description : get the currennt loggde in user details
 * @access : private
 */

auth_router.get("/get-me",authMiddleware.authUser , auth_controllers.getMecontroller)


module.exports = auth_router;