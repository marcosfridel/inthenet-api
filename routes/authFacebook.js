const authFacebookRouter = require("express").Router();

const authLib = require('../lib/auth')
const redirect  = require('../lib/redirect');

const AuthFacebook = (passport) => {
    
    require('../lib/authFacebook')(passport);

    authFacebookRouter.get(
        "/fb/signin",
        passport.authenticate(
            "facebook"
        )
    );

    authFacebookRouter.get("/fb/callback", 
        passport.authenticate(
            "facebook", 
            { 
                failureRedirect: "/fb/failed"
            }
        ),
        async (req, res) => {
            //console.log(req.user);
            if(!req.user) {
                return redirect.send(
                    res, 
                    `${process.env.CLIENT_URL}${process.env.CLIENT_AUTH_CALLBACK}/failed`
                )
            }

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

    return authFacebookRouter;
}
    
module.exports = AuthFacebook;

/* require('../lib/authFacebook');

const authFacebookRouter = require("express").Router();
const passport = require("passport");

const authLib = require('../lib/auth')

const redirect  = require('../lib/redirect');

authFacebookRouter.get(
    "/fb/signin",
    passport.authenticate(
        "facebook", 
        { 
        session: false,
        failureRedirect: `${process.env.CLIENT_URL}${process.env.CLIENT_AUTH_CALLBACK}/failed`, 
        failureMessage: true    
        }
    )
);

authFacebookRouter.get("/fb/callback", 
    passport.authenticate(
        "facebook", 
        { session: false }
    ),
    async (req, res) => {

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

module.exports = authFacebookRouter;
 */