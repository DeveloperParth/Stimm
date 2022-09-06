module.exports = (error, req, res, next) => {
    console.log(error);
    return res.status(error.status || 500).json({ message: error.message || "Something went wrong" })
}