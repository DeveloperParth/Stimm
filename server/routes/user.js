const router = require('express').Router()
const User = require('./../models/User')
const checkUser = require('./../middlewares/checkUser')
const BaseError = require('./../utils/BaseError')
const Follow = require('../models/Follow')

router.get('/profile', checkUser, async (req, res, next) => {
    try {
        const user = await User.findById(res.locals.user._id)
        const { password, ...rest } = user._doc
        return res.status(200).json({ user: rest })
    } catch (error) {
        next(error)
    }
})
router.get('/:username', async (req, res, next) => {
    try {
        const user = await User.findOne({username: req.params.username})
        if(!user) throw new BaseError(404, 'User not found')
        const { password, ...rest } = user._doc
        return res.status(200).json({ user: rest })
    } catch (error) {
        next(error)
    }
})
router.post('/:id/follow', checkUser, async (req, res, next) => {
    try {
        if (res.locals.user._id === req.params.id) throw new BaseError(400, 'cant follow self')
        const user = await User.findById(req.params.id)
        if (!user) throw new BaseError(404, 'User not found')
        const alreadyFollow = await Follow.findOne({
            follower: res.locals.user._id,
            user
        })
        if (alreadyFollow) throw new BaseError(400, 'Already followed')
        const newFollow = new Follow({
            follower: res.locals.user._id,
            user
        })
        await newFollow.save()
        return res.status(200).json({ message: 'Followed' })
    } catch (error) {
        next(error)
    }
})
router.post('/:id/unfollow', checkUser, async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user) throw new BaseError(404, 'User not found')
        const alreadyFollow = await Follow.findOne({
            follower: res.locals.user._id,
            user
        })
        if (!alreadyFollow) throw new BaseError(400, 'Not followed')
        await Follow.findOneAndDelete({
            follower: res.locals.user._id,
            user
        })
        return res.status(200).json({ message: 'Unfollowed' })
    } catch (error) {
        next(error)
    }
})
router.get('/all', checkUser, async (req, res, next) => {
    try {
        const users = await User.find({})
        return res.json({ users })
    } catch (error) {
        next(error)
    }
})

module.exports = router