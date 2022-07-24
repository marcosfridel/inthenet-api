const AuthInstagram = (passport) => {
    
    const InstagramStrategy = require('passport-instagram').Strategy;

    passport.serializeUser(function(user, done) {
        done(null, user);
    });
    
    passport.deserializeUser(function(user, done) {
        done(null, user);
    });
    
    //console.log('callback ig', `${process.env.SERVER_URL}${process.env.PASSPORT_INSTAGRAM_CALLBACK}/callback`)
    
    passport.use(
        new InstagramStrategy(
            {
                clientID: process.env.PASSPORT_INSTAGRAM_CLIENT_ID,
                clientSecret: process.env.PASSPORT_INSTAGRAM_CLIENT_SECRET,
                callbackURL: `${process.env.SERVER_URL}${process.env.PASSPORT_INSTAGRAM_CALLBACK}/callback`,
                profileFields: ["email", "name", "photos", "profileUrl"]
            },
            async (accessToken, refreshToken, profile, done) => {
                console.log('profile', profile)
                done(null, profile);
    
            }
        )
    );
}

module.exports = AuthInstagram;