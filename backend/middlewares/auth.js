const passport = require("passport");

const bcrypt = require("bcrypt");
const saltRounds = 15;

exports.authenticate = async (req, res, next) => {
  passport.authenticate("local")(req, res, next);
  // when google and facebook auth is implemented,
  // const strategy = req.body.strategy || req.headers['x-auth-strategy'] || 'local'; 

  // passport.authenticate(strategy, (err, user, info) => { // Callback is needed here
  //     if (err) {
  //         return next(err); 
  //     }
  //     if (!user) {
  //         return res.status(401).json({ message: info.message || "Authentication failed" }); 
  //     }
  //     req.logIn(user, (err) => {
  //         if (err) {
  //             return next(err); 
  //         }
  //         next();
  //     });
  // })(req, res, next);
}

exports.checkAdminRole = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
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