import express from "express"

const router = express.Router()
import dotenv from 'dotenv';

import { logOut, login, register, refreshToken } from "../controllers/authController.js"
import authMiddleware from "../middlewares/auth.js";



// Load environment variables from .env file
dotenv.config();

//Register

router.post("/register", register)


///Login

router.post("/login", login)


//Logout

router.get("/logout", logOut)



//refreshToken
router.post('/refresh-token', refreshToken)



export default router