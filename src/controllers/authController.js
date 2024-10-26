import dotenv from 'dotenv'
dotenv.config()
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import User from "../models/User.model.js"
import { generateToken, hashPassword } from '../utils/helpers.js';
import Client from "../redis/redisClient.js"

export const register = async (req, res) => {
    try {

        const { username, password, email } = req.body

        const existingUser = await User.findOne({
            $or: [{ username }, { email }]
        })

        if (existingUser)
            return res.status(400).json({ message: "User already exists!" });

        const hashedPassword = await hashPassword(password)

        // Create new user
        const newUser = new User({ ...req.body, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully", newUser });


    } catch (error) {
        console.error("Registration error: ", error);
        res.status(500).json({ message: "Internal server error", error });

    }

}

export const login = async (req, res) => {
    try {
        const { email, username, password } = req.body

        const user = await User.findOne({
            $and: [{ email }, { username }]
        })

        if (!user)
            return res.status(404).json({ message: "User not found!" });

        //compare the password
        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch)
            return res.status(401).json({ message: "Invalid credentials!" });

        // Generate JWT and send response
        const token = await generateToken(user._id)

        const { password: pwd, ...userData } = user._doc

        // Store the user session in Redis
        await Client.hset(`user:${user._id}`, 'email', user.email, 'loggedIn', true);

        console.log(email, 'Logged in')
        res.cookie("token", token, { httpOnly: true, secure: true }).status(200).json(userData);

    } catch (error) {

        console.error("Login error: ", error);
        res.status(500).json({ message: "Internal server error", error });

    }

}

export const logOut = async (req, res) => {
    try {
        // Check if the token cookie exists
        if (!req.cookies.token) {
            return res.status(400).json({ message: "User is already logged out" });
        }

        const token = req.cookies.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Remove the user session from Redis

        await Client.del(`user:${decoded._id}`);


        res.clearCookie("token", { sameSite: "none", secure: true })
            .status(200)
            .json({ message: "User logged out successfully" });
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