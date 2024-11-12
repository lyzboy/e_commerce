const passport = require("passport");

const bcrypt = require("bcrypt");
const saltRounds = 15;

exports.authorizeUserAccess = async (req, res, next) => {
  console.log("Checking if user is standard user...");

  if (!req.user) {
    console.error("No user found. Authentication required.");
    return res.status(401).json({ message: "Authentication required" });
  }

  console.log("User:", req.user);
  next();
};

exports.authorizeAdminAccess = (req, res, next) => {
  console.log("Checking if user is an admin...");

  if (!req.user) {
    console.error("No user found. Authentication required.");
    return res.status(401).json({ message: "Authentication required" });
  }

  console.log("User:", req.user);

  if (req.user.role !== "admin") {
    console.error("User is not an admin");
    return res.status(403).json({ message: "Access denied" });
  }

  console.log("User is an admin");
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
