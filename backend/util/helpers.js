const bcrypt = require("bcrypt");
const saltRounds = 15;

/**
 * Create a hashed password from a plain text password
 * @param {string} password - the plain text password to hash
 * @returns
 */
const passwordHash = async (password) => {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    throw new Error("Unable to hash password");
  }
};
