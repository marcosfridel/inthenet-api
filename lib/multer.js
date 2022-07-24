//npm install multer
const fs = require('fs');
const multer = require('multer');

const fileModel  = require('../models/file');
const db  = require('./db');

const getStorage = (folder) => {
    //console.log((folder === undefined ? process.env.MULTER_UPLOAD_FOLDER : folder));
    return multer.diskStorage({
        destination: function (req, file, cb) {
            //console.log('folder', (folder === undefined ? process.env.MULTER_UPLOAD_FOLDER : folder))
            cb(null, (folder === undefined ? process.env.MULTER_UPLOAD_FOLDER : folder))
        },
        filename: function (req, file, cb) {
            let ext = file.originalname.split('.');
            ext = ext.length > 1 ? `.${ext[ext.length - 1]}` : '';
            
            //console.log(`${process.env.MULTER_UPLOAD_NAME_DEFAULT}_${Date.now()}${ext}`);
            //cb(null, `${file.fieldname}-${Date.now()}${ext}`);
            cb(null, `${process.env.MULTER_UPLOAD_NAME_DEFAULT}_${Date.now()}${ext}`);
        }
    })  
}

const getUpload = (folder) => {
    return multer({ 
        storage: getStorage(folder) 
    })
}

const insert = async (req) => {
    let file = fs.readFileSync(req.file.path);
    
    let data = {
        ...req.file,
        binary: Buffer.from(file.toString('base64'), 'base64')
    };
    //console.log(data);

    return await db.insert(
        fileModel, 
        data
    )
}

const getUploadSingle = (name, folder) => {
    //console.log('name', name)
    return getUpload(folder).single(name);
}
const getUploadMultiple = (name, folder, count) => {
    if(!Number.isInteger(count)) count = 99;
    return getUpload(folder).array(name, count);
}

module.exports = {
    getUploadSingle,
    getUploadMultiple,
    insert
}



/* 

const multer = require('./lib/multer');
app.post('/uploadfile', multer.getUploadSingle('myFile'), async (req, res, next) => {
    const file = req.file
    if (!file) {
      const error = new Error('Please upload a file')
      error.httpStatusCode = 400
      return next(error)
    }

    const data = await multer.insert(req);

    res.send(data)
    
}) 

app.post('/uploadfile', multer.getUploadMultiple('myFile', 3), (req, res, next) => {
    const files = req.files
    if (!files) {
      const error = new Error('Please upload a file')
      error.httpStatusCode = 400
      return next(error)
    }
    res.send(files)
    
}) 

*/