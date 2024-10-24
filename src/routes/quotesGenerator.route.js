import express from "express"
import quoteGenerator from "../controllers/quoteGenerator.Controller.js"
import authmiddleware from "../middlewares/auth.js"


const router = express.Router()


router.get("/", authmiddleware, quoteGenerator)

export default router