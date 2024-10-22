import dotenv from 'dotenv'
dotenv.config()
import mongoose from "mongoose";
import Quote from '../models/Quotes.model.js';
import { quotes } from '../utils/quotes.js';


const monogurl = process.env.MONGO_DB_URL


const dbConnect = async () => {
    try {
        const connection = await mongoose.connect(monogurl)
        console.log("Database connnection successfull")
        // const result = await Quote.insertMany(quotes);
        // console.log("Quotes inserted:");
    } catch (error) {
        console.log("Error occured while connection to database")
    }
}


export default dbConnect