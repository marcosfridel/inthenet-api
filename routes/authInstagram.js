const authInstagramRouter = require("express").Router();

const authLib = require('../lib/auth')
const redirect  = require('../lib/redirect');

const AuthInstagram = (passport) => {

    require('../lib/authInstagram')(passport);

    authInstagramRouter.get(
        "/ig/signin",
         passport.authenticate(
            "instagram", 
    /*         { 
            session: false,
            failureRedirect: `${process.env.CLIENT_URL}${process.env.CLIENT_AUTH_CALLBACK}/failed`, 
            failureMessage: true    
            }  */
        )
    );
    
    authInstagramRouter.get("/ig/callback", 
        passport.authenticate(
            "instagram"
        ),
        async (req, res) => {
            console.log('callback')
            if(!req.user) {
                return redirect.send(
                    res, 
                    `${process.env.CLIENT_URL}${process.env.CLIENT_AUTH_CALLBACK}/failed`
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
                `${process.env.CLIENT_URL}${process.env.CLIENT_AUTH_CALLBACK}/failed`
            )
    
        }
    );

    return authInstagramRouter;
}

module.exports = AuthInstagram;
