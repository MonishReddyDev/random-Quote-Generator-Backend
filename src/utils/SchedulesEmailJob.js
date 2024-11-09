import { scheduleJob } from 'node-schedule';
import mongoose from 'mongoose';
import Quote from '../models/Quotes.model.js';
import User from '../models/User.model.js';
import sendQuoteEmail from './email.js';

// Function to schedule email sending process
export const scheduleEmails = async () => {


    scheduleJob('*/2 * * * *', async () => {
        try {
            // Fetch all users who are logged in
            const users = await User.find({ isLoggedIn: true }).select('email').lean();

            if (users.length != 0) {

                console.log('Starting email sending process...');

                // Fetch random quotes in parallel for all users
                const emailPromises = users.map(async (user) => {
                    const { email } = user;

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
                        console.log('No quote found to send.');
                    }
                });

                // Wait for all emails to be sent
                await Promise.all(emailPromises);

                console.log('Email sending process completed.');

            } else {
                console.log('No Users loggedin');
                return
            }

        } catch (error) {
            console.error('Error processing users:', error);
        }
    });
};


// // Lambda handler to invoke the scheduled job
// export const handler = async () => {
//     await scheduleEmails(); // Invoke the scheduled job logic
// };
