const Mongoose = require("mongoose")

const PostSchema = new Mongoose.Schema({
    author: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User Id is required'],
    },
    body: {
        type: String,
        required: [true, 'Message is required'],
    },
    attachments: [{
        _id: false,
        path: String
    }],
    tags: [String],
    deleted: {
        type: Boolean
    }
}, { timestamps: true })

module.exports = Mongoose.model('Post', PostSchema, 'Posts')
