const router = require('express').Router()
const BaseError = require('./../utils/BaseError')

const User = require('./../models/User')
const Report = require('./../models/Report')
const Post = require('../models/Post')
const Comment = require('../models/Comment')
const Like = require('../models/Like')

router.get('/stats', async (req, res, next) => {
    try {
        const totalUsers = await User.find().count()
        const totalPosts = await Post.find().count()
        const totalComments = await Comment.find().count()
        const totalLikes = await Like.find().count()

        const newUsers = await User.find({ createdAt: { $gt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } }).count()
        const newPosts = await Post.find({ createdAt: { $gt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } }).count()
        const newComments = await Comment.find({ createdAt: { $gt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } }).count()
        const newLikes = await Like.find({ createdAt: { $gt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } }).count()
        return res.status(200).json({ stats: { totalUsers, totalComments, totalPosts, totalLikes, newUsers, newComments, newPosts, newLikes } })
    } catch (error) {
        next(error)
    }
})

router.get('/reports', async (req, res, next) => {
    try {
        const reports = await Report.find().populate('reportedBy', '-password')
        return res.status(200).json({ reports })
    } catch (error) {
        next(error)
    }
})
router.delete('/post/:id', async (req, res, next) => {
    try {
        await Post.findByIdAndDelete(req.params.id)
        await Report.deleteMany({ contentId: req.params.id, model_type: 'Post' })
        return res.status(200).json({ message: 'Post deleted' })
    } catch (error) {
        next(error)
    }
})
router.delete('/comment/:id', async (req, res, next) => {
    try {
        await Comment.findByIdAndDelete(req.params.id)
        return res.status(200).json({ message: 'Comment deleted' })
    } catch (error) {
        next(error)
    }
})
router.post('/user/:id/ban', async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id)
        user.banned = true
        await user.save()
        return res.status(200).json({ message: 'User banned' })
    } catch (error) {
        next(error)
    }
})
router.post('/user/:id/unban', async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id)
        user.banned = false
        await user.save()
        return res.status(200).json({ message: 'User unbanned' })
    } catch (error) {
        next(error)
    }
})
router.get('/users', async (req, res, next) => {
    try {
        const users = await User.find({}, '-password')
        return res.status(200).json({ users })
    } catch (error) {
        next(error)
    }
})

module.exports = router