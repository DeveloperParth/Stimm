const router = require('express').Router()
const checkUser = require('../middlewares/checkUser')
const BaseError = require('../utils/BaseError')
const Bookmark = require('../models/Bookmark')
const Post = require('../models/Post')

const ObjectId = require('mongoose').Types.ObjectId

router.get('/bookmarks', checkUser, async (req, res, next) => {
    try {
        // const bookmarks = await Bookmark.find({ user: res.locals.user._id }).populate({ path: 'post', populate: { path: 'author' } })
        const bookmarks = await Bookmark.aggregate([
            {
                $match: { user: ObjectId(res.locals.user._id) },
            },
            { $sort: { createdAt: -1 } },
            {
                $lookup: {
                    from: 'Posts',
                    localField: 'post',
                    foreignField: '_id',
                    as: 'post',
                },
            },
            { $unwind: '$post' },
            {
                $lookup: {
                    from: 'Users',
                    localField: 'post.author',
                    foreignField: '_id',
                    as: 'post.author',
                },
            },
            {
                $lookup: {
                    from: 'Likes',
                    localField: 'post._id',
                    foreignField: 'post',
                    as: 'likes',
                },
            },
            {
                $lookup: {
                    from: 'Comments',
                    localField: 'post._id',
                    foreignField: 'post',
                    as: 'comments',
                },

            },
            {
                $lookup: {
                    from: 'Likes',
                    let: { 'post': "$post._id" },
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
            { $addFields: { 'post.likes': { $size: '$likes' } } },
            { $addFields: { 'post.comments': { $size: '$comments' } } },
            { $addFields: { 'post.likeFlag': { $cond: { if: { $size: '$likeFlag' }, then: true, else: false } } } },
            { $unwind: '$post.author' },
        ])
        return res.status(200).json({ bookmarks })
    } catch (error) {
        next(error)
    }
})
router.post('/post/:id/bookmark', checkUser, async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) throw new BaseError(404, 'Post does not exists')
        const isExists = await Bookmark.find({ post, user: res.locals.user._id })
        if (isExists.length) {
            await Bookmark.deleteOne({ post, user: res.locals.user._id })
            return res.status(200).json({ message: 'Bookmark deleted' })
        }
        const bookmark = await Bookmark({
            post: post,
            user: res.locals.user._id
        })
        await bookmark.save()
        return res.status(200).json({ message: 'Bookmarked', bookmark })
    } catch (error) {
        next(error)
    }
})

module.exports = router