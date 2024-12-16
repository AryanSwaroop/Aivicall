const express = require('express');
const router = express.Router();
const AuthService = require('../services/AuthService');
const passport = require('passport');

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
    successRedirect:"https://aivicall.vercel.app/create",
    failureRedirect:"/login/failed"
}));


module.exports = router;
