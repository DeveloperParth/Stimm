const Mongoose = require("mongoose")

const CommentSchema = new Mongoose.Schema({
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
    body:{
        type: String,
        required: [true, 'Comment is required']
    },
    parent: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
    }
}, {timestamps: true})

module.exports = Mongoose.model('Comment', CommentSchema, 'Comments')
