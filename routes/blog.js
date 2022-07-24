const blogRouter = require('express').Router();
const blogLib  = require('../lib/blog');

const json  = require('../lib/json');

// AUTH
const auth = require('../lib/auth');
 
blogRouter.post('/', (req, res, next) => {
    res.redirect(301, '/blog/post/list');
})
 
blogRouter.post('/post/list', auth.verify, async (req, res, next) => {
    return json.sendResponse(
        await blogLib.list(
            req.body
        ),
        res
    ); 
})

blogRouter.get('/post/:id', async (req, res) => {
    return json.sendResponse(
        await blogLib.get(
            req.params.id
        ),
        res
    );
});

blogRouter.post('/post/create', async (req, res) => {
    return json.sendResponse(
        await blogLib.insert(
            req.body
        ),
        res
    );
});

blogRouter.post('/post/comment/create', async (req, res) => {
    let id = req.body.id;
    let params = json.deleteKey(req.body , 'id');

    return json.sendResponse(
        await blogLib.insertComment(
            id,
            params
        ),
        res
    ); 
});


module.exports = blogRouter;