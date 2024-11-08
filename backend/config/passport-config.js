const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
//const GoogleStrategy = require("passport-google-oauth20").Strategy;
//const FacebookTokenStrategy = require("passport-facebook-token");

const { passwordHash } = require("../util/helpers");

const userModel = require("../models/user-model");

passport.use(
  new LocalStrategy(function (username, password, done) {
    console.log(username);
    console.log(password);
    userModel.findUserByName(username, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false);
      }
      if (user.password != hash) {
        return done(null, false);
      }
      return done(null, user);
    });
  })
);
