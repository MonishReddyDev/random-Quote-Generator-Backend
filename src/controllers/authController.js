import dotenv from 'dotenv'
dotenv.config()
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import User from "../models/User.model.js"
import { generateToken } from '../utils/helpers.js';
import Client from "../redis/redisClient.js"
import createError from 'http-errors';
import authSchem from "../helpers/validation_schema.js"
import signAccessToken, { signRefreshToken, verifyRefreshToken } from "../helpers/jwt_helper.js"
import redisClient from '../redis/redisClient.js';


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

// export const register = async (req, res) => {
//     try {

//         const { username, password, email } = req.body

//         const existingUser = await User.findOne({
//             $or: [{ username }, { email }]
//         })

//         if (existingUser)
//             return res.status(400).json({ message: "User already exists!" });

//         const hashedPassword = await hashPassword(password)

//         // Create new user
//         const newUser = new User({ ...req.body, password: hashedPassword });
//         await newUser.save();

//         res.status(201).json({ message: "User registered successfully", newUser });


//     } catch (error) {
//         console.error("Registration error: ", error);
//         res.status(500).json({ message: "Internal server error", error });

//     }

// }

// export const login = async (req, res) => {
//     try {
//         const { email, username, password } = req.body

//         const user = await User.findOne({
//             $and: [{ email }, { username }]
//         })

//         if (!user)
//             return res.status(404).json({ message: "User not found!" });

//         //compare the password
//         const isMatch = await bcrypt.compare(password, user.password)

//         if (!isMatch)
//             return res.status(401).json({ message: "Invalid credentials!" });

//         // Generate JWT and send response
//         const token = await generateToken(user._id)


//         const { password: pwd, ...userData } = user._doc

//         // const existingSession = await Client.hget(`user:${user._id}`, 'loggedIn');
//         // if (existingSession) {
//         //     return res.status(400).json({ message: "User already logged in!" });
//         // }

//         // Store the user session in Redis
//         await Client.hset(`user:${user._id}`, 'email', user.email, 'loggedIn', true);

//         console.log(email, 'Logged in', "id", user._id)
//         res.cookie("token", token, { httpOnly: true, secure: true }).status(200).json(userData);

//     } catch (error) {

//         console.error("Login error: ", error);
//         res.status(500).json({ message: "Internal server error", error });

//     }

// }


export const login = async (req, res, next) => {
    try {

        const result = await authSchem.validateAsync(req.body)
        const { username, password, email } = result

        const user = await User.findOne({
            $and: [{ email }, { username }]
        })


        if (!user) throw createError.NotFound("User not Registered!!")

        const isMatch = await user.isValidpassword(password)

        if (!isMatch) throw createError.Unauthorized("Invalid credentials!")

        await Client.hset(`user:${user._id}`, 'email', user.email, 'loggedIn', true);

        const accessToken = await signAccessToken(user.id)
        const refreshToken = await signRefreshToken(user.id)

        res.send({ accessToken, refreshToken })
    } catch (error) {
        if (error.isJoi === true) return next(createError.BadRequest("Invalid username/password"))
        next(error)

    }
}


export const refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body

        if (!refreshToken) throw createError.BadRequest()

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
        const { refreshToken } = req.body

        if (!refreshToken) throw createError.BadRequest()

        const userId = await verifyRefreshToken(refreshToken)
        console.log(userId)
        await Client.del(`user:${userId}`);

        redisClient.del(userId, (err, val) => {
            if (err) {
                console.log(err.message)
                throw createError.InternalServerError()
            }
            console.log(val)
            res.send(204)
        })


    } catch (error) {
        console.error("Logout error: ", error);
        res.status(500).json({ message: "Internal server error", error });
    }
}

export const reFetchUser = async (req, res) => {
    try {
        console.log(req.cookies.token)
        const token = req.cookies.token
        if (!token) return res.status(401).json({ message: "Unauthorized" });

        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            //if Invalid token
            if (err) return res.status(401).json({ message: "Invalid token", error: err });
            //when user found
            const user = await User.findById(decoded._id)
            //user not found
            console.log(user)
            if (!user) return res.status(404).json({ message: "User not found" });
            //response
            res.status(200).json(user)

        })
    } catch (error) {
        console.error("Re-fetch error: ", error);
        res.status(500).json({ message: "Internal server error", error });

    }
}