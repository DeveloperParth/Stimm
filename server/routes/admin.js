const router = require('express').Router()
const BaseError = require('./../utils/BaseError')

router.get('/stats', async (req, res, next) => {
    try {
    } catch (error) {
        next(error)
    }
})

module.exports = router