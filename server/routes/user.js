const router = require('express').Router()
const User = require('./../models/User')
const checkUser = require('./../middlewares/checkUser')
const optionalAuth = require('./../middlewares/optionalAuth')
const BaseError = require('./../utils/BaseError')
const Follow = require('../models/Follow')
const Post = require('../models/Post')
const upload = require('./../middlewares/Upload')

const ObjectId = require('mongoose').Types.ObjectId
const Comment = require('../models/Comment')
const Like = require('../models/Like')
const { sendNotification } = require('../utils/SendNotification')



router.get('/profile', checkUser, async (req, res, next) => {
    try {
        const user = await User.findById(res.locals.user._id)
        const { password, ...rest } = user._doc
        return res.status(200).json({ user: rest })
    } catch (error) {
        next(error)
    }
})
router.patch('/profile', checkUser, upload.single('avatar'), async (req, res, next) => {
    try {
        const { username, name, bio } = req.body
        const user = await User.findById(res.locals.user._id)
        console.log(user.bio);
        user.username = username || user.username
        user.bio = bio || user.bio 
        user.name = name || user.name
        user.avatar = req.file?.filename || user.avatar
        const updatedUser = await user.save()
        const { password, __v, updatedAt, verified, ...restUser } = updatedUser._doc
        res.status(200).json({ message: 'User updated', user: restUser })
    } catch (error) {
        next(error)
    }
})
router.get('/all', async (req, res, next) => {
    try {
        const users = await User.find()
        return res.json({ users })
    } catch (error) {
        next(error)
    }
})
router.get('/:username', optionalAuth, async (req, res, next) => {
    try {
        const user = await User.aggregate([
            { $match: { username: req.params.username } },
            {
                $lookup: {
                    from: 'Follows',
                    localField: '_id',
                    foreignField: 'user',
                    as: 'followers',
                },
            },
            {
                $lookup: {
                    from: 'Follows',
                    localField: '_id',
                    foreignField: 'follower',
                    as: 'following',
                },
            },
            {
                $lookup: {
                    from: 'Posts',
                    localField: '_id',
                    foreignField: 'author',
                    as: 'posts',
                },
            },
            {
                $lookup: {
                    from: 'Follows',
                    let: { 'follow': "$_id" },
                    "pipeline": [
                        {
                            '$match': {
                                $expr: {
                                    $and: [
                                        { $eq: ["$follower", ObjectId(res.locals.user?._id)] },
                                        { $eq: ["$user", { $toObjectId: "$$follow" }] },
                                    ]
                                }
                            }
                        }],
                    as: 'followFlag',
                },
            },
            { $addFields: { followers: { $size: '$followers' } } },
            { $addFields: { following: { $size: '$following' } } },
            { $addFields: { posts: { $size: '$posts' } } },
            { $addFields: { followFlag: { $cond: { if: { $size: '$followFlag' }, then: true, else: false } } } },


        ])
        const { password, verified, ...restUser } = user[0]
        res.json({ user: restUser })
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
        sendNotification(user._id, `${res.locals.user.username} started following you`)
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
router.get('/:id/posts', optionalAuth, async (req, res, next) => {
    try {
        const posts = await Post.aggregate([
            {
                $match: { author: ObjectId(req.params.id) },

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
            {
                $unset: [
                    'author.password',
                ],
            },
        ]).sort({ createdAt: -1 })
        return res.status(200).json({ posts })
    } catch (error) {
        next(error)
    }
})
router.get('/:id/comments', optionalAuth, async (req, res, next) => {
    try {
        const comments = await Comment.find({ author: req.params.id }).populate('author', 'name username cover').populate({ path: 'post', populate: { path: 'author' } })
        return res.status(200).json({ comments })
    } catch (error) {
        next(error)
    }
})
router.get('/:id/likes', optionalAuth, async (req, res, next) => {
    try {
        const likes = await Like.find({ author: req.params.id }).populate('author', 'name username cover').populate({ path: 'post' })
        return res.status(200).json({ likes })
    } catch (error) {
        next(error)
    }
})
router.get('/:id/followers', optionalAuth, async (req, res, next) => {
    try {
        const followers = await Follow.find({ user: req.params.id }).populate('follower', 'name username avatar')
        return res.status(200).json({ followers })
    } catch (error) {
        next(error)
    }
})


module.exports = router