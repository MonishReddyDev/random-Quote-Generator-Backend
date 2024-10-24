import nodemailer from 'nodemailer';


const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: '465',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
})


const sendQuoteEmail = (to, quote) => {
    const mailOptions = {
        form: process.env.EMAIL_USER,
        to,
        subject: 'Your Daily Quote',
        text: quote,
    }

    return transporter.sendMail(mailOptions)

}


export default sendQuoteEmail