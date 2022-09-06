const router = require('express').Router()
const ObjectId = require('mongoose').Types.ObjectId

const Post = require('../models/Post')
const Like = require('../models/Like')
const Comment = require('../models/Comment')
const Follow = require('../models/Follow')

const BaseError = require('../utils/BaseError')
const optionalAuth = require('../middlewares/optionalAuth')
const checkUser = require('./../middlewares/checkUser')
const upload = require('./../middlewares/Upload')
const { sendNotification } = require('./../utils/SendNotification')


router.get('/post/feed', checkUser, async (req, res, next) => {
    const user = res.locals.user
    try {
        const offset = req.query?.offset
        const followingDocument = await Follow.find({ follower: user._id });
        if (!followingDocument) {
            return res.status(404).send({ error: 'Could not find any posts.' });
        }
        const following = followingDocument.map(
            (following) => following.user
        );
        const posts = await Post.aggregate([
            {
                $match: {
                    $and:
                        [
                            {
                                deleted: {
                                    $exists: false
                                }
                            },
                            { $or: [{ author: { $in: following } }, { author: ObjectId(user._id) }] },
                        ]
                },
            },
            { $sort: { createdAt: -1 } },
            {
                $lookup: {
                    from: 'Users',
                    localField: 'author',
                    foreignField: '_id',
                    as: 'author',
                },
            },
            {
                $lookup: {
                    from: 'Likes',
                    localField: '_id',
                    foreignField: 'post',
                    as: 'likes',
                },
            },
            {
                $lookup: {
                    from: 'Comments',
                    localField: '_id',
                    foreignField: 'post',
                    as: 'comments',
                },

            },
            {
                $lookup: {
                    from: 'Likes',
                    let: { 'post': "$_id" },
                    "pipeline": [
                        {
                            '$match': {
                                $expr: {
                                    $and: [
                                        { $eq: ["$author", ObjectId(res.locals.user._id)] },
                                        { $eq: ["$post", { $toObjectId: "$$post" }] },
                                    ]
                                }
                            }
                        }],
                    as: 'likeFlag',
                },
            },
            {
                $lookup: {
                    from: 'Bookmarks',
                    let: { 'post': "$_id" },
                    "pipeline": [
                        {
                            '$match': {
                                $expr: {
                                    $and: [
                                        { $eq: ["$user", ObjectId(res.locals.user._id)] },
                                        { $eq: ["$post", { $toObjectId: "$$post" }] },
                                    ]
                                }
                            }
                        }],
                    as: 'bookmarkFlag',
                },
            },
            { $addFields: { likes: { $size: '$likes' } } },
            { $addFields: { comments: { $size: '$comments' } } },
            { $addFields: { likeFlag: { $cond: { if: { $size: '$likeFlag' }, then: true, else: false } } } },
            { $addFields: { bookmarkFlag: { $cond: { if: { $size: '$bookmarkFlag' }, then: true, else: false } } } },
            { $unwind: '$author' }
        ])
        return res.status(200).json({ posts })
    } catch (error) {
        next(error)
    }
})
router.get('/post/tag/:tag', optionalAuth, async (req, res, next) => {
    try {
        const posts = await Post.aggregate([
            {
                $match: {
                    $and:
                        [
                            {
                                deleted: {
                                    $exists: false
                                }
                            },
                            {
                                $and: [

                                    { tags: '#' + req.params.tag, },
                                    { createdAt: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) } }
                                ]
                            }
                        ]
                }
            },
            { $sort: { createdAt: -1 } },
            {
                $lookup: {
                    from: 'Users',
                    localField: 'author',
                    foreignField: '_id',
                    as: 'author',
                },
            },
            {
                $lookup: {
                    from: 'Likes',
                    localField: '_id',
                    foreignField: 'post',
                    as: 'likes',
                },
            },
            {
                $lookup: {
                    from: 'Comments',
                    localField: '_id',
                    foreignField: 'post',
                    as: 'comments',
                },

            },
            {
                $lookup: {
                    from: 'Bookmarks',
                    let: { 'post': "$_id" },
                    "pipeline": [
                        {
                            '$match': {
                                $expr: {
                                    $and: [
                                        { $eq: ["$user", ObjectId(res.locals.user._id)] },
                                        { $eq: ["$post", { $toObjectId: "$$post" }] },
                                    ]
                                }
                            }
                        }],
                    as: 'bookmarkFlag',
                },
            },
            {
                $lookup: {
                    from: 'Likes',
                    let: { 'post': "$_id" },
                    "pipeline": [
                        {
                            '$match': {
                                $expr: {
                                    $and: [
                                        { $eq: ["$author", ObjectId(res.locals.user?._id)] },
                                        { $eq: ["$post", { $toObjectId: "$$post" }] },
                                    ]
                                }
                            }
                        }],
                    as: 'likeFlag',
                },
            },
            { $addFields: { likes: { $size: '$likes' } } },
            { $addFields: { comments: { $size: '$comments' } } },
            { $addFields: { likeFlag: { $cond: { if: { $size: '$likeFlag' }, then: true, else: false } } } },
            { $addFields: { bookmarkFlag: { $cond: { if: { $size: '$bookmarkFlag' }, then: true, else: false } } } },
            { $unwind: '$author' }
        ])
        res.status(200).json({ posts })
    } catch (error) {
        next(error)
    }
})
router.get('/tags', async (req, res, next) => {
    try {
        const tags = await Post.aggregate([
            {
                $unwind: "$tags"
            },
            {
                $group: {
                    _id: "$tags",
                    postsCount: { $sum: 1 }
                }
            },
            { $addFields: { tag: "$_id" } }
        ])
        res.status(200).json({ tags })
    } catch (error) {
        next(error)
    }
})
router.get('/post/tranding', optionalAuth, async (req, res, next) => {
    try {
        const posts = await Post.aggregate([
            {
                $match: { createdAt: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) } }
            },
            {
                $lookup: {
                    from: 'Users',
                    localField: 'author',
                    foreignField: '_id',
                    as: 'author',
                },
            },
            {
                $lookup: {
                    from: 'Likes',
                    localField: '_id',
                    foreignField: 'post',
                    as: 'likes',
                },
            },
            {
                $lookup: {
                    from: 'Comments',
                    localField: '_id',
                    foreignField: 'post',
                    as: 'comments',
                },

            },
            {
                $lookup: {
                    from: 'Bookmarks',
                    let: { 'post': "$_id" },
                    "pipeline": [
                        {
                            '$match': {
                                $expr: {
                                    $and: [
                                        { $eq: ["$user", ObjectId(res.locals.user?._id)] },
                                        { $eq: ["$post", { $toObjectId: "$$post" }] },
                                    ]
                                }
                            }
                        }],
                    as: 'bookmarkFlag',
                },
            },
            {
                $lookup: {
                    from: 'Likes',
                    let: { 'post': "$_id" },
                    "pipeline": [
                        {
                            '$match': {
                                $expr: {
                                    $and: [
                                        { $eq: ["$author", ObjectId(res.locals.user?._id)] },
                                        { $eq: ["$post", { $toObjectId: "$$post" }] },
                                    ]
                                }
                            }
                        }],
                    as: 'likeFlag',
                },
            },
            { $addFields: { likes: { $size: '$likes' } } },
            { $addFields: { comments: { $size: '$comments' } } },
            { $addFields: { likeFlag: { $cond: { if: { $size: '$likeFlag' }, then: true, else: false } } } },
            { $addFields: { bookmarkFlag: { $cond: { if: { $size: '$bookmarkFlag' }, then: true, else: false } } } },
            { $unwind: '$author' },
            { $sort: { likes: -1 } },
        ])
        res.status(200).json({ posts })
    } catch (error) {
        next(error)
    }
})
router.post('/post/create', checkUser, upload.array('attachments', 1), async (req, res, next) => {
    try {
        const { body } = req.body
        if (!body) throw new BaseError()
        const tags = body.match(/#\w+/g)
        const mentions = body.match(/@\w+/g)
        const post = new Post({
            author: res.locals.user._id,
            body,
            attachments: req.files,
            tags
        })
        const savedPost = await post.save()
        return res.status(200).json({ post: savedPost })
    } catch (error) {
        next(error)
    }
})
router.post('/post/:id/report', checkUser, upload.array('attachments', 1), async (req, res, next) => {
    try {
        return res.status(200).json({ message: 'Post has been reported' })
    } catch (error) {
        next(error)
    }
})
router.delete('/post/:id', checkUser, async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) throw new BaseError(404, "No post found")
        if (!post.author.equals(post.author)) throw new BaseError(403, "Unauthorized")
        await Post.findByIdAndDelete(post._id)
        return res.status(200).json({ message: "Post deleted" })
    } catch (error) {
        next(error)
    }
})
router.get('/post/:id', optionalAuth, async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id).populate('author', 'name username avatar')
        const likes = await Like.find({ post }).count()
        const comments = await Comment.find({ post }).count()
        const likeFlag = res.locals.user ? await Like.findOne({ post, author: res.locals.user._id }) : false
        if (!post) throw new BaseError(404, "No post found")
        return res.status(200).json({ post: { ...post._doc, likes, comments, likeFlag: Boolean(likeFlag) } })
    } catch (error) {
        next(error)
    }
})
router.post('/post/:id/like', checkUser, async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) throw new BaseError(404, "No post found")
        const like = await Like.find({ $and: [{ author: res.locals.user._id }, { post: post._id }] })
        if (like.length) {
            await Like.findByIdAndDelete(like)
            return res.status(200).json({ message: 'Like removed' })
        } else {
            const newLike = new Like({
                author: res.locals.user._id,
                post
            })
            const like = await newLike.save()
            if (like.author != post.author) {
                sendNotification(post.author, `@${res.locals.user.username} liked your post`)
            }
            return res.status(200).json({ message: 'Liked', like })
        }
    } catch (error) {
        next(error)
    }
})
router.get('/post/:id/likes', async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) throw new BaseError(404, 'No post found')
        const likes = await Like.find({ post }).sort({ parent: 1 })
        return res.status(200).json({ likes })
    } catch (error) {
        next(error)
    }
})

module.exports = router