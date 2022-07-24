const contentRouter = require('express').Router();
const contentLib  = require('../lib/content');

const json  = require('../lib/json');

contentRouter.post('/list', async (req, res) => {
    return json.sendResponse(
        await contentLib.list(
            req.body
        ),
        res
    );
})

contentRouter.post('/listByLanguage', async (req, res) => {
    return json.sendResponse(
        await contentLib.listByLanguage(
            req.body
        ),
        res
    );    
})

contentRouter.get('/:id', async (req, res) => {
    return json.sendResponse(
        await contentLib.get(
            req.params.id
        ),
        res
    );
})

contentRouter.post('/create', async (req, res) => {
    return json.sendResponse(
        await contentLib.insert(
            req.body
        ),
        res
    );
})


module.exports = contentRouter;