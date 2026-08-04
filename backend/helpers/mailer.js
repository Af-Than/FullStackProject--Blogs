// helpers/mailer.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'itsmagmahere@gmail.com',       // Your app's Gmail address
        pass: 'qqei gaub maaa fuyy' // App Password generated from Google Account
    },
    tls: {
        rejectUnauthorized: false // 👈 Fixes "self-signed certificate in certificate chain"
    }
});

module.exports = transporter;