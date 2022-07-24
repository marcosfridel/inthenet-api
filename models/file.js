const mongoose = require('mongoose')

const schemaMongoose = new mongoose.Schema({
    originalname: {
        type: String,
        trim: true
    },
    encoding: {
        type: String,
        trim: true
    },
    mimetype: {
        type: String,
        trim: true
    },
    destination: {
        type: String,
        trim: true
    },
    filename: {
        type: String,
        trim: true
    },
    path: {
        type: String,
        trim: true
    },
    size: {
        type: Number
    },
    binary: {
        type: Buffer,
        trim: true
    },
    datecreated: {
        type: Date,
        default: Date.now
    },
    statuscod: {
        type: Number,
        default: 0
    },
});

const options = (params) => {
    return {
        db: {
            existsCheck: null,
            existsMessage: 'Key ya registrada'
        }
    }
}; 

module.exports = {
    options: options,
    schemaMongoose: mongoose.model('file', schemaMongoose, 'file')
}
