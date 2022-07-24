const authLocal = require('../lib/authLocal');

const authLocalRouter = require('express').Router();

const authLib = require('../lib/auth')

const redirect  = require('../lib/redirect');

authLocalRouter.post(
    '/local/signin', 
    authLocal.authenticate(
        'local', 
        {
        failureRedirect: `${process.env.CLIENT_URL}${process.env.CLIENT_AUTH_CALLBACK}/authfailed`, 
        failureMessage: true    
        } 
    ),
    async (req, res) => {
        if(!req.user) {
            return redirect.send(
                res, 
                `${process.env.CLIENT_URL}${process.env.CLIENT_AUTH_CALLBACK}/userinvalid`
            )
        }

        const result = 
            await authLib.getTokenJwt(
                req.user
            )

        return redirect.send(
            res, 
            result.type == 'success' ?
            `${process.env.CLIENT_URL}${process.env.CLIENT_AUTH_CALLBACK}/${result.token.token}` :
            `${process.env.CLIENT_URL}${process.env.CLIENT_AUTH_CALLBACK}/userinvalid`
        )
    }
)

module.exports = authLocalRouter;