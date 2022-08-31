const Notification = require('./../models/Notification')

async function sendNotification(owner, body) {
    const notification = new Notification({
        owner,
        body
    })
    await notification.save()
}
module.exports = { sendNotification }