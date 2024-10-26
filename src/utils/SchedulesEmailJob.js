import { scheduleJob } from 'node-schedule';
import Client from "../redis/redisClient.js";
import Quote from '../models/Quotes.model.js';
import sendQuoteEmail from './email.js';

const scheduleEmails = async () => {
    scheduleJob('*/2 * * * *', async () => {
        console.log("Starting email sending process...");

        const keys = await Client.keys('user:*');
        console.log(`Found users: ${keys}`);

        for (const key of keys) {

            try {

                const userData = await Client.hgetall(key);
                const email = userData.email;
                const loggedIn = userData.loggedIn; // Adjust as necessary

                // Proceed only if the user is logged in
                if (loggedIn === 'true') {
                    // Fetch a random quote
                    const randomQuote = await Quote.aggregate([{ $sample: { size: 1 } }]);

                    // Send email
                    if (randomQuote.length > 0) {
                        const { quote, author } = randomQuote[0];
                        await sendQuoteEmail(email, `${quote} - ${author}`);
                        console.log(`Email sent to ${email}`);
                    } else {
                        console.log("No quote found to send.");
                    }
                } else {
                    console.log(`Skipping email for ${email} (key: ${key}): user not logged in.`);
                }
            } catch (error) {
                console.error(`Error processing key ${key}:`, error);
            }
        }

        console.log("Email sending process completed.");
    });
};

export default scheduleEmails;
