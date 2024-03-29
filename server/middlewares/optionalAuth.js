const jwt = require('jsonwebtoken');
const BaseError = require('./../utils/BaseError')


module.exports = (req, res, next) => {
    try {
        let token = req.headers.authorization;
        if (!token) return next()
        if (token.startsWith('Bearer')) {
            token = token.split(" ")[1];
        }
        let decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded) {
            res.locals.user = decoded;
            next();
        } else {
            throw BaseError(401, "Invalid")
        }
    } catch (error) {
        next()
    }
}