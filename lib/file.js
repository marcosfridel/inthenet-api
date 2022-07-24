const model = require('../models/file');

const db = require('./db');

const fs = require('fs');

const list = async (params) => {
    return await db.list(
        model, 
        params,
        {
            _id: 1,
            statusCod: 1,
            dateCreated: 1,
            originalname: 1,
            encoding: 1,
            mimetype: 1,
            destination: 1,
            filename: 1,
            path: 1,
            size: 1
        }
    )
}

const get = async (id) => {
    return await db.get(
        model, 
        id
    )
}

const getData = async (id) => {
    //console.log(id)
    return await db.get(
        model, 
        id,
        {
            _id: 1,
            statusCod: 1,
            dateCreated: 1,
            originalname: 1,
            encoding: 1,
            mimetype: 1,
            destination: 1,
            filename: 1,
            path: 1,
            size: 1
        }
    )
}

const insert = async (params) => {
    return await db.insert(
        model, 
        params
    )
}

const importJson = async (collection, path) => {
    const fileBuffer = fs.readFileSync(path)//.toString('utf8');

    let result = await db.importJson(
        collection, 
        fileBuffer
    )

    result.message = 
        result.type === 'success' ?
        'La importación se ha llevado a cabo correctamente':
        'La importación ha tenido errores';
    result.count = result.result.insertedCount;

    //fs.
    return result;
}

module.exports = {
    get,
    getData,
    importJson,
    insert,
    list
}