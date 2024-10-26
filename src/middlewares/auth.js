import dotenv from 'dotenv'
dotenv.config()
import jwt from "jsonwebtoken";


const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = async (req, res, next) => {
    const { token } = req.cookies;

    if (token) {
        try {
            // Ensure JWT_SECRET is defined
            if (!JWT_SECRET) {
                return res.status(500).json({ message: "Internal server error: JWT secret not defined." });
            }

            const decoded = jwt.verify(token, JWT_SECRET);

            req.user = decoded; // Attach the decoded user info to the request

            next(); // Proceed to the next middleware or route handler
        } catch (error) {
            console.error("JWT verification error: ", error);
            return res.status(401).json({ message: 'Invalid token. Please log in again.' });
        }
    } else {
        return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }
};

export default authMiddleware;
