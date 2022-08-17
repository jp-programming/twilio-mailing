const mongoose = require('mongoose');
const { mongo } = require('../DB/MongoDB');
const logger = require('./logger');

const usersCollection = 'users';

const usersSchema = new mongoose.Schema({
    name: String,
    age: Number,
    address: String,
    phone: String,
    email: String, 
    password: String
});

const User = mongoose.model(usersCollection, usersSchema);

module.exports = class MongoContainer {
    constructor(){
        this.db = mongo;
    };

    async save(obj){
        this.db.connection();
        
        try {
            const { _id } = await User.create(obj);

            return _id;
        } catch (error) {
            logger('error', error);
        }
    };

    async getById(id){
        this.db.connection();

        try {
            const data = await User.findById(id, { __v: 0 });

            return data;
        } catch (error) {
            logger('error', error);
        }
    };

    async getByEmail(email){
        this.db.connection();

        try {
            const data = await User.findOne({ email: email }, { __v: 0 });
            
            return data;
        } catch (error) {
            logger('error', error);
        }
    };

    async getAll(){
        this.db.connection();

        try {
            const data = await User.find();
        
            return data;
        } catch (error) {
            logger('error', error);
        }

        return;
    };
};