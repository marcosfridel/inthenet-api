const AuthGoogle = (passport) => {
    
    const GoogleStrategy = require('passport-google-oidc').Strategy;

    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.PASSPORT_GOOGLE_CLIENT_ID,
                clientSecret: process.env.PASSPORT_GOOGLE_CLIENT_SECRET,
                callbackURL: `${process.env.SERVER_URL}${process.env.PASSPORT_GOOGLE_CALLBACK}/callback`,
                realm: `${process.env.SERVER_URL}`
            },
            async (issuer, profile, done) => {
    /*             console.log('profile', profile)
                console.log('issuer', issuer) */
                done(null, profile);

            }
        )
    );
    
}

module.exports = AuthGoogle;
