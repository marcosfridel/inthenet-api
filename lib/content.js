const model = require('../models/content');

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

const listByLanguage = async (params) => {
    //console.log('listByLanguage');
    let list = await db.list(
        model, 
        params
    )

    list.result = list.result.reduce((previous, item) => {
        let itemFind = item.translate.find(e => e.language === params['translate.language']);

        previous[item.key] = itemFind._doc

        return previous;
    }, {}) 

    return list;
}

const insert = async (params) => {
    return await db.insert(
        model, 
        params
    )
}

module.exports = {
    get,
    list,
    listByLanguage,
    insert
}