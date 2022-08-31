const express = require('express')
const app = express()
const cors = require('cors')
const dotenv = require('dotenv').config()
const ErrorHandler = require('./middlewares/ErrorHandler')


const { InitiateMongoServer } = require('./config/db')

app.use(cors({origin: '*'}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/uploads', express.static('./uploads'))
app.use('/api/auth', require('./routes/auth'))
app.use('/api/user', require('./routes/user'))
app.use('/api', require('./routes/post'))
app.use('/api', require('./routes/notification'))
app.use('/api', require('./routes/comment'))
app.use('/api', require('./routes/bookmark'))
app.use(ErrorHandler)




app.listen(5000, () => {
    console.log('http://localhost:5000')
})