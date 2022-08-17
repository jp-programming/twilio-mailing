const { admin } = require('../DB/Firebase.js');
const logger = require('./logger');
const { normalize, schema } = require('normalizr');

module.exports = class FirebaseContainer {
    constructor(collName){
        this.db = admin.firestore();
        this.query = this.db.collection(collName);
    };

    async save(obj) {
        const newMessage = {
            author: {
                ...obj
            },
            text: obj.text,
            date: obj.date 
        }

        delete newMessage.author.text;
        delete newMessage.author.date;
        
        return await this.query.add(newMessage);
    }

    async getAll() {
        const authorSchema = new schema.Entity('authors');
        const messageSchema = new schema.Entity('messages', { 
            author: authorSchema
        });
        const chat = new schema.Entity('chat', { 
            messages: [messageSchema]
        });

        try {
            const messages = (await this.query.orderBy('date', 'asc').get()).docs
                .map(msg => ({ ...msg.data(), id: msg.id }));
            const data = { id: 'messages', messages };
    
            return normalize(data, chat);
        }   catch(err) {
            logger('error', err);
            return;
        }
    }
}