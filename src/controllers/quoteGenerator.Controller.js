import Quote from "../models/Quotes.model.js"


const quoteGenerator = async (req, res) => {

    try {

        const { email } = req.body

        const radomQuote = await Quote.aggregate([{ $sample: { size: 1 } }])

        if (!radomQuote || radomQuote.length === 0) {
            return res.status(404).json({ message: "No quotes found." });
        }

        const { quote, author } = radomQuote[0]

        res.status(200).json({ quote, author });

        // After sending the response, queue the email task asynchronously
        // await emailQueue.add({ email, quote, author });

    } catch (error) {
        console.error("Error fetching quotes: ", error);
        res.status(500).json({ message: "Internal server error", error });
    }

}

export default quoteGenerator