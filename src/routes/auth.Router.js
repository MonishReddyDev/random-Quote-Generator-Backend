import express from "express"

const router = express.Router()
import dotenv from 'dotenv';

import { logOut, login, reFetchUser, register } from "../controllers/authController.js"



// Load environment variables from .env file
dotenv.config();

//Register

router.post("/register", register)


///Login

router.post("/login", login)


//Logout

router.get("/logout", logOut)



//Fetch current user
router.get("/reFetch", reFetchUser);


export default router