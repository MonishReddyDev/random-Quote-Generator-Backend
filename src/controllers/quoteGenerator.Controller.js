import Quote from "../models/Quotes.model.js"

const quoteGenerator = async (req, res) => {

    try {
        const quotes = await Quote.find({})

        if (quotes.length === 0) {
            return res.status(404).json({ message: "No quotes found." });
        }

        const randomIndex = Math.floor(Math.random() * quotes.length)
        const { quote, author } = quotes[randomIndex]
        res.status(200).json({ quote, author });

    } catch (error) {
        console.error("Error fetching quotes: ", error);
        res.status(500).json({ message: "Internal server error", error });
    }

}

export default quoteGenerator