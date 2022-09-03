const Mongoose = require('mongoose');
const MONGOURI = process.env.MONGOURI;
const InitiateMongoServer = async () => {
    try {
        await Mongoose.connect(MONGOURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Connected to DB");
    } catch (e) {
        throw e;
    }
};
InitiateMongoServer()
module.exports = {InitiateMongoServer};