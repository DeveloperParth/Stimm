const express = require('express')
const app = express()
const server = require('http').createServer(app);

const cors = require('cors')
const ErrorHandler = require('./middlewares/ErrorHandler')

const { Server } = require("socket.io");
const io = new Server(server, { cors: '*' });
if (process.env.NODE_ENV !== 'production') {
    const dotenv = require('dotenv').config()
}

const { InitiateMongoServer } = require('./config/db');
const Converstion = require('./models/Converstion');

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/uploads', express.static('./uploads'))
app.use('/api/admin', require('./routes/admin'))
app.use('/api/auth', require('./routes/auth'))
app.use('/api/user', require('./routes/user'))
app.use('/api/search', require('./routes/search'))
app.use('/api', require('./routes/message'))
app.use('/api', require('./routes/post'))
app.use('/api', require('./routes/notification'))
app.use('/api', require('./routes/comment'))
app.use('/api', require('./routes/bookmark'))
app.use('/api', require('./routes/contact'))
app.use(ErrorHandler)



global.users = {}
const getUserBySocketId = (socketId, object = global.users) => Object.keys(object).find(key => object[key].id === socketId);

io.on('connection', (socket) => {
    socket.on('add user', (id) => {
        id ? global.users[id] = socket : null
    })
    // socket.on('typing', async ({ converstion: id, sender }) => {
    //     const c = await Converstion.findById(id)
    //     c.users?.map(u => u !== sender && global.users[u]?.emit('typing', { converstion: c._id, message: 'typing' }))
    // })
    socket.on('disconnect', () => {
        delete global.users[getUserBySocketId(socket.id)]

    })
})


// async function clear() {
//     const Like = require('./models/Like');
//     const Post = require('./models/Post');
//     const User = require('./models/User');
//     const Bookmark = require('./models/Bookmark');
//     const Notification = require('./models/Notification');
//     const Comment = require('./models/Comment');
//     const Follow = require('./models/Follow');
//     const Message = require('./models/Message');
//     const Converstion = require('./models/Converstion')

//     await Like.deleteMany()
//     await Post.deleteMany()
//     await User.deleteMany()
//     await Bookmark.deleteMany()
//     await Notification.deleteMany()
//     await Comment.deleteMany()
//     await Follow.deleteMany()
//     await Follow.deleteMany()
//     await Message.deleteMany()
//     await Converstion.deleteMany()


// }

server.listen(process.env.PORT || 5000, () => {
    console.log('http://localhost:5000')
})