const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
require('dotenv').config();
const API_ENDPOINTS = require('../API/endpoints');

class AuthService {
    constructor() {
        passport.use(new GoogleStrategy({
            clientID: process.env.CLIENTID,
            clientSecret: process.env.CLIENTSECRET,
            callbackURL: API_ENDPOINTS.BACK_CALLBACK
            
        }, (token, refreshToken, profile, done) => {
            console.log('===== GOOGLE PROFILE =======');
            this.profileData = profile; // Correctly refers to the AuthService instance
            console.log(profile);
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
        console.log(this.profileData);
        return this.profileData;
    }
}


module.exports = AuthService;
