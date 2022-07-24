const AuthFacebook = (passport) => {
    
    const FacebookStrategy = require('passport-facebook').Strategy;
            
    passport.use(
        new FacebookStrategy(
            {
                clientID: process.env.PASSPORT_FACEBOOK_CLIENT_ID,
                clientSecret: process.env.PASSPORT_FACEBOOK_CLIENT_SECRET,
                callbackURL: `${process.env.SERVER_URL}${process.env.PASSPORT_FACEBOOK_CALLBACK}/callback`,
                //state: false,
                profileFields: ["email", "name", "photos", "profileUrl"]
            },
            async (accessToken, refreshToken, profile, done) => {
    /*             console.log('profile', profile)
                console.log('issuer', issuer) */
                done(null, profile);

            }
        )
    );
    
}

module.exports = AuthFacebook;
  
  // Estrategia para Iniciar Sesion
  
/* passport.use(
    "sign-up-facebook",
    new FacebookStrategy(
        {
            clientID: process.env.PASSPORT_FACEBOOK_CLIENT_ID,
            clientSecret: process.env.PASSPORT_FACEBOOK_CLIENT_SECRET,
            callbackURL: `${process.env.SERVER_URL}${process.env.PASSPORT_FACEBOOK_CALLBACK}/signin`,
            enableProof: true,
            //profileFields: ["email", "name", "photos"],
            profileFields: ['id', 'name', 'photos', 'email']
        },
        async (accessToken, refreshToken, profile, done) => {

            return done(null, profile); 

        }
    )
);
 */

/* const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

//console.log(`${process.env.SERVER_URL}${process.env.PASSPORT_FACEBOOK_CALLBACK}/callback`)

passport.use(
    new FacebookStrategy(
        {
            clientID: process.env.PASSPORT_FACEBOOK_CLIENT_ID,
            clientSecret: process.env.PASSPORT_FACEBOOK_CLIENT_SECRET,
            callbackURL: `${process.env.SERVER_URL}${process.env.PASSPORT_FACEBOOK_CALLBACK}/callback`,
            state: false,
            profileFields: ["email", "name", "photos", "profileUrl"]
        },
        async (accessToken, refreshToken, profile, done) => {

            done(null, profile);

        }
    )
);
 */  
  // Estrategia para Iniciar Sesion
  
/* passport.use(
    "sign-up-facebook",
    new FacebookStrategy(
        {
            clientID: process.env.PASSPORT_FACEBOOK_CLIENT_ID,
            clientSecret: process.env.PASSPORT_FACEBOOK_CLIENT_SECRET,
            callbackURL: `${process.env.SERVER_URL}${process.env.PASSPORT_FACEBOOK_CALLBACK}/signin`,
            enableProof: true,
            //profileFields: ["email", "name", "photos"],
            profileFields: ['id', 'name', 'photos', 'email']
        },
        async (accessToken, refreshToken, profile, done) => {

            return done(null, profile); 

        }
    )
);
 */