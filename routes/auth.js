const authRouter = require("express").Router();

const authLib = require('../lib/auth')
const loginLib = require('../lib/login')
const userLib = require('../lib/user')

const json = require('../lib/json')
const redirect  = require('../lib/redirect');
const { LogInstance } = require("twilio/lib/rest/serverless/v1/service/environment/log");

const Auth = (passport) => {

    passport.serializeUser((user, done) => {
        //console.log('serializeUser OK ', user)
        done(null, user);
    });

    passport.deserializeUser((user, done) => {
        //console.log('deserializeUser OK', user)
        done(null, user);
    });

    authRouter.post('/gettoken', async (req, res, next) => {
        next();
    })
    
    authRouter.get('/gettoken', async (req, res, next) => {
        next();
    })
    
    authRouter.use('/gettoken', async (req, res, next) => {
        res.send('authRouter use gettoken');
    })
    
    authRouter.get('/status', async (req, res, next) => {
        let token = authLib.getToken(req);
        const login = await loginLib.status(token)

        if(!login.count)
            return json.sendResponse(
                json.getResult(
                    'error',
                    'Sesión no válida'
                ),
                res
            )
        //console.log('login', login)
        const user = await userLib.get(
            { 
                _id: login.result.userid2,
                statuscod: 0
             }
        )

        if(!user.count)
            return json.sendResponse(
                json.getResult(
                    'error',
                    'Usuario no habilitado'
                ),
                res
            )

        return json.sendResponse(
            json.getResult(
                'success',
                {
                    login: {},
                    user: {
                        email: user.result.email,
                        firstname: user.result.firstname,
                        lastname: user.result.lastname,
                        loginprovider: user.result.loginprovider
                    }
                }
            ),
            res
        )
    });
    
    authRouter.get('/logout', async (req, res, next) => {
        let token = authLib.getToken(req);

        console.log('logout token ', token)
        login = await loginLib.update(
            {
                token: token,
            },
            {
                statuscod: 1
            }
        )


        if(login.count)
            return json.sendResponse(
                json.getResult(
                    login.type,
                    'Sesión cerrrada correctamente.',
                ),
                res
            )

        return json.sendResponse(
            json.getResult(
                'error',
                'Problemas para cerrar sesión.',
            ),
            res
        )
    });

    return authRouter
}


module.exports = Auth;