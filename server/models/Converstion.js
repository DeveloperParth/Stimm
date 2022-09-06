const Mongoose = require("mongoose")

const ConverstionSchema = new Mongoose.Schema({
    users: [
        {
            type: Mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User Id is required'],
        }
    ]
}, { timestamps: true })

module.exports = Mongoose.model('Converstion', ConverstionSchema, 'Converstions')
