const sgMail = require('@sendgrid/mail');

// Set the SendGrid API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async ({ to, subject, html }) => {
    const msg = {
        to: to, // Can be ANY user registering/requesting OTP
        from: process.env.EMAIL_USER || 'itsmagmahere@gmail.com', // Must be your verified SendGrid Single Sender email
        subject: subject,
        html: html,
    };

    try {
        await sgMail.send(msg);
        return { success: true };
    } catch (error) {
        console.error("🔴 SENDGRID ERROR:", error.response ? error.response.body : error.message);
        throw error;
    }
};

module.exports = { sendEmail };