import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/mail.service.js";


/**
 * @desc Register a new user
 * @route POST /api/auth/register
 * @access Public
 * @body { username, email, password }
 */
export async function register(req, res) {
    try {
        const { username, email, password } = req.body;

        console.log("📝 REGISTRATION REQUEST:");
        console.log("   username:", username);
        console.log("   email:", email);
        console.log("   password:", password ? "***" : "EMPTY");

        const isUserAlreadyExists = await userModel.findOne({
            $or: [ { email }, { username } ]
        })

        if (isUserAlreadyExists) {
            return res.status(400).json({
                message: "User with this email or username already exists",
                success: false,
                err: "User already exists"
            })
        }

        const user = await userModel.create({ username, email, password })
        console.log("✅ User created:", user._id);

        const emailVerificationToken = jwt.sign({
            email: user.email,
        }, process.env.JWT_SECRET)

        console.log("🔑 Email verification token generated");

        try {
            await sendEmail({
                to: email,
                subject: "Welcome to Perplexity! - Verify Your Email",
                html: `
                    <h2>Welcome to Perplexity, ${username}!</h2>
                    <p>Thank you for registering at <strong>Perplexity</strong>. We're excited to have you on board!</p>
                    <p>Please verify your email address by clicking the link below:</p>
                    <a href="http://192.168.1.8:5173/verify-email?token=${emailVerificationToken}" style="display: inline-block; padding: 10px 20px; background-color: #31b8c6; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">Verify Email</a>
                    <p>If you did not create an account, please ignore this email.</p>
                    <p>Best regards,<br>The Perplexity Team</p>
                `
            })
            console.log("✅ Verification email sent successfully");
        } catch (emailError) {
            console.error("⚠️  Email sending failed, but user was created:", emailError.message);
            // Don't fail the registration if email fails - user can still verify later
        }

        res.status(201).json({
            message: "User registered successfully. Please check your email to verify your account.",
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error("❌ Registration error:", error.message);
        res.status(500).json({
            message: "Server error",
            success: false,
            err: error.message
        })
    }
}

/**
 * @desc Login user and return JWT token
 * @route POST /api/auth/login
 * @access Public
 * @body { email, password }
 */
export async function login(req, res) {
    try {
        // DEBUG: Log incoming request
        console.log("🔐 LOGIN REQUEST:");
        console.log("   req.body:", req.body);
        console.log("   req.headers.content-type:", req.headers["content-type"]);
        
        const { email, password } = req.body;
        
        // Validate extracted values
        console.log("   Extracted - email:", email, "| password:", password ? "***" : "EMPTY");

        const user = await userModel.findOne({ email })

        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password",
                success: false,
                err: "User not found"
            })
        }

        const isPasswordMatch = await user.comparePassword(password);

        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Invalid email or password",
                success: false,
                err: "Incorrect password"
            })
        }

        if (!user.verified) {
            return res.status(400).json({
                message: "Please verify your email before logging in",
                success: false,
                err: "Email not verified"
            })
        }

        const token = jwt.sign({
            id: user._id,
            username: user.username,
        }, process.env.JWT_SECRET, { expiresIn: '7d' })

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/"
        })

        res.status(200).json({
            message: "Login successful",
            success: true,
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        })
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            success: false,
            err: error.message
        })
    }
}


/**
 * @desc Get current logged in user's details
 * @route GET /api/auth/get-me
 * @access Private
 */
export async function getMe(req, res) {
    try {
        console.log("👤 GET-ME REQUEST:");
        console.log("   req.user:", req.user);
        
        const userId = req.user.id;
        
        console.log("   Looking for userId:", userId);

        const user = await userModel.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
                err: "User not found"
            })
        }

        res.status(200).json({
            message: "User details fetched successfully",
            success: true,
            user
        })
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            success: false,
            err: error.message
        })
    }
}


/**
 * @desc Verify user's email address
 * @route GET /api/auth/verify-email
 * @access Public
 * @query { token }
 */
