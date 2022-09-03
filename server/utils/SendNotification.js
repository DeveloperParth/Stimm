const Notification = require('./../models/Notification')

async function sendNotification(owner, body) {
    const notification = new Notification({
        owner,
        body
    })
    // await notification.save()
    global.users[owner]?.emit('notification', body)
}
module.exports = { sendNotification }