const router = require('express').Router()
const Notification = require('../models/Notification')

const checkUser = require('./../middlewares/checkUser')


router.get('/notifications', checkUser, async (req, res, next) => {
    try {
        const notifications = await Notification.find({ owner: res.locals.user?._id }).sort({ createdAt: -1 })
        return res.status(200).json({ notifications })
    } catch (error) {
        next(error)
    }
})
router.post('/notifications/read', checkUser, async (req, res, next) => {
    try {
        const notifications = await Notification.updateMany({ owner: res.locals.user?._id }, { $set: { unread: false } })
        return res.status(200).json({ notifications })
    } catch (error) {
        next(error)
    }
})

module.exports = router