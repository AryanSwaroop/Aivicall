const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
require('dotenv').config();

const profileData = null;

class AuthService {
    constructor() {
        passport.use(new GoogleStrategy({
            clientID: process.env.CLIENTID,
            clientSecret: process.env.CLIENTSECRET,
            callbackURL: "https://aivicall.onrender.com/auth/google/callback"
        }, (token, refreshToken, profile, done) => {
            console.log('===== GOOGLE PROFILE =======');
            profileData = profile;
            console.log('======== END ===========');
            done(null, profile);
        }));

        passport.serializeUser((user, done) => {
            done(null, user);
        });

        passport.deserializeUser((user, done) => {
            done(null, user);
        });

    }

    getProfileData() {
        return this.profileData;
    };

}

module.exports = AuthService;
