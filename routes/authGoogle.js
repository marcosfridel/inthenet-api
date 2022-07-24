const authGoogleRouter = require("express").Router();

const authLib = require('../lib/auth')
const redirect  = require('../lib/redirect');

const AuthGoogle = (passport) => {
    
    require('../lib/authGoogle')(passport);

    authGoogleRouter.get(
        "/google/signin",
        passport.authenticate(
            "google", 
            { 
            unregistered: true,
            failureRedirect: `${process.env.CLIENT_URL}${process.env.CLIENT_AUTH_CALLBACK}/failed`, 
            failureMessage: true,
            scope: [ 'email', 'profile' ] 
            }
        )
    );
    
    authGoogleRouter.get("/google/callback", 
        passport.authenticate(
            "google", 
            { unregistered: true }
        ),
        async (req, res) => {
            //console.log(req.user);
            if(!req.user) {
                return redirect.send(
                    res, 
                    `${process.env.CLIENT_URL}${process.env.CLIENT_AUTH_CALLBACK}/failed`
                )
            }
    
            req.user['provider'] = 'google';
            //console.log('req.user', req.user)
    
            const result = 
                await authLib.getTokenJwt(
                    req.user
                )
    
            return redirect.send(
                res, 
                result.type == 'success' ?
                `${process.env.CLIENT_URL}${process.env.CLIENT_AUTH_CALLBACK}/${result.token.token}` :
                `${process.env.CLIENT_URL}${process.env.CLIENT_AUTH_CALLBACK}/failed`
            )
    
        }
    );
    
    return authGoogleRouter;

}

module.exports = AuthGoogle