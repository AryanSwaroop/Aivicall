const express = require('express');
const app = express();
const router = express.Router();
const model = require('../Model/userSchema.js');
const db = require('../DB/db.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const fs = require('fs');
const multer  = require('multer');
const database = new db();
const fileModel = require('../Model/fileSchema.js');
const cors = require('cors');

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

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix + '.jpg')
    }
});

const upload = multer({ storage: storage })

router.post("/register", upload.single("ProfilePic") , (req,res) => {

    let { FirstName, LastName, Email, Password } = req.body;
    let { name, type, files, value } = req.file;

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
                        console.log(err);
                        console.log(user);
                    }
                    else {    
                     res.cookie("token" , token);
                     res.status(200).json({message: "User registered successfully"});
                    }
                })
            })
            .catch((err) => {
                res.status(500).json({message: "User registration failed"});
                console.log(err);
            });

            const file = new fileModel({
            filename: name,
            contentType: type,
            data: files, // Binary data
            });

            database.connect();
            file.save();
            
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

        const token = jwt.sign({ userId: found._id }, process.env.JWT_SECRET, { expiresIn: '2000s' });

        // Set cookie and send token in response
        res.cookie("token", token, {
            httpOnly: false,  // Allow JavaScript access
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none',
            secure: 'true'
        });
        
        res.status(200).json({
            message: "User logged in successfully",
            token: token  // Send token in response
        });

    } catch (err) {
        return res.status(500).json({ message: "Login failed", error: err.message });
    }
});

router.post("/logout", async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "Strict"
    });
    res.status(200).json({ message: "Logged out successfully" });
});

module.exports = router;