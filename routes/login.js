const nodemailer = require('nodemailer');
const loginRouter = require('express').Router();

const loginModel = require('../models/login');
const userModel = require('../models/user');

const db = require('../lib/db');
const json = require('../lib/json');
const hash = require('../lib/hash');

/* loginRouter.get('/', async (req, res) => {

    const paramsLogin = {
        email: req.body.email,
        //password: req.body.password,
        limit: 1,
        statusDoc: 0
    }

    const user = await db.list(
        userModel, 
        paramsLogin
    );

    if(user.result.length == 0) {
        return json.sendResponse(
            json.getResult(
                'error',
                'Usuario no válido.',
                401
            ),
            res
        )
    }

    if (!await userModel.password().compare(
            req.body.password,
            user.result.password)) {
        return json.sendResponse(
            json.getResult(
                'error',
                'Password no válido.',
                401
            ),
            res
        )
    }

    let login = await db.get(
        loginModel, 
        user.result._id
    );

    if(login.result.length == 0) {
        login = await db.insert(
            loginModel,
            { 
                userId: db.getObjectId(user.result._id) 
            }
        )
    }
    
    const sessionId = hash.getSessionId(user.result._id);
    const dateLoginEnd = (new Date()).setHours((new Date()).getHours() + 1);

    let loginOk = await db.update(
        loginModel,
        login.result._id,
        { 
            sessionId: sessionId,
            dateLoginEnd: dateLoginEnd
        }
    )
    user.result = json.deleteKey(user.result, 'password');
    
    //loginOk = { user: user.result, login}
    loginOk = { 
        user: user.result, 
        login: login.result
    };
    loginOk.login.sessionId = sessionId;
    loginOk.login.dateLoginEnd = dateLoginEnd;

    return json.sendResponse(
        json.getResult(
            'success',
            loginOk,
            400
        ),
        res
    )
    
})
 */


loginRouter.post('/forget', async (req, res) => {

    const paramsLogin = {
        email: req.body.email,
        //password: req.body.password,
        limit: 1,
        statusDoc: 0
    }
    //console.log(paramsLogin);
    const user = await db.list(
        userModel, 
        paramsLogin
    );

    if(user.result.length == 0) {
        return json.sendResponse(
            json.getResult(
                'error',
                'Usuario no válido.',
                401
            ),
            res
        )
    }

    let login = await db.get(
        loginModel, 
        user.result._id
    );

    if(login.result.length == 0) {
        login = await db.insert(
            loginModel,
            { 
                userId: db.getObjectId(user.result._id) 
            }
        )
    }

    const keyActivate = hash.getKeyActivate();

    //const sessionId = hash.getSessionId(user.result._id);
    const dateActivateEnd = (new Date()).setHours((new Date()).getHours() + 24);
    
    let forgetOk = await db.update(
        loginModel,
        login.result._id,
        { 
            keyActivate: keyActivate,
            keyActivateUse: false,
            dateActivateCreated: (new Date()).now,
            dateActivateEnd: dateActivateEnd
        }
    )
    //console.log('login.result._id', login.result._id);
    //console.log('forgetOk', forgetOk);
    user.result = json.deleteKey(user.result, 'password');
    
    //forgetOk = { user: user.result, login}
    forgetOk = { user: user.result, login: login.result };
    forgetOk.login.keyActivate = keyActivate;
    forgetOk.login.dateActivateEnd = dateActivateEnd;

/*     let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'marcosfridel@gmail.com',
          pass: ''
        }
    });
      
    let mailOptions = {
        from: 'marcosfridel@gmail.com',
        to: user.mail,
        subject: 'Ha olvidado su password',
        html: `Key de activación:<br>${keyActivate}`
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            return res.status(400).json(
                json.getResult(
                    'error',
                    `No se ha podido enviar mail con el código de activación.<br><br>Motivo:<br>${error}`
                )
            )
        }

        return res.status(400).json(
            json.getResult(
                'success',
                forgetOk
            )
        )
    });  */
    
    return json.sendResponse(
        json.getResult(
            'success',
            forgetOk,
            400
        ),
        res
    )
})


loginRouter.post('/activate', async (req, res) => {

    const paramsLogin = {
        email: req.body.email,
        //password: req.body.password,
        limit: 1,
        statusDoc: 0
    }

    const user = await db.list(
        userModel, 
        paramsLogin
    );

    if(user.result.length == 0) {
        return json.sendResponse(
            json.getResult(
                'error',
                'Usuario no válido.',
                401
            ),
            res
        )
    }

    let login = await db.list(
        loginModel, 
        { 
            userId: user.result._id,
            keyActivate: req.body.keyActivate,
            statusDoc: 0
        }
    );


    if(login.result.length == 0) {
        return json.sendResponse(
            json.getResult(
                'error',
                'Código de activación no válido.',
                401
            ),
            res
        )
    }

    //const sessionId = hash.getSessionId(user.result._id);
    let activateOk = await db.update(
        loginModel,
        login.result._id,
        { 
            dateActivateOk: (new Date()).now,
            keyActivateUse: true
        }
    )

    user.result = json.deleteKey(user.result, 'password');
    
    //forgetOk = { user: user.result, login}
    activateOk = { user: user.result, login: login.result };

/*     let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'marcosfridel@gmail.com',
          pass: ''
        }
    });
      
    let mailOptions = {
        from: 'marcosfridel@gmail.com',
        to: user.mail,
        subject: 'Ha olvidado su password',
        html: `Key de activación:<br>${keyActivate}`
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            return res.status(400).json(
                json.getResult(
                    'error',
                    `No se ha podido enviar mail con el código de activación.<br><br>Motivo:<br>${error}`
                )
            )
        }

        return res.status(400).json(
            json.getResult(
                'success',
                forgetOk
            )
        )
    });  */
    
    return json.sendResponse(
        json.getResult(
            'success',
            activateOk,
            400
        ),
        res
    )
})

module.exports = loginRouter;