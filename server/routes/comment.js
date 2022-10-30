const router = require('express').Router()
const optionalAuth = require('../middlewares/optionalAuth')
const checkUser = require('./../middlewares/checkUser')
const Post = require('../models/Post')
const Comment = require('../models/Comment')
const { sendNotification } = require('../utils/SendNotification')
const BaseError = require('./../utils/BaseError')
const ObjectId = require('mongoose').Types.ObjectId


router.post('/post/:id/comment', checkUser, async (req, res, next) => {
    try {
        const { body } = req.body
        const post = await Post.findById(req.params.id)
        const mentions = body.match(/@\w+/g)
        const newComment = new Comment({
            author: res.locals.user._id,
            post: post._id,
            body,
        })
        const comment = await newComment.save()
        if (res.locals.user._id != post.auth) {
            sendNotification(post.author, `${res.locals.user.username} replied to your post`)
        }
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
        const comments = await Comment.aggregate([
            { $match: { post: post._id } },
            {
                $lookup: {
                    from: 'Users',
                    localField: 'author',
                    foreignField: '_id',
                    as: 'author'
                }
            },
            { $unwind: '$author' },
            {
                $unset: [
                    'author.password',
                    'author.email'
                ]
            },
        ])
        return res.status(200).json({ comments })
    } catch (error) {
        next(error)
    }
})
router.delete('/comment/:id', checkUser, async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.id)
        if (!comment) throw new BaseError(404, 'Comment not found')
        if (comment.author != res.locals.user._id) throw new BaseError()
        await Comment.findByIdAndDelete(comment._id)
        return res.status(200).json({ message: 'Comment is deleted' })
    } catch (error) {
        next(error)
    }
})


module.exports = router