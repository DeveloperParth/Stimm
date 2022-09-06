const router = require('express').Router()
const optionalAuth = require('../middlewares/optionalAuth')
const checkUser = require('./../middlewares/checkUser')
const Post = require('../models/Post')
const Comment = require('../models/Comment')
const { sendNotification } = require('../utils/SendNotification')
const BaseError = require('./../utils/BaseError')


router.post('/post/:id/comment', checkUser, async (req, res, next) => {
    try {
        const { body, parent } = req.body
        const post = await Post.findById(req.params.id)
        if (parent) {
            const pComment = await Comment.findById(parent)
            sendNotification(pComment.author, `${res.locals.user.username} replied to your commnet`)
        }
        const newComment = new Comment({
            author: res.locals.user._id,
            post: post._id,
            body,
            parent
        })
        const comment = await newComment.save()
        sendNotification(post.author, `${res.locals.user.username} replied to your post`)
        return res.status(200).json({ comment })
    } catch (error) {
        next(error)
    }
})
router.get('/post/:id/comments', optionalAuth, async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id)
        console.log(req.params.id);
        if (!post) throw new BaseError(404, 'No post found')
        const comments = await Comment.find({ post }).populate('author').sort({ parent: 1 })
        return res.status(200).json({ comments })
    } catch (error) {
        next(error)
    }
})


module.exports = router