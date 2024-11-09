import dotenv from 'dotenv'
dotenv.config()
import express from "express";
import dbConnect from './database/dbConfig.js';
import cookieParser from 'cookie-parser';
import authRouter from "./routes/auth.Router.js"
import quoteRouter from "./routes/quotesGenerator.route.js"
import { scheduleEmails } from "./utils/SchedulesEmailJob.js"
import createError from 'http-errors';
import morgan from 'morgan';
import { verifAccessToken } from './helpers/jwt_helper.js';
// import serverless from 'serverless-http';



const app = express();
app.use(morgan('dev'))
const port = process.env.PORT || 4000
app.use(express.json());
app.use(cookieParser())


//connect to database
dbConnect()

await scheduleEmails()

app.get("/", async (req, res, next) => {
    res.send("Hello World form monish")
    next()
})

app.use("/api/v1/auth", authRouter); // For authentication (login, register, etc.)
app.use("/api/v1/quotes", quoteRouter); // For quote-related endpoints (CRUD operations on quotes)


app.use(async (req, res, next) => {
    // const error = new Error("not found")
    // error.status = 404
    // next(error)
    next(createError.NotFound())
})

//error handler
app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.send({
        error: {
            status: err.status || 500,
            message: err.message
        }
    })
})


app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})



// // Wrap Express app with serverless-http
// export const handler = serverless(app);