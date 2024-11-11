const passport = require("passport");

const bcrypt = require("bcrypt");
const saltRounds = 15;

exports.authorizeUserAccess = async (req, res, next) => {
  //passport.authenticate("local")(req, res, next);
  // when google and facebook auth is implemented,
  const strategy = req.body.strategy || req.headers['x-auth-strategy'] || 'local'; 

  passport.authenticate(strategy, (err, user, info) => {
      console.log("Auth Strat complete, checking err...");
      if (err) {
          console.error("Found an error in passport authenticate for user access, posssible error in passport-config.js");
          return next(err); 
      }
      console.log("No error found, Checking user...");
      if (!user) {
          console.error("No user found in passport authenticate for user access.");
          console.log(`User: ${user}`);
          return res.status(401).json({ message: info.message || "Authentication failed" }); 
      }
      console.log(`User: ${user}`);
      req.user = user;
      console.log(`Req.user: ${req.user}`);
      console.log(`Authentication complete, calling next()...`);
      next();
  })(req, res, next);
}

exports.authorizeAdminAccess = async (req, res, next) => {
  const strategy = req.body.strategy || req.headers['x-auth-strategy'] || 'local'; 

  passport.authenticate(strategy, (err, user, info) => { // Callback is needed here
      if (err) {
          return next(err); 
      }
      if (!user) {
          return res.status(401).json({ message: info.message || "Authentication failed" }); 
      }
      if (user.role !== "admin") {
        return res.status(403).json({ message: "Access denied" });
      }

      next();

  })(req, res, next);
};

exports.comparePasswords = async (password, hash) => {
	try {
		const matchFound = await bcrypt.compare(password, hash);
		return matchFound;
	} catch (err) {
		console.log(err);
	}
	return false;
};

exports.passwordHash = async (password) => {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    throw new Error("Unable to hash password");
  }
};