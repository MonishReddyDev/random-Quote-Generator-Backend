import dotenv from 'dotenv'
dotenv.config()
import express from "express";
import dbConnect from './database/dbConfig.js';

const app = express();
const port = process.env.PORT || 4000
app.use(express.json());

//connect to database
dbConnect()


app.use("/", (req, res) => {
    res.send("Hello World form monish")
})



app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})