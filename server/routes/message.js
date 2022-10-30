const router = require('express').Router()

const checkUser = require('../middlewares/checkUser')
const Converstion = require('../models/Converstion')
const User = require('../models/User')
const Message = require('../models/Message')
const BaseError = require('../utils/BaseError')
const { sendNotification } = require('../utils/SendNotification')

router.post('/converstion/create', checkUser, async (req, res, next) => {
    try {
        const user = await User.findById(res.locals.user._id)
        const isExist = await Converstion.find({
            users: [
                res.locals.user._id,
                ...req.body.users
            ]
        })
        if (req.body.users.length === 1 && isExist.length) throw new BaseError()
        const converstion = await new Converstion({
            users: [
                res.locals.user._id,
                ...req.body.users
            ]
        }).populate('users', '-password -banned')
        await converstion.save()
        const message = `@${user.username} ${converstion.users.length > 2 ? 'created a group and added you' : 'messaged you'}`
        req.body.users.forEach(user => sendNotification(user._id, message))
        return res.json({ converstion })
    } catch (error) {
        next(error)
    }
})
router.post('/converstion/:id/message', checkUser, async (req, res, next) => {
    try {
        const converstion = await Converstion.findById(req.params.id)
        if (!converstion) throw new BaseError()
        const sender = await User.findById(res.locals.user._id).select('avatar username')
        const message = new Message({
            converstion: req.params.id,
            sender: res.locals.user._id,
            message: req.body.message
        })
        await message.save()
        converstion.users.forEach(user => {
            if (user != res.locals.user._id) {
                global.users[user]?.emit('message', { ...message._doc, sender: { ...sender._doc } })
            }
        })
        return res.json({ message })
    } catch (error) {
        next(error)
    }
})
router.get('/converstion/all', checkUser, async (req, res, next) => {
    try {
        const converstions = await Converstion.find({ users: res.locals.user._id }).populate('users', 'username avatar')
        return res.json({ converstions })
    } catch (error) {
        next(error)
    }
})
router.get('/converstion/:id/messages', checkUser, async (req, res, next) => {
    try {
        const messages = await Message.find({ converstion: req.params.id }).populate('sender', 'username avatar')
        const converstion = await Converstion.findById(req.params.id).populate('users', 'username avatar')
        return res.json({ messages, converstion })
    } catch (error) {
        next(error)
    }
})

module.exports = router