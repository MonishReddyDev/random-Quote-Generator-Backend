import dotenv from 'dotenv'
dotenv.config()

import User from "../models/User.model.js"
import createError from 'http-errors';
import authSchem from "../helpers/validation_schema.js"
import signAccessToken, { signRefreshToken, verifyRefreshToken } from "../helpers/jwt_helper.js"
import Token from "../models/tokenSchema.model.js"



export const register = async (req, res, next) => {

    try {

        const result = await authSchem.validateAsync(req.body)

        const { username, password, email } = result

        const existingUser = await User.findOne({
            $or: [{ username }, { email }]
        })

        if (existingUser) throw createError.Conflict(`User already exists!`)

        const newUser = new User({ ...result });
        const savedUser = await newUser.save();
        const accessToken = await signAccessToken(savedUser.id)
        const refreshToken = await signRefreshToken(savedUser.id)

        res.status(201).json({ message: "User registered successfully", accessToken, refreshToken });

    } catch (error) {
        if (error.isJoi === true) error.status = 422
        next(error)

    }
}

export const login = async (req, res, next) => {
    try {

        const result = await authSchem.validateAsync(req.body)
        const { username, password, email, } = result

        const user = await User.findOne({
            $and: [{ email }, { username }]
        })
        if (!user) throw createError.NotFound("User not Registered!!")

        const isMatch = await user.isValidpassword(password)

        if (!isMatch) throw createError.Unauthorized("Invalid credentials!")


        user.isLoggedIn = true;
        user.lastLogin = new Date();
        await user.save();

        // await Client.hset(`user:${user._id}`, 'email', user.email, 'loggedIn', true);

        const accessToken = await signAccessToken(user.id)
        const refreshToken = await signRefreshToken(user.id)

        // Save the refresh token in the database
        const existingToken = await Token.findOne({ userId: user.id });
        if (existingToken) {
            // If a token exists, update it
            existingToken.refreshToken = refreshToken
        } else {
            // If no token exists for the user, create a new one
            const newToken = new Token({
                userId: user.id,
                refreshToken,
            });
            await newToken.save();
        }

        // Send access and refresh tokens in the response
        res.send({ accessToken, refreshToken });

    } catch (error) {
        if (error.isJoi === true) return next(createError.BadRequest("Invalid username/password"))
        next(error)

    }
}

export const refreshToken = async (req, res, next) => {
    try {

        const { refreshToken } = req.body

        if (!refreshToken) throw createError.BadRequest('No refresh token provided');

        const userId = await verifyRefreshToken(refreshToken)


        const accessToken = await signAccessToken(userId)
        const newrefToken = await signRefreshToken(userId)


        res.send({ accessToken, newrefToken })
    } catch (error) {

        next(error)
    }

}


export const logOut = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) return res.status(400).json({ message: "No refresh token provided" });

        const userId = await verifyRefreshToken(refreshToken);

        // Delete the refresh token and check if successful
        const deletedToken = await Token.deleteOne({ userId });

        if (deletedToken.deletedCount === 0) {
            return res.status(404).json({ message: "Token not found" });
        }

        // Find and update the user in parallel
        const user = await User.findByIdAndUpdate(userId, { isLoggedIn: false }, { new: true });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(204).send("User logged out successfully");

    } catch (error) {
        console.error("Logout error: ", error);
        res.status(500).json({ message: "Internal server error", error });
    }
};

