const express = require("express");
const router = express.Router();
const AuthService = require('../services/AuthService');

const authServiceProfile = new AuthService();
const meetCode = authServiceProfile.getProfileData(); 

router.get("/meetCode", (req,res) => {
    res.send(meetCode);
});

module.exports = router;
