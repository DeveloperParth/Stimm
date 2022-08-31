const Mongoose = require("mongoose")

const BookmarkSchema = new Mongoose.Schema({
    user: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: [true, 'User Id is required'],
    },
    post: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: [true, 'Post Id is required'],
    },
}, { timestamps: true })

module.exports = Mongoose.model('Bookmark', BookmarkSchema, 'Bookmarks')
