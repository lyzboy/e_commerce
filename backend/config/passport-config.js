require("dotenv").config();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
//const GoogleStrategy = require("passport-google-oauth20").Strategy;
//const FacebookTokenStrategy = require("passport-facebook-token");

const authMiddleware = require("../middlewares/authentication");

const userModel = require("../models/user-model");

passport.use(
  new LocalStrategy(async function verify(username, password, done) {
    try {
      const user = await userModel.getUserByUsername(username);
      if (!user) {
        return done(null, false);
      }
      const matchFound = await authMiddleware.comparePasswords(
        password,
        user.password
      );
      if (!matchFound) {
        return done(null, false);
      }
      return done(null, user);
    } catch (err) {
      console.error(err);
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.username);
});

passport.deserializeUser(async (username, done) => {
  try {
    const foundUser = await userModel.getUserByUsername(username);
    if (!foundUser) {
      console.error("No user found during deserialization");
      return done(null, false);
    }
    const isAdmin = await userModel.getIsUserAdmin(foundUser.email);
    if (isAdmin) {
      foundUser.role = "admin";
    } else {
      foundUser.role = "standard";
    }
    done(null, foundUser);
  } catch (error) {
    done(error);
  }
});
