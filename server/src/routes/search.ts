const router = require('express').Router()
const User = require('../models/User')
const Post = require('../models/Post')

const optionalAuth = require('./../middlewares/optionalAuth')


router.get('/user', optionalAuth, async (req, res, next) => {
    try {
        const query = req.query.search
        const results = await User.find({ $or: [{ username: { $regex: query, $options: 'i' } }, { name: { $regex: query, $options: 'i' } }] }).select('-password -verified')
        return res.status(200).json({ results })
    } catch (error) {
        next(error)
    }
})
router.get('/post', optionalAuth, async (req, res, next) => {
    try {
        const query = req.query.search
        const results = await Post.find({ body: { $regex: query, $options: 'i' } })
        return res.status(200).json({ results })
    } catch (error) {
        next(error)
    }
})
module.exports = router