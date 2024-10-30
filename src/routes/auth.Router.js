import express from "express"

const router = express.Router()
import dotenv from 'dotenv';

import { logOut, login, reFetchUser, refreshToken, register } from "../controllers/authController.js"



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


//Fetch current user
router.get("/reFetch", reFetchUser);


export default router