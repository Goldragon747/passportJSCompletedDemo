const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const ejs = require('ejs');

const keys = require("./keys");
const express = require("express");
const path = require("path");
const app = express();

const User = require("./user-model");

mongoose.connect(keys.mongodb.dbURI, ()=>{
    console.log("We are connected to mongo!");
})

app.use(express.static(path.join(__dirname + '/public')));
app.use(cookieSession({
    //hours minutes seconds miliseconds = 1 day
    maxAge:24 * 60 * 60 * 1000,
    keys: [keys.session.cookieKey]
}));

app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');
app.get('/', (req,res) => {
    res.sendFile('index.html', {root: __dirname });
});
app.get('/logged-in',passport.authenticate("google") , (req,res) => {
    res.redirect("/unlock");
});
const authCheck = (req,res,next) => {
    if(req.user){
        next();
    } else {
        res.redirect('/');
    }
};

app.get('/unlock', authCheck ,(req,res) => {
    res.render("unlocked", {user:req.user});
});
app.get('/google', passport.authenticate("google", {
    scope: ["profile"]
}));
app.listen(3000);


passport.use(
    new GoogleStrategy({
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret,
        callbackURL:'/logged-in'
    },(accessToken, refreshToken, profile, done) => {
        // Callback function
        console.log(profile);
        User.findOne({googleID:profile.id}).then( (currentuser) => {
            if(currentuser){
                done(null, currentuser);
            } else {
                new User({
                    username: profile.displayName,
                    googleID: profile.id,
                    imageURL: profile.photos[0].value
                }).save().then( (newuser) => {
                    done(null, newuser);
                });
            }
        });
    })
)

passport.serializeUser( (user, done) => {
    done(null, user.id);
} );

passport.deserializeUser( (id, done) => {
    User.findById(id).then( (user) => {
        done(null, user);
    } );
} );