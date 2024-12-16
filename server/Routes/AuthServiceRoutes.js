const express = require('express');
const router = express.Router();
const AuthService = require('../services/AuthService');
const passport = require('passport');
const API_ENDPOINTS = require('../API/endpoints');

const authService = new AuthService();

router.use(passport.initialize());
router.use(passport.session());

router.get("/login/failed", (req,res)=>{
    res.status(401).json({
        success: false,
        message: "failure",
    })
});

router.get("/google/callback", passport.authenticate("google",{
    scope:["profile"],
    successRedirect: API_ENDPOINTS.AUTH_SUCCESS_ROUTE,
    failureRedirect:"/login/failed"
}));


module.exports = router;
