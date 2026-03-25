import jwt from "jsonwebtoken";




export function authUser(req, res, next) {
    // Try to get token from cookies first
    let token = req.cookies.token;
    
    console.log("🔐 AUTH MIDDLEWARE:");
    console.log("   Cookie token:", token ? "EXISTS" : "NOT FOUND");

    // If not in cookies, try Authorization header
    if (!token) {
        const authHeader = req.headers.authorization;
        console.log("   Auth header:", authHeader ? authHeader.substring(0, 30) + "..." : "NOT FOUND");
        
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.slice(7); // Remove 'Bearer ' prefix
            console.log("   Extracted token from header");
        }
    }

    if (!token) {
        console.log("   ❌ NO TOKEN FOUND - returning 401");
        return res.status(401).json({
            message: "Unauthorized",
            success: false,
            err: "No token provided"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("   ✅ Token verified:", decoded);
        req.user = decoded;
        next();
    } catch (err) {
        console.log("   ❌ Token verification failed:", err.message);
        return res.status(401).json({
            message: "Unauthorized",
            success: false,
            err: "Invalid token"
        })
    }
}

