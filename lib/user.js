const model = require('../models/user');

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
    return await db.insert(
        model, 
        params
    )
}

const update = async (id, params) => {
    if(params.password)
        params.password = await model.password().encrypt(params.password);

    return await db.update(
        model, 
        id,
        params
    )
}

module.exports = {
    get,
    insert,
    list,
    update
} 