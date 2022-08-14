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
        console.log(e);
        throw e;
    }
};
module.exports = {InitiateMongoServer};