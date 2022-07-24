const userRouter = require('express').Router();
const userLib = require('../lib/user')

const json  = require('../lib/json');


userRouter.get('/list', async (req, res) => {
    //console.log('userLib')
    return json.sendResponse(
        await userLib.list(
            req.body
        ),
        res
    );
})

userRouter.get('/:id', async (req, res) => {
    return json.sendResponse(
        await userLib.get(
            req.params.id
        ),
        res
    );
})

userRouter.post('/create', async (req, res) => {
    return json.sendResponse(
        await userLib.insert(
            req.body
        ),
        res
    );
})

userRouter.put('/update', async (req, res) => {
    return json.sendResponse(
        await userLib.update(
            req.body.id,
            req.body
        ),
        res
    );    
/*     user.update(req.params.id, req.body, (result) => {
        res.json(result);
    }) */
}); 

/*     //console.log(params);
    const itemModel = new modelMongoose();
    Object.keys(params).map(key => {
        itemModel[key] = params[key]
    })



    const { error } = schemaJoi.validate(req.body)
    if (error) {
        res.status(400).json(
            json.getResult(
                'error',
                error.details[0].message
            )
        )
    }

    if (await modelMongoose.findOne(
        { $or: [{email: itemModel.email}] }
        )) {
        res.status(400).json(
            json.getResult(
                'error',
                'Correo electrónico ya registrado' 
            )
        )
    }
     res.json(
        json.getResult(
            'success',
            'test' 
        )
    )
    return; 
    try {
        res.json(
            json.getResult(
                'success',
                await user.save()
            )
        )
    } catch (e) {
        res.status(400).json(
            json.getResult(
                'error', 
                'Error Post userRouter', 
                e
            )
        )
    } 
});
*/
/* userRouter.put('/:id', (req, res) => {
    user.update(req.params.id, req.body, (result) => {
        res.json(result);
    })
}); 
 */
module.exports = userRouter;