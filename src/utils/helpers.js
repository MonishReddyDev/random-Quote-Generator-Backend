
import jwt from "jsonwebtoken";

export const generateToken = async (userId) => {
    return jwt.sign({ _id: userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION })
}

