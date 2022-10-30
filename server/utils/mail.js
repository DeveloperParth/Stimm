const nodemailer = require('nodemailer')
var transporter = nodemailer.createTransport({
    host: "smtp.zoho.in",
    port: 465,
    secure: true,

    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    }

});
function sendAccountVerificationMail(email, link) {
    transporter.sendMail({
        from: process.env.MAIL_USER,
        to: email,
        subject: 'Email verification',
        html: `<a href=${link}>Verify your account</a>`
    }, (error, info) => {
        if (error) {
            throw error
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    })
}
function sendPasswordResetMail(email, link) {
    transporter.sendMail({
        from: process.env.MAIL_USER,
        to: email,
        subject: 'Change password',
        html: `<a href=${link}>Change your password</a>`
    }, (error, info) => {
        if (error) {
            throw error
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    })
}
module.exports = { transporter, sendAccountVerificationMail, sendPasswordResetMail }