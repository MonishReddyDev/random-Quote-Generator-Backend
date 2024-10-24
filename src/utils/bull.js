import Queue from 'bull';
import sendQuoteEmail from "../utils/email.js";

const emailQueue = new Queue('emailQueue');

emailQueue.process(async (job) => {
    const { email, quote, author } = job.data;
    try {
        await sendQuoteEmail(email, `${quote} - ${author}`);
        console.log(`Email sent to ${email} with quote: "${quote}" - ${author}`);

    } catch (error) {
        console.error(`Error sending email to ${email}: `, error);
        throw error;
    }

});

export default emailQueue