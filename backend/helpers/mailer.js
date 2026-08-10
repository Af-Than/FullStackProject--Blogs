const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'itsmagmahere@gmail.com', // Sender email address
        pass: process.env.EMAIL_PASS                             // App Password from Google
    },
    tls: {
        rejectUnauthorized: false // Prevents SSL certificate chain errors
    }
});

module.exports = transporter;