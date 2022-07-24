const mongoose = require('mongoose')

const schemaReply = new mongoose.Schema({
    text: {
        type: String,
        alias: 'Texto',
        trim: true,
        required: [true, 'Es requerido']
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

const schemaComment = new mongoose.Schema({
    text: {
        type: String,
        alias: 'Texto',
        trim: true,
        required: [true, 'Es requerido']
    },
    replies: [schemaReply],
    datecreated: {
        type: Date,
        default: Date.now
    },
    statuscod: {
        type: Number,
        default: 0
    },
});

const schemaMongoose = mongoose.Schema({
    title: {
        type: String,
        alias: 'Título',
        trim: true,
        required: [true, 'Es requerido'],
        maxLength: [255, 'Largo máximo no válido']
    },
    text: {
        type: String,
        alias: 'Texto',
        trim: true,
        required: [true, 'Es requerido']
    },
    comments: [schemaComment],
    datecreated: {
        type: Date,
        default: Date.now
    },
    statuscod: {
        type: Number,
        default: 0
    },
})

const options = (params) => {
    return {
        db: {
            existsCheck: null,
            existsMessage: ''
        }
    }
}; 


module.exports = {
    options: options,
    schemaMongoose: mongoose.model('blog', schemaMongoose, 'blog')
}