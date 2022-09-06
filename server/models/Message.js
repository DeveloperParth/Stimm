const Mongoose = require("mongoose")

const MessageSchema = new Mongoose.Schema({
    sender: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User Id is required'],
    },
    converstion: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'Converstion',
        required: [true, 'Converstion Id is required'],
    },
    message: {
        type: String,
        required: [true, 'Message is required']
    }
}, { timestamps: true })

module.exports = Mongoose.model('Message', MessageSchema, 'Messages')
