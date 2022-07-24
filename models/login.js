const mongoose = require('mongoose')

const schemaMongoose = mongoose.Schema({
    userid2: {
        type: String,
        default: ""
    },
    token: {
        type: String,
        default: ""
    },
    datelogin: {
        type: Date,
        default: Date.now,
    },
    datelogincheck: {
        type: Date,
        default: Date.now,
    },
    dateloginend: {
        type: Date,
        default: Date.now,
    },
    keyactivate: {
        type: String,
        default: ""
    },
    keyactivateuse: {
        type: Boolean,
        default: false
    },
    dateactivatecreated: {
        type: Date,
        default: null
    },
    dateactivateend: {
        type: Date,
        default: null
    },
    dateactivateok: {
        type: Date,
        default: null
    },
    datecreated: {
        type: Date,
        default: Date.now
    },
    statuscod: {
        type: Number,
        default: 0
    }
})

const options = (params) => {
    return {
        db: {
            existsCheck: null,
            existsMessage: 'Correo eléctronico ya registrado'
        }
    }
}; 


module.exports = {
    options: options,
    schemaMongoose: mongoose.model('login', schemaMongoose, 'login')
}