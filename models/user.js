const mongoose = require('mongoose')
const bcrypt = require('bcrypt');

const schemaLogin = new mongoose.Schema({
});


const schemaMongoose = mongoose.Schema({
    firstname: {
        type: String,
        alias: 'Nombre',
        trim: true,
        required: [true, 'Es requerido'],
        maxLength: [255, 'Largo máximo no válido']
    },
    lastname: {
        type: String,
        required: true,
        minLength: [true, 'Es requerido'],
        maxLength: [255, 'Largo máximo no válido']
    },
    email: {
        type: String,
        label: 'Correo electrónico',
        /* required: [true, 'Es requerido'], */
        //minLength: [6, 'Largo mínimo no válido'],
        //maxLength: [255, 'Largo máximo no válido']
    },
    password: {
        type: String,
        //required: [true, 'Es requerido'],
        //minLength: [8, 'Largo mínimo no válido'],
    },
    loginprovider: {
        type: String,
        label: 'Provider Login'
    },
    loginid: {
        type: Number,
        alias: 'Id Login',
        default: 0,
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

schemaMongoose.virtual('name').get(function(){
    return `${this.lastName}, ${this.firstName}`;
})

const password = () => {
    return {
        encrypt: async (pwd) => { 
            return await bcrypt.hash(pwd, await bcrypt.genSalt(10));
        },
        compare: async (pwd, pwdCompare) => { 
            //console.log('pwd', pwd);
            //console.log('pwdCompare', pwdCompare);
            //console.log('schemaMongoose.password', schemaMongoose.password);
            return await bcrypt.compare(pwd, pwdCompare) 
        } 
    }
}

const options = (params) => {
    return {
        db: {
            existsCheck: {
                email: params.email
            },
            existsMessage: 'Correo eléctronico ya registrado'
        }
    }
}; 


module.exports = {
    options: options,
    password: password,
    schemaMongoose: mongoose.model('user', schemaMongoose, 'user')
}