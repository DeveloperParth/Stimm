const Mongoose = require("mongoose")

const UserSchema = new Mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        uniqe: [true, 'Username is taken']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        uniqe: [true, 'Email is taken']
    },
    password:{
        type: String,
        required: [true, 'Password is required']
    },
    name:{
        type: String,
        required: [true, 'Name is required']
    },
    avatar: {
        type: String,
        default: 'avatar.jpg'
    },
    cover: {
        tpye: String,
    },
    verified: {
        type: Boolean,
        default: false
    }
}, {timestamps: true})

module.exports = Mongoose.model('User', UserSchema, 'Users')
