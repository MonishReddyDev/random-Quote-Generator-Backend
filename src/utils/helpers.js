import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
export const generateToken = async (userId) => {
    return jwt.sign({ _id: userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION })
}
export const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt)

}

