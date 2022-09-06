const router = require('express').Router()

const checkUser = require('../middlewares/checkUser')
const Converstion = require('../models/Converstion')
const Message = require('../models/Message')
const BaseError = require('../utils/BaseError')

router.post('/converstion/create', checkUser, async (req, res, next) => {
    try {
        const isExist = await Converstion.find({
            users: [
                res.locals.user._id,
                ...req.body.users
            ]
        })
        if (isExist.length) throw new BaseError()
        const converstion = new Converstion({
            users: [
                res.locals.user._id,
                ...req.body.users
            ]
        })
        await converstion.save()
        return res.json({ converstion })
    } catch (error) {
        next(error)
    }
})
router.post('/converstion/:id/message', checkUser, async (req, res, next) => {
    try {
        const converstion = await Converstion.findById(req.params.id)
        if (!converstion) throw new BaseError()
        const message = new Message({
            converstion: req.params.id,
            sender: res.locals.user._id,
            message: req.body.message
        })
        await message.save()
        converstion.users.forEach(user => {
            if (user != res.locals.user._id) {
                console.log(global.users[user]);
                global.users[user]?.emit('message', message)
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
        const messages = await Message.find({ converstion: req.params.id })
        const converstion = await Converstion.findById(req.params.id).populate('users', 'username avatar')
        return res.json({ messages, converstion })
    } catch (error) {
        next(error)
    }
})

module.exports = router