const mongoose = require("mongoose");
const logger = require("../lib/logger");

const URL = process.env.MONGO_URL;

const mongo = { 
    connection: () => {
        mongoose.connect(URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(() => {
            logger('info', 'Connected to MongoDB');
        }).catch(err => {
            logger('error', `Error connecting to MongoDB: ${err.message}`);
        })
    }
};

module.exports = {
    mongo
};