const fileRouter = require('express').Router();
const fileLib  = require('../lib/file');

const fs = require('fs');

const json  = require('../lib/json');
 
fileRouter.post('/list', async (req, res, next) => {
    console.log('list')
    return json.sendResponse(
        await fileLib.list(
            req.body
        ),
        res
    )
})

fileRouter.get('/get/:id', async (req, res) => {
    return json.sendResponse(
        await fileLib.get(
            req.params.id
        ),
        res
    );
})

fileRouter.get('/getdata/:id', async (req, res) => {
    return json.sendResponse(
        await fileLib.getData(
            req.params.id
        ),
        res
    );
})

/* fileRouter.get('/getbinary/:id', async (req, res) => {
    const file = await fileLib.get(
        req.params.id
    )

    res.contentType(file.result.mimetype);
    res.send(file.result.binary)
}) */

const multer = require('../lib/multer');
fileRouter.post('/upload', multer.getUploadSingle('file', 'files'), async (req, res) => {
    //console.log('req.file', req)
    if (!req.file){
        return json.sendResponse(
            json.getResultError(
                'Error al subir archivo', 
                'Seleccione un archivo a subir'
            ),
            res
        )
    }

    return json.sendResponse(
        await fileLib.insert(
            req.file
        ),
        res
    );


/* 
    return json.sendResponse(
        json.getResult(
            fs.existsSync(req.file.path) ? 'success' : 'error', 
            fs.existsSync(req.file.path) ? 'Archivo subido correctamente' : 'Error al subir archivo'
        ),
        res
    ) */
}) 

fileRouter.post('/uploadmultiple', multer.getUploadMultiple('files', 'files'), async (req, res) => {
    //console.log('req.file', req)
    if (!req.files){
        return json.sendResponse(
            json.getResultError(
                'Error al subir los archivos', 
                'Seleccione un archivo a subir'
            ),
            res
        )
    }

    let result = []
    for(let i = 0; i < req.files.length; i++)
        result.push(
            await fileLib.insert(
                req.files[i]
            )
        )

    return json.sendResponse(
        json.getResult(
            'success', 
            result
        ),
        res
    )
}) 

fileRouter.post('/import', multer.getUploadSingle('fileimport', './import/process'), async (req, res) => {
    if (!req.file) {
        return json.sendResponse(
            json.getResultError(
                'Error file.import', 
                'Seleccione un archivo a importar'
            ),
            res
        )
    }
    
    const collection = req.body.collection;
    console.log('req.body', req.body)
    console.log('collection', collection)
    let result = await fileLib.importJson(
        collection, 
        req.file.path
    )

    result.message = 
        result.type === 'success' ?
        'La importación se ha llevado a cabo correctamente':
        'La importación ha tenido errores';
    result.count = result.result.insertedCount;

    return json.sendResponse(
        result,
        res
    );

}) 

module.exports = fileRouter;