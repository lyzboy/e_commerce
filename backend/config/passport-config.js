const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
//const GoogleStrategy = require("passport-google-oauth20").Strategy;
//const FacebookTokenStrategy = require("passport-facebook-token");
const userModel = require("../models/user-model");

// JWT Strat
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.TOKEN_SECRET,
};

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    // find the user based on the id in the JWT payload
    userModel.findUserById(jwt_payload.id, (err, user) => {
      if (err) return done(err, false);
      if (user) return done(null, user);
      else return done(null, false);
    });
  })
);
