const model = require('../models/login');

const db = require('./db');

const list = async (params) => {
    return await db.list(
        model, 
        params
    )
}

const get = async (id) => {
    return await db.get(
        model, 
        id
    )
}

const insert = async (params) => {
    //console.log('params.userid', params.userid )
    params.userid = db.getObjectId(params._id)
    //console.log('params.userid', params.userid )
    
    return await db.insert(
        model, 
        params
    )
}

const update = async (filter, params) => {
    if(params.password)
        params.password = await model.password().encrypt(params.password);

    return await db.update(
        model, 
        filter,
        params
    )
}

const status = async (token) => {
    //console.log('status token', token)
    return await db.get(
        model, 
        { 
            token: token,
            statuscod: 0
        }
    )
    //return status;
}

module.exports = {
    get,
    insert,
    list,
    update,
    status
} 