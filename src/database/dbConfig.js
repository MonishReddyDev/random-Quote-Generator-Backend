import dotenv from 'dotenv'
dotenv.config()
import mongoose from "mongoose";
// import Quote from '../models/Quotes.model.js';
// import { quotes } from '../utils/quotes.js';


const monogurl = process.env.MONGO_DB_URL


const dbConnect = async () => {
    try {

        const connection = await mongoose.connect(monogurl, { dbName: "Quotes" })
        console.log("Database connnection successfull")


        // Add event listeners for different connection events
        mongoose.connection.on('connected', () => {
            console.log("Mongoose connected to DB");
        })

        mongoose.connection.on('error', (err) => {
            console.error("Mongoose connection error:", err);
        })

        mongoose.connection.on('disconnected', () => {
            console.log("Mongoose disconnected from DB");
        });

        mongoose.connection.on('reconnected', () => {
            console.log("Mongoose reconnected to DB");
        });

        // const result = await Quote.insertMany(quotes);
        // console.log("Quotes inserted:");

    } catch (error) {
        console.log("Error occured while connection to database")
    }
}


process.on('SIGINT', async () => {
    await mongoose.connection.close()
    console.log("Mongoose disconnected due to application termination");
    process.exit(0);
})


export default dbConnect