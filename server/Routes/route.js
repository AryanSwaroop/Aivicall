const router = require('express').Router();
const passport = require('passport');

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