import dotenv from 'dotenv'
dotenv.config()
import express from "express";
import dbConnect from './database/dbConfig.js';
import cookieParser from 'cookie-parser';
import authRouter from "./routes/auth.Router.js"
import quoteRouter from "./routes/quotesGenerator.route.js"




const app = express();
const port = process.env.PORT || 4000
app.use(express.json());
app.use(cookieParser())



//connect to database
dbConnect()

app.use("/api/v1/auth", authRouter); // For authentication (login, register, etc.)
app.use("/api/v1/quotes", quoteRouter); // For quote-related endpoints (CRUD operations on quotes)


app.use("/", (req, res) => {
    res.send("Hello World form monish")
})


app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})