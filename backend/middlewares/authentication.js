const bcrypt = require("bcrypt");
const saltRounds = 15;

exports.authenticateUser = async (req, res, next) => {
  console.log("Checking if user is standard user...");
  if (!req.user) {
    console.error("No user found. Authentication required.");
    return res.status(401).json({ message: "Authentication required" });
  }

  console.log("User:", req.user);
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
