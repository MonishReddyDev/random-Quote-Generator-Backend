import express from "express"
import quoteGenerator from "../controllers/quoteGenerator.Controller.js"

const router = express.Router()


router.get("/", quoteGenerator)

export default router