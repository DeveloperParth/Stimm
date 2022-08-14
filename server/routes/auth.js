const router = require('express').Router()
const User = require('../models/User')
const BaseError = require('./../utils/BaseError')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

router.post('/login', async (req, res, next) => {
    try {
        const { email, password: uPassword } = req.body
        console.log(uPassword);
        if (!email && !uPassword) throw new BaseError(400, 'Email and password are required')
        const user = await User.findOne({ $or: [{ email }, { 'username': email }] })
        if (!user) throw new BaseError(401, 'Email or password is wrong')
        const isSame = await bcrypt.compare(uPassword, user.password)
        if (!isSame) throw new BaseError(401, 'Email or password is wrong')
        if (!user.verified) throw new BaseError(401, "User not verified")
        const { password, __v, updatedAt, createdAt, ...restUser } = user._doc
        console.log(restUser);
        const token = jwt.sign({ ...restUser }, process.env.JWT_SECRET)
        res.status(200).json({ message: 'Logged in', user: { ...restUser, token } })
    } catch (error) {
        next(error)
    }
})


router.post('/signup', async (req, res, next) => {
    try {
        const { email, password, name, username } = req.body
        const emailExist = await User.findOne({ email })
        if (emailExist) throw new BaseError(400, 'Account alreday exists')
        const usernameExist = await User.findOne({ username })
        if (usernameExist) throw new BaseError(400, 'Username is taken')
        const hasedPassword = await bcrypt.hash(password, 10)
        const user = new User({
            email,
            name,
            username,
            password: hasedPassword
        })
        const savedUser = await user.save()
        const token = jwt.sign({ id: savedUser._id }, process.env.JWT_VERIFY + savedUser.password, { expiresIn: '60m' })
        const link = `http://localhost:5000/api/auth/${savedUser._id}/${token}`
        console.log(link);
        return res.status(200).json({ message: 'Please verify your account, An email has been sent to your mail' })
    } catch (error) {
        next(error)
    }
})
router.get('/verify/:id/:token', async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user) throw new BaseError()
        const decoded = jwt.verify(req.params.token, process.env.JWT_VERIFY + user.password)
        if (decoded.id != user._id) throw new BaseError()
        user.verified = true
        const updatedUser = await user.save()
        const { password, __v, updatedAt, createdAt, ...restUser } = updatedUser._doc
        const token = jwt.sign({ ...restUser }, process.env.JWT_SECRET)
        res.status(200).json({ message: 'User verified', user: { ...restUser, token } })
    } catch (error) {
        next(error)
    }
})
router.post('/forgot', async (req, res, next) => {
    try {
        const { username } = req.body
        const user = await User.findOne({ username })
        if (!user) return res.status(200)
        const token = jwt.sign({ id: user._id }, process.env.JWT_VERIFY + user.password, { expiresIn: '60m' })
        const link = `http://localhost:5000/api/auth/${user._id}/${token}`
        console.log(link);
        return res.status(200).json({ message: 'Please verify your account, An email has been sent to your mail' })
    } catch (error) {
        next(error)
    }
})
router.get('/forgot/verify/:id/:token', async (req, res, next) => {
    try {
        const {password} = req.body
        const user = await User.findById(req.params.id)
        if (!user) throw new BaseError()
        const decoded = jwt.verify(req.params.token, process.env.JWT_VERIFY + user.password)
        if (decoded.id != user._id) throw new BaseError()
        const hasedPassword = await bcrypt.hash(password, 10)
        user.password = hasedPassword
        const updatedUser = await user.save()
        const { password:trash, __v, updatedAt, createdAt, ...restUser } = updatedUser._doc
        const token = jwt.sign({ ...restUser }, process.env.JWT_SECRET)
        res.status(200).json({ message: 'Password updated', user: { ...restUser, token } })
    } catch (error) {
        next(error)
    }
})
module.exports = router