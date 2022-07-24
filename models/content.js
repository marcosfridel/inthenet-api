const mongoose = require('mongoose')

const schemaTranslate = new mongoose.Schema({
    language: {
        type: String,
        alias: 'Idioma',
        trim: true,
        required: [true, 'Es requerido'],
        minLength: [2, 'Largo mínimo no válido'],
        maxLength: [2, 'Largo máximo no válido']
    },
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

const schemaMongoose = mongoose.Schema({
    key: {
        type: String,
        alias: 'Key',
        trim: true,
        required: [true, 'Es requerido'],
        maxLength: [255, 'Largo máximo no válido']
    },
    translate: [schemaTranslate]
})

const options = (params) => {
    return {
        db: {
            existsCheck: {
                key: params.key
            },
            existsMessage: 'Key ya registrada'
        }
    }
}; 


module.exports = {
    options: options,
    schemaMongoose: mongoose.model('content', schemaMongoose, 'content')
}