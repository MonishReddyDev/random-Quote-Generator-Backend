import { scheduleJob } from 'node-schedule';
import Quote from '../models/Quotes.model.js';
import sendQuoteEmail from './email.js';
import User from '../models/User.model.js';

const scheduleEmails = async () => {

    scheduleJob('*/2 * * * *', async () => {
        try {
            console.log("Starting email sending process...");
            const users = await User.find({ isLoggedIn: true }).select('email');

            // Fetch random quotes in parallel for all users
            const emailPromises = users.map(async (user) => {

                const { email } = user
                // Fetch a random quote
                const randomQuote = await Quote.aggregate([{ $sample: { size: 1 } }]);
                // If a random quote is found, send the email
                if (randomQuote.length > 0) {
                    const { quote, author } = randomQuote[0];
                    const emailSent = await sendQuoteEmail(email, `${quote} - ${author}`);

                    if (emailSent) {
                        console.log(`Email sent to ${email}`);
                    } else {
                        console.log(`Failed to send email to ${email}`);
                    }
                } else {
                    console.log("No quote found to send.");
                }

            })

            // Wait for all emails to be sent
            await Promise.all(emailPromises);

            console.log("Email sending process completed.");


        } catch (error) {

            console.error("Error processing users:", error);
        }


    });
};

export default scheduleEmails;
