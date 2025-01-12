const express = require('express');
const app = express();
const router = express.Router();
const model = require('../Model/userSchema');
const db = require('../DB/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const fs = require('fs');

const database = new db();

let data = {
    id : String,
    displayName : String,
    name : {
        familyName : String,
        givenName : String
    }
}

const saveProfile = async (received) => {
    data.displayName = `${received.FirstName} ${received.LastName}`;
    data.id = received._id;
    data.name.familyName = received.LastName;
    data.name.givenName = received.FirstName;

    try {
        await fs.promises.writeFile('data.json', JSON.stringify(data, null, 2), 'utf-8');
        console.log('JSON data saved to file.');
    } catch (err) {
        console.error("Error saving profile data:", err);
    }
};


router.post("/register", (req,res) => {

    let { FirstName, LastName, Email, Password } = req.body;

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(Password, salt, (err, hash) => {

            if(err) {
                res.status(500).json({message: "Password encryption failed"});
            }

            const user = new model({
                FirstName,
                LastName,
                Email,
                Password: hash
            });

            console.log(user);
            database.connect();
            saveProfile(user);
            user.save()

            .then(() => {
                jwt.sign( { userID : user._id }, process.env.JWT_SECRET, {expiresIn : '60s'} , (err, token) => {
                    if(err) {
                        res.status(500).json({message: "Token generation failed"});
                    }
                    res.cookie("token" , token);
                })
            })
            .catch((err) => {
                res.status(500).json({message: "User registration failed"});
            });
            
        });
    });

});


router.post("/login", async (req, res) => {
    const { Email, Password } = req.body;

    if (req.cookies.token) {
        return res.status(200).json({ message: "User already logged in" });
    }

    try {
        const found = await model.findOne({ Email });
        if (!found) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = bcrypt.compare(Password, found.Password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: found._id }, process.env.JWT_SECRET, { expiresIn: '60s' });
        res.cookie("token", token);
        return res.status(200).json({ message: "Login successful", user: found });
    } catch (err) {
        return res.status(500).json({ message: "Login failed", error: err.message });
    }
});

router.post("/login", async (req, res) => {
    res.clearCookie("token");
});



module.exports = router;