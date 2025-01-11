const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
require('dotenv').config();
const API_ENDPOINTS = require('../API/endpoints');
const localStorage = new Map();
const fs = require('fs');
const model = require('../Model/userSchema');
const db = require('../DB/db'); 
const jwt = require('jsonwebtoken');

const saveProfile = (received) => {

     const jsonData = received;
     fs.writeFileSync('data.json', JSON.stringify(jsonData, null, 2), 'utf-8');
     console.log('JSON data saved to file.');

}

const database = new db();

class AuthService {
    
    constructor() {

        passport.use(new GoogleStrategy({
            clientID: process.env.CLIENTID,
            clientSecret: process.env.CLIENTSECRET,
            callbackURL: API_ENDPOINTS.BACK_CALLBACK
        }, (token, refreshToken, profile, done) => {

            console.log('===== GOOGLE PROFILE =======');

            saveProfile(profile);

            console.log(profile);

            const { id , name , emails } = profile;

            const user = new model({
                FirstName : name.givenName,
                LastName : name.familyName,
                Email : emails,
                Password : id,
            });
            
            console.log(user);
            database.connect();
            user.save()

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

}

module.exports = AuthService;
