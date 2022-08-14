const express = require('express')
const app = express()
const cors = require('cors')
const dotenv = require('dotenv')
const ErrorHandler = require('./middlewares/ErrorHandler')


dotenv.config()
const { InitiateMongoServer } = require('./config/db')
InitiateMongoServer()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/uploads', express.static('./uploads'))
app.use('/api/auth', require('./routes/auth'))
app.use('/api/user', require('./routes/user'))
app.use('/api/post', require('./routes/post'))

app.use(ErrorHandler)

app.listen(5000, () => {
    console.log('http://localhost:5000')
})