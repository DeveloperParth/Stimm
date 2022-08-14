const router = require('express').Router()
const checkUser = require('./../middlewares/checkUser')
const Post = require('../models/Post')
const BaseError = require('../utils/BaseError')
const Like = require('../models/Like')
const Comment = require('../models/Comment')
const optionalAuth = require('../middlewares/optionalAuth')
const Follow = require('../models/Follow')
const ObjectId = require('mongoose').Types.ObjectId;
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
const upload = multer({ storage })

router.get('/feed', checkUser, async (req, res, next) => {
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
            { $addFields: { likes: { $size: '$likes' } } },
            { $addFields: { comments: { $size: '$comments' } } },
            { $addFields: { likeFlag: { $cond: { if: { $size: '$likeFlag' }, then: true, else: false } } } },
            { $unwind: '$author' }
        ])
        return res.status(200).json({ posts })
    } catch (error) {
        next(error)
    }
})
router.post('/create', checkUser, upload.array('attachments', 1), async (req, res, next) => {
    try {
        const { body } = req.body
        if (!body) throw new BaseError()
        const post = new Post({
            author: res.locals.user._id,
            body,
            attachments: req.files
        })
        const savedPost = await post.save()
        return res.status(200).json({ post: savedPost })
    } catch (error) {
        next(error)
    }
})
router.delete('/:id', checkUser, async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) throw new BaseError(404, "No post found")
        if (!post.author.equals(post.author)) throw new BaseError(403, "Unauthorized")
        post.body = 'This post is deleted'
        post.deleted = true
        post.save()
        return res.status(200).json({ message: "Post deleted" })
    } catch (error) {
        next(error)
    }
})
router.get('/:id', optionalAuth, async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id).populate('author', 'name username avatar')
        const likes = await Like.find({ post }).count()
        const comments = await Comment.find({ post }).count()
        const likeFlag = res.locals.user ? await Like.findOne({ post, author: res.locals.user._id }) : false
        console.log(post);
        if (!post) throw new BaseError(404, "No post found")
        return res.status(200).json({ post: { ...post._doc, likes, comments, likeFlag: Boolean(likeFlag) } })
    } catch (error) {
        next(error)
    }
})
router.get('/:id/posts', async (req, res, next) => {
    try {
        const posts = await Post.aggregate([
            { $match: { author: ObjectId(req.params.id) } },
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
                    from: 'Users',
                    localField: 'author',
                    foreignField: '_id',
                    as: 'author',
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
            { $addFields: { likes: { $size: '$likes' } } },
            { $addFields: { comments: { $size: '$comments' } } },
            { $addFields: { likeFlag: { $cond: { if: { $size: '$likeFlag' }, then: true, else: false } } } },
            { $unwind: '$author' }



        ])
        return res.status(200).json({ posts })
    } catch (error) {
        next(error)
    }
})
router.post('/:id/like', checkUser, async (req, res, next) => {
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
            return res.status(200).json({ message: 'Liked', like })
        }
    } catch (error) {
        next(error)
    }
})
router.post('/:id/comment', checkUser, async (req, res, next) => {
    try {
        const { body, parent } = req.body
        const post = await Post.findById(req.params.id)
        const newComment = new Comment({
            author: res.locals.user._id,
            post: post._id,
            body,
            parent
        })
        const comment = await newComment.save()
        return res.status(200).json({ comment })
    } catch (error) {
        next(error)
    }
})
router.get('/:id/comments', async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) throw new BaseError(404, 'No post found')
        const comments = await Comment.find().sort({ parent: 1 })
        console.log(comments);
        return res.status(200).json({ comments })
    } catch (error) {
        next(error)
    }
})
router.get('/clean', async (req, res) => {
    await Post.deleteMany({ deleted: true })
    res.send('ok')
})

module.exports = router