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
router.get('/notifications/count', checkUser, async (req, res, next) => {
    try {
        const count = await Notification.find({ owner: res.locals.user?._id }).count()
        return res.status(200).json({ count })
    } catch (error) {
        next(error)
    }
})
router.post('/notifications/read', checkUser, async (req, res, next) => {
    try {
        const notifications = await Notification.deleteMany({ owner: res.locals.user?._id })
        return res.status(200).json({ notifications })
    } catch (error) {
        next(error)
    }
})

module.exports = router