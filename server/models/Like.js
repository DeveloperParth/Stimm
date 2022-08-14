const Mongoose = require("mongoose")

const LikeSchema = new Mongoose.Schema({
    author: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User Id is required'],
    },
    post: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: [true, 'Post Id is required'],
    },
}, {timestamps: true})

module.exports = Mongoose.model('Like', LikeSchema, 'Likes')
