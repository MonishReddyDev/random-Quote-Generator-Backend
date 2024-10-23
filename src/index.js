import dotenv from 'dotenv'
dotenv.config()
import express from "express";
import dbConnect from './database/dbConfig.js';
import cookieParser from 'cookie-parser';
import authrouter from "./routes/auth.Router.js"


const app = express();
const port = process.env.PORT || 4000
app.use(express.json());
app.use(cookieParser())



//connect to database
dbConnect()





app.use("/api/auth", authrouter)


app.use("/", (req, res) => {
    res.send("Hello World form monish")
})


app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})