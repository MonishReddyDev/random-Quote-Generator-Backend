import express from "express"
import quoteGenerator from "../controllers/quoteGenerator.Controller.js"
import authMiddleware from "../middlewares/auth.js"

const router = express.Router()


router.get("/", authMiddleware, quoteGenerator)


export default router