// jshint esversion: 6
require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const app = express();

app.set("view engine", "ejs");

app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: "SECRET"
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

let userProfile;

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://arcane-river-29056.herokuapp.com/auth/google/simpleOauth",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    userProfile = profile;
    cb(null, profile);
  }
));

app.get("/", (req, res) => {
  res.render("auth");
});

app.get("/success", (req, res) => res.render("success", {
  user: userProfile
}));

app.get("/auth/google",
  passport.authenticate('google', {
    scope: ["profile", "email"]
  })
);

app.get("/auth/google/simpleOauth",
  passport.authenticate('google', {
    failureRedirect: "/"
  }),
  function(req, res) {
    // Successful authentication, redirect to secrets.
    res.redirect("/success");
  });

app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});


app.listen(process.env.PORT || 3000, () => console.log("Server started on port 3000"));
