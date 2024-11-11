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
          // TODO: REMOVE THIS LINE IN PRODUCTION
            if (process.env.DEV_MODE === "true") {
                console.log("Development mode: bypassing authentication");
                const user = { username: "dev", role: "admin" };
                return done(null, user);
            } else {
                console.log("Authenticating user in local strat...");
                const user = await userModel.getUserByUsername(username); 
                if (!user) {
                    console.error(`No user with username ${username} found`);
                    return done(null, false);
                }
                console.log("User found");
                console.log("Checking Password...");
                const matchFound = await authMiddleware.comparePasswords(password, user.password);
                if (!matchFound) {
                    console.error("Password mismatch");
                    return done(null, false);
                }
                const userData = {
                    username: user.username,
                    email: user.email
                };
                console.log("Password match");
                console.log("Checking if user is an admin...");
                const isAdmin = await userModel.getIsUserAdmin(user.email);
                if(isAdmin) {
                    console.log("User is an admin");
                    userData.role = "admin";
                }
                console.log("Authentication successful");
                return done(null, userData);
            }
        } catch (err) {
            console.error(err); // Log the error for debugging
            return done(err); // Pass the error to Passport
        }
    })
);

passport.serializeUser((user, done) => {
  done(null, user.email);
});

passport.deserializeUser(async (id, done) => {
  try {
    
    const user = await userModel.getUserByEmail(id);
    if(!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error);
  }
});