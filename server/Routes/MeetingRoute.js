const express = require("express");
const router = express.Router();
const AuthService = require('../services/AuthService');
const fs = require('fs'); 

router.get("/meetcode", (req,res) => {

    fs.readFile('data.json', 'utf-8', (err, data) => {
        if (err) {
            console.error('Error reading the file:', err);
            return;
        }
    
        const jsonData = JSON.parse(data);
         res.send(jsonData);

    });

    fs.unlink('data.json', (unlinkErr) => {
        if (unlinkErr) {
            console.error('Error deleting the file:', unlinkErr);
        } else {
            console.log('File deleted successfully.');
        }
    });
    
});

module.exports = router;
