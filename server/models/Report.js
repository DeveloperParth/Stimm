const Mongoose = require("mongoose")

const ReportSchema = new Mongoose.Schema({
    reportedBy: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User Id is required'],
    },
    contentId: { type: Mongoose.Schema.Types.ObjectId, refPath: 'model_type' },
    model_type: { type: String, enum: ['Post', 'User', 'Comment'], required: true }
}, { timestamps: true })

module.exports = Mongoose.model('Report', ReportSchema, 'Reports')
