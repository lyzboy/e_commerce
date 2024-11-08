const dotenv = require("dotenv");
const passport = require("passport");

//get config vars
dotenv.config();

// access config var for the token secret
const tokenSecret = process.env.TOKEN_SECRET;
const isDevMode = process.env.DEV_MODE;

exports.authenticate = (req, res, next) => {
  // TODO: disable for production

  passport.authenticate("local", { failureRedirect: "/login" }, (err, user) => {
    if (isDevMode && req.body.dev === "true") {
      console.log("Development mode: bypassing authentication");
      req.user = { username: "dev", role: "admin" };
      next();
    } else {
      if (err) {
        console.log("there was an error" + err);
        return next(err); // Pass the error to the error handling middleware
      }
      if (!user) {
        return res.status(401).json({ message: "Authentication failed" });
      }
      req.user = user;
      console.log("user authenticated");
      next();
    }
  })(req, res, next); // This invokes the middleware
};

exports.checkAdminRole = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};
