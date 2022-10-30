const router = require('express').Router()

const { transporter } = require('./../utils/mail')
const BaseError = require('./../utils/BaseError')

router.post('/contact', async (req, res, next) => {
    try {
        const { email, name, message } = req.body
        if (!email || !message) throw new BaseError(400, 'Email and message must be provided')
        transporter.sendMail({
            from: process.env.MAIL_USER,
            to: "parmarparth996@gmail.com",
            subject: 'Contact Mail',
            text: `<${email}> \n${name} \n${message}`,
        }, (err) => {
            if (err) throw err
            console.log('das');
        })
        return res.status(200)
    } catch (error) {
        next(error)
    }
})

module.exports = router