export async function verifyEmail(req, res) {
    const { token } = req.query;

    try {
        console.log("\n📧 EMAIL VERIFICATION REQUEST:");
        console.log("   URL:", req.originalUrl);
        console.log("   Method:", req.method);
        console.log("   Headers Authorization:", req.headers.authorization || "NONE");
        console.log("   Token received:", token ? `YES (length: ${token.length})` : "NO");

        if (!token) {
            console.log("   ❌ No token provided!");
            return res.status(400).json({
                message: "No verification token provided",
                success: false,
                err: "Token missing"
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("   ✅ Token verified for email:", decoded.email);

        const user = await userModel.findOne({ email: decoded.email });

        if (!user) {
            console.log("   ❌ User not found for email:", decoded.email);
            return res.status(400).json({
                message: "Invalid token",
                success: false,
                err: "User not found"
            })
        }

        console.log("   📝 User found:", user.username);
        console.log("   Current verified status:", user.verified);

        user.verified = true;
        await user.save();

        console.log("   ✅ User verified status saved!");
        console.log("   Final verified status:", user.verified);

        const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Email Verified - Perplexity</title>
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .container {
                    max-width: 500px;
                    padding: 40px;
                    background: rgba(30, 41, 59, 0.8);
                    border: 1px solid rgba(49, 184, 198, 0.4);
                    border-radius: 12px;
                    text-align: center;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                    backdrop-filter: blur(10px);
                }
                .success-icon {
                    font-size: 60px;
                    margin-bottom: 20px;
                    animation: bounce 0.6s ease-in-out;
                }
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                h1 {
                    color: #31b8c6;
                    margin: 0 0 15px 0;
                    font-size: 28px;
                }
                p {
                    color: #e2e8f0;
                    margin: 10px 0;
                    line-height: 1.6;
                }
                .success-text {
                    color: #4ade80;
                    font-weight: 600;
                    margin: 20px 0;
                }
                .button {
                    display: inline-block;
                    margin-top: 25px;
                    padding: 12px 30px;
                    background-color: #31b8c6;
                    color: #0f172a;
                    text-decoration: none;
                    border-radius: 8px;
                    font-weight: 600;
                    transition: background-color 0.3s ease;
                }
                .button:hover {
                    background-color: #45c7d4;
                }
                .redirect-info {
                    color: #94a3b8;
                    font-size: 13px;
                    margin-top: 20px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="success-icon">✅</div>
                <h1>Email Verified Successfully!</h1>
                <p class="success-text">Your email has been verified.</p>
                <p>You can now log in to your account with your email and password.</p>
                <a href="http://localhost:5173/login" class="button">Go to Login</a>
                <p class="redirect-info">You will be redirected in 3 seconds...</p>
            </div>
            <script>
                setTimeout(function() {
                    window.location.href = "http://localhost:5173/login";
                }, 3000);
            </script>
        </body>
        </html>
        `;

        res.send(html);
    } catch (err) {
        console.error("❌ Email verification failed:", err.message);
        
        const errorHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verification Failed - Perplexity</title>
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .container {
                    max-width: 500px;
                    padding: 40px;
                    background: rgba(30, 41, 59, 0.8);
                    border: 1px solid rgba(239, 68, 68, 0.4);
                    border-radius: 12px;
                    text-align: center;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                    backdrop-filter: blur(10px);
                }
                .error-icon {
                    font-size: 60px;
                    margin-bottom: 20px;
                }
                h1 {
                    color: #ef4444;
                    margin: 0 0 15px 0;
                    font-size: 28px;
                }
                p {
                    color: #e2e8f0;
                    margin: 10px 0;
                    line-height: 1.6;
                }
                .button {
                    display: inline-block;
                    margin-top: 25px;
                    padding: 12px 30px;
                    background-color: #31b8c6;
                    color: #0f172a;
                    text-decoration: none;
                    border-radius: 8px;
                    font-weight: 600;
                    transition: background-color 0.3s ease;
                }
                .button:hover {
                    background-color: #45c7d4;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="error-icon">❌</div>
                <h1>Verification Failed</h1>
                <p>Invalid or expired verification link.</p>
                <p style="color: #94a3b8; font-size: 14px;">Your verification link may have expired. Please register again.</p>
                <a href="http://localhost:5173/register" class="button">Register Again</a>
            </div>
        </body>
        </html>
        `;
        
        return res.status(400).send(errorHtml);
    }
}


/**
 * @desc Create a test user for development
 * @route POST /api/auth/test-user
 * @access Public (Development only)
 */
export async function createTestUser(req, res) {
    try {
        // Delete existing test user if present
        await userModel.deleteOne({ email: "test@example.com" })

        // Create a new verified test user
        const testUser = await userModel.create({
            username: "testuser",
            email: "test@example.com",
            password: "Test@123",
            verified: true
        })

        res.status(201).json({
            message: "Test user created successfully",
            success: true,
            credentials: {
                email: "test@example.com",
                password: "Test@123"
            },
            user: {
                id: testUser._id,
                username: testUser.username,
                email: testUser.email
            }
        })
    } catch (error) {
        res.status(500).json({
            message: "Failed to create test user",
            success: false,
            err: error.message
        })
    }
}

/**
 * @desc Verify user by email (Development only)
 * @route POST /api/auth/verify-user
 * @access Public (Development only)
 * @body { email }
 */
export async function verifyUserByEmail(req, res) {
    try {
        const { email } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
                err: "User not found"
            })
        }

        user.verified = true;
        await user.save();

        res.status(200).json({
            message: "User verified successfully",
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                verified: user.verified
            }
        })
    } catch (error) {
        res.status(500).json({
            message: "Failed to verify user",
            success: false,
            err: error.message
        })
    }
}