require("dotenv").config();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
//const GoogleStrategy = require("passport-google-oauth20").Strategy;
//const FacebookTokenStrategy = require("passport-facebook-token");

const authMiddleware = require("../middlewares/auth");

const userModel = require("../models/user-model");

passport.use(
    new LocalStrategy(async function(username, password, done) { // Make LocalStrategy callback async
        try {
            console.log(username);
            console.log(password);
            if (process.env.DEV_MODE) {
                console.log("Development mode: bypassing authentication");
                const user = { username: "dev", role: "admin" };
                return done(null, user);
            } else {
                const user = await userModel.getUserByUsername(username); 
                if (!user) {
                    return done(null, false);
                }
                const matchFound = await authMiddleware.comparePasswords(password, user.password);
                if (!matchFound) {
                    return done(null, false);
                }
                return done(null, user);
            }
        } catch (err) {
            console.error(err); // Log the error for debugging
            return done(err); // Pass the error to Passport
        }
    })
);

passport.serializeUser((user, done) => {
  done(null, user.username);
});

passport.deserializeUser((username, done) => {
  userModel.getUserByUsername(username, function (err, user) {
    if (err) {
      return done(err);
    }
    done(null, user);
  });
});