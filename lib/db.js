//npm install mongoose
//Modulus o MongoLab. VER PARA NUBE. IT'S FREE
const mongoose = require('mongoose');

let objectId = require('mongoose').Types.ObjectId; 

const json = require('../lib/json');
const config = require('../lib/config');

mongoose
    .connect(
        config.db.connectionString, 
        { 
            useNewUrlParser: true, 
            useUnifiedTopology: true 
        }
    )
    .then(() => {
        console.log('Conectado a la base de datos')
        mongoose.pluralize(null);
    })
    .catch((e) => {
        console.log('Error base de datos', e)
        //callback(json.getResult('error', 'Database error', e))
    })

const getObjectId = (id) => {
    //console.log('getObjectId', id)
    //console.log('Resource.findById(new mongoose.Types.ObjectId("507c35dd8fada716c89d0013"))', Resource.findById(new mongoose.Types.ObjectId("507c35dd8fada716c89d0013")))
/*     if(objectId.isValid(id))
        return id; */
    //console.log(mongoose.mongo.BSONPure.ObjectID.fromHexString(id));
    if(id === undefined) 
        return new objectId();
    //console.log('getObjectId', id, objectId(id));
    return objectId(id);
}

const list = async (model, params, select, limit) => {
    try {

        const schemaMongoose = model.schemaMongoose;

        //limit = (Number.isInteger(limit) ? limit : 0);
/*         let limit = (
            Number.isInteger(Number.parseInt(params.limit)) ?
            params.limit :
            0
        ); */
        //console.log(limit);
        
        //params = params._id ? { params } : params;
        //if(select) console.log('select: ', select);
        
/*         console.log('select', select)
        if(!select) select = {}
        if(select["_id"]) {
            select["_id"] = { ...select["_id"], "$toString": "$_id" }
        } else {
            select["_id"] = { "$toString": "$_id" }
        }
        console.log('select1', select) */
        //console.log('params', params)
        const result = (
            limit === 1 ? 
            await schemaMongoose.findOne( params, select) :
            await schemaMongoose.find(params, select).limit(limit)
        )

        //console.log('result', result, params)
        return json.getResult(
            'success',
            result,
            200
        )
    }
    catch (e) {
        return json.getResultError(
            'Error db.list', 
            e
        )
    }
}

const get = async (model, id, select) => {
    //if(id._id) id._id = getObjectId(id._id);
    const params = json.isJson(id) ? id : { _id: id }    

    return await list(
        model, 
        params,
        select,
        1
    );
}

const insert = async (model, params) => {
    try {

        const schemaMongoose = model.schemaMongoose;

        const itemModel = new schemaMongoose();
        Object.keys(params).map(key => {
            itemModel[key] = params[key]
        })

        const options = model.options(params);

        if (options.db.existsCheck){
            if (await schemaMongoose.findOne(
                options.db.existsCheck
                )) {

                return  json.getResult(
                    'error',
                    options.db.existsMessage,
                    400
                )
            }
        }

        return json.getResult(
            'success',
            await itemModel.save(),
            200
        );
    }
    catch (e) {
        return json.getResultError(
            'Error db.Insert', 
            e
        )
    }
}

const importJson = async (collection, docs) => {
    try{
        if(!json.isJson(docs)) { 
            return json.getResultError(
                'Error file.importJson', 
                'Formato de json no válido'
            )
        }
        console.log('importJson collection', collection)
        console.log('importJson docs', docs)

        const client = await require('mongodb').MongoClient.connect(config.db.connectionString)

        //.insertMany(JSON.parse(docs))
        const result = await client.db(process.env.DB_DATABASE).collection(collection).insertMany(JSON.parse(docs))

        await client.close;

        return json.getResult(
            'success',
            result,
            200
        );

    } catch (e) {
        console.log('importJson error', e)
        return json.getResultError(
            'Error db.importJson', 
            e
        ) 
    }
}

const update = async (model, filter, params) => {
    try {
        const schemaMongoose = model.schemaMongoose;
        
/*         if(objectId.isValid(filter))
            filter = { _id: objectId(filter) }; */
            
        filter = json.isJson(filter) ? filter : { _id: filter }    
        
        console.log('filter', filter)
        console.log('params', params)

        return json.getResult(
            'success', 
                await schemaMongoose.updateMany(
                filter, 
                { '$set': params }
            )
        )        
    } 
    catch (e) {
        return json.getResultError(
            'Error db.Update', 
            e
        )
    }
}

const push = async (model, filter, params) => {
    try {
        const schemaMongoose = model.schemaMongoose;
        
        if(objectId.isValid(filter))
            filter = { _id: objectId(filter) };
            
        return json.getResult(
            'success', 
            await schemaMongoose.updateMany(
                filter, 
                { 
                    '$push': params
                }
            )
        )        
    } 
    catch (e) {
        return json.getResultError(
            'Error db.Update', 
            e
        )
    }
}

