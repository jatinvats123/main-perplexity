import { Router } from "express";
 import { register, verifyEmail, login, getMe, createTestUser, verifyUserByEmail } from "../controllers/auth.controller.js";
import { registerValidator, loginValidator } from "../validators/auth.validator.js";
import { authUser } from "../middleware/auth.middleware.js";

const authRouter = Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 * @body { username, email, password }
 */
authRouter.post("/register", registerValidator, register);


/**
 * @route POST /api/auth/login
 * @desc Login user and return JWT token
 * @access Public
 * @body { email, password }
 */
authRouter.post("/login", loginValidator, login)



/**
 * @route GET /api/auth/get-me
 * @desc Get current logged in user's details
 * @access Private
 */
authRouter.get('/get-me', authUser, getMe)

/**
 * @route GET /api/auth/verify-email
 * @desc Verify user's email address
 * @access Public
 * @query { token }
 */
authRouter.get('/verify-email', verifyEmail)

/**
 * @route POST /api/auth/test-user
 * @desc Create a test user for development (development only)
 * @access Public
 */
authRouter.post('/test-user', createTestUser)

/**
 * @route POST /api/auth/verify-user
 * @desc Verify user by email (development only)
 * @access Public
 * @body { email }
 */
authRouter.post('/verify-user', verifyUserByEmail)

export default authRouter;