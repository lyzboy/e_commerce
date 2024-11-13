const bcrypt = require("bcrypt");
const saltRounds = 15;

/**
 * Middleware to authenticate user has signed in with passport
 * @returns
 */
exports.authenticateUser = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
};

/**
 * Compares a hashed password to a plaintext password to ensure they match.
 * @param {string} password - plain text password
 * @param {string} hash - hashed password
 * @returns
 */
exports.comparePasswords = async (password, hash) => {
  try {
    const matchFound = await bcrypt.compare(password, hash);
    return matchFound;
  } catch (err) {
    console.log(err);
  }
  return false;
};

/**
 * Hashes a provided plaintext password.
 * @param {string} password - plain text password
 * @returns a hashed password
 */
exports.createHashedPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    throw new Error("Unable to hash password");
  }
};
