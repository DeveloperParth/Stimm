const Mongoose = require("mongoose")

const NotificationSchema = new Mongoose.Schema({
    owner: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User Id is required'],
    },
    body: {
        type: String,
    },
    unread: {
        type: Boolean,
        default: true
    },
    type: {
        type: String,
        enum: ['mention', 'like', 'follow']
    }
}, { timestamps: true })

module.exports = Mongoose.model('Notification', NotificationSchema, 'Notifications')
