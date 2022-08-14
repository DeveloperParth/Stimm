const Mongoose = require("mongoose")

const FollowSchema = new Mongoose.Schema({
    follower: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User Id is required'],
    },
    user: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: [true, 'User Id is required'],
    },
}, { timestamps: true })

module.exports = Mongoose.model('Follow', FollowSchema, 'Follows')
