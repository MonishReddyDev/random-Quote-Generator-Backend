import mongoose from "mongoose";

const quoteSchema = mongoose.Schema({
    quote: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
},
    { timestamps: true })


const Quote = mongoose.model("Quote", quoteSchema)
export default Quote