import jwt from 'jsonwebtoken';
import createError from 'http-errors'; // Ensure this is imported

const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET; // The secret used for verifying the access token

const authMiddleware = async (req, res, next) => {
    // Get the token from the 'Authorization' header (Bearer <token>)
    const token = req.headers['authorization']?.split(' ')[1]; // Extract token from Authorization header

    if (token) {
        try {
            // Ensure the secret is defined for verification
            if (!JWT_SECRET) {
                return res.status(500).json({ message: "Internal server error: JWT secret not defined." });
            }

            // Verify the JWT token using the secret
            const decoded = jwt.verify(token, JWT_SECRET);

            // Attach the decoded user info to the request (you can add more user data if needed)
            req.user = decoded;

            // Proceed to the next middleware or route handler
            next();
        } catch (error) {
            console.error("JWT verification error: ", error);

            // Handle token verification errors
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token expired. Please log in again.' });
            }
            return res.status(401).json({ message: 'Invalid token. Please log in again.' });
        }
    } else {
        // If no token is provided, return an unauthorized error
        return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }
};

export default authMiddleware;
