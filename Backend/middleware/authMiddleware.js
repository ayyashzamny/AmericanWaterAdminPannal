const jwt = require("jsonwebtoken");

// Middleware to verify JWT tokens
const verifyToken = (req, res, next) => {
    // Extract token from the "Authorization" header
    const authHeader = req.header("Authorization");
    if (!authHeader) {
        return res.status(401).json({ message: "Access Denied: No token provided" });
    }

    // Split 'Bearer <token>' and extract the actual token
    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Access Denied: Invalid token format" });
    }

    try {
        // Verify the token using JWT secret
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret");

        // Token expiry check (optional - in case server wants to validate explicitly)
        const isTokenExpired = decoded.exp * 1000 < Date.now();
        if (isTokenExpired) {
            return res.status(401).json({ message: "Access Denied: Token has expired" });
        }

        // Attach the decoded payload to the request object
        req.user = decoded;
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error("Token verification failed:", error.message);
        return res.status(401).json({ message: "Invalid Token" });
    }
};

module.exports = verifyToken;
