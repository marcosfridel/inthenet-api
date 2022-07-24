const model = require('../models/blog');

const db = require('./db');
const json = require('./json');

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

const insertComment = async (id, params) => {
    params = json.deleteKey(params, 'id');

    return await db.push(
        model, 
            id,
            { 
                comments: params
            }
        )
}

module.exports = {
    get,
    list,
    insert,
    insertComment
}