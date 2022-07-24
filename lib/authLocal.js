const passport = require('passport');
const StrategyLocal = require('passport-local').Strategy;

const userLib = require('./user');

const hash = require('./hash');
const json = require('./json');

passport.serializeUser((user, done) => {
    //console.log('user serializeUser', user);
    done(null, user);
})

passport.deserializeUser((user, done) => {
    //console.log('user deserializeUser', user);
    done(null, user)
})

passport.use(
    new StrategyLocal(async (username, password, done) => {
        const params = {
            email: username,
            limit: 1,
            statusDoc: 0
        }

        const user = await userLib.list(
            params
        );

        if(user.result.length == 0) {
            return done(null, false,
                json.getResult(
                    'error',
                    'Usuario no válido.',
                    401
                )
            )
        }

/*         if (!await userModel.password().compare(
                password,
                user.result.password)) {
            return done(null, false,
                json.getResult(
                    'error',
                    'Password no válido.',
                    401
                )
            )
        } */

        return done(
            null,
            {
                id: user.result._id,
                loginprovider: 'local'
            }
        )

/*         let login = await db.get(
            loginModel, 
            user.result._id
        ); */

/*         if(login.result.length == 0) {
            login = await db.insert(
                loginModel,
                { 
                    userId: db.getObjectId(user.result._id) 
                }
            )
        }    
        const sessionId = hash.getSessionId(user.result._id);
        const dateLoginEnd = (new Date()).setHours((new Date()).getHours() + 1); */
/* 
        let loginOk = await db.update(
            loginModel,
            login.result._id,
            { 
                sessionId: sessionId,
                dateLoginEnd: dateLoginEnd
            }
        )
        user.result = json.deleteKey(user.result, 'password'); */
        
        //loginOk = { user: user.result, login}
/*         loginOk = { 
            user: user.result, 
            login: login.result,
            loginprovider: 'local'
        };
        loginOk.login.sessionId = sessionId;
        loginOk.login.dateLoginEnd = dateLoginEnd; */

        return done(null, loginOk);
    })
);

module.exports = passport;