module.exports = {
    get,
    getObjectId,
    importJson,
    insert,
    list,
    push,
    update
}

/* const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const json = require('./json')
const config = require('./config');

const getResult = (type, result) => {
    let details = '';
    if (!json.isJson(result)) {
        details = result;
        result = []
    }

    return {
        type: type,
        details: details,
        count: (Array.isArray(result) ? result.length : 1),
        result: result
    };
}

const getObjectId = (id) => {
    if(id === undefined) 
        return new mongodb.ObjectId();
    return new mongodb.ObjectId(id);
}

const getClientAsync = () => {
    return new Promise((resolve, reject) => {
        try{
            MongoClient.connect(config.db.url, (e, client) => {
                if (e) reject(e);
                resolve(client);
            })
        }
        catch (e) {
            reject(e);
        }
    })
}

const getClient = async () => {
    return await getClientAsync();
} 

const setJsonStandard = (obj) => {
    obj = setJsonStatusCod(obj);
    obj = setJsonCreatedDate(obj);

    return obj;
}

const setJsonStatusCod = (obj) => {
    return json.setKeyNotExists(
        obj,
        config.db.keys.statusDoc.name,
        config.db.keys.statusDoc.value);
}

const setJsonCreatedDate = (obj) => {
    return json.setKeyNotExists(
        obj,
        config.db.keys.dateCreated.name,
        new Date());
}

/* const getSequence = async (client, db, collection, callback) => {
    //let collections = (await client.db(db).listCollections().toArray()).map(collection => collection.name);
    try {
        let collections = await client.db(db).listCollections().toArray();
        let seqResult = {
            _id: collection,
            seq: 0
            };
    
        if(collections.map(collection => collection.name).filter(item => item == config.db.tables.sequences).length === 0) 
            await client.db(db).collection(config.db.tables.sequences).insertOne(seq);
         
        await client.db(db).collection(config.db.tables.sequences).updateOne(
                { _id: collection },
                { $inc: { seq: 1 } }, 
                ((e, result) => {
                    if(e) throw new Error(e);
                    console.log('result', result);
                    seqResult = result;
                    console.log('seqResult1', seqResult);
                    resolve(result);
                })
            ).then(result => {
                console.log('then', result);
            });

            console.log('seqResult2', seqResult);
        await client.db(db).collection(config.db.tables.sequences).findOne( 
            { _id: collection}, 
            (e, result) => {
                if(e) throw new Error(e);
                
                console.log('result3', result);
            })

        console.log('seqResult4 ', seqResult);
        
        return seqResult.seq; 

    }
    catch(e) {
        console.log(e);
    }
}


const execute = async (callbackExecute, client, db, collection, document, set) => {
    let clientExecute = (client ? client : await getClient())
    try {
        if(set) {
            return getResult(
                'success',
                await callbackExecute(
                    clientExecute, 
                    db, 
                    collection, 
                    document,
                    set
                )            
            )
        }

        return getResult(
            'success',
            await callbackExecute(
                clientExecute, 
                db, 
                collection, 
                document
            )            
        )
    } 
    catch (e) {
        //console.log('execute', e);
        return getResult(
            'error',
            e
        )
    } 
}


const insertAsync = (client, db, collection, document) => {
    if(Array.isArray(document))
        return new Promise((resolve, reject) => {
            client.db(db).collection(collection).insertMany(document, e => {
                if(e) reject(e);
                resolve(document);
            });
        })

    return new Promise((resolve, reject) => {
        client.db(db).collection(collection).insertOne(document, e => {
            if(e) reject(e);
            resolve(document);
        });
    })
}

const insert = async (collection, document, client) => {
    return await execute(
        insertAsync,
        client,
        config.db.name,
        collection,
        document
    )
} 

const updateAsync = (client, db, collection, query, set) => {
    return new Promise((resolve, reject) => {
        client.db(db).collection(collection).updateMany(
            query, 
            set, 
            (e, result) => {
                if(e) reject(e);
                resolve(result);
                //resolve(find(collection, query, client));
            }
        );
    })
}

const update = async (collection, query, set, client) => {
    return await execute(
        updateAsync,
        client,
        config.db.name,
        collection,
        query,
        set
    )
} 

const findAsync = (client, db, collection, query) => {
    return new Promise((resolve, reject) => {
        client.db(db).collection(collection).find(query).toArray((e, result) => {
            if(e) reject(e);
            resolve(result);
        });
    })
}

const find = (collection, query, client) => {
    return execute(
        findAsync,
        client,
        config.db.name,
        collection,
        query ? query : {}
    )
}

module.exports = {
    getClient,
    getObjectId,
    getResult,
    setJsonStandard,
    setJsonCreatedDate,
    setJsonStatusCod,
    //getSequence
    find,
    insert,
    update
}  */