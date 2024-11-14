/**
 * Checks within the req.user.role to see if it matches the provided argument
 * @param {string} role - the value of the role to authorize
 * @returns
 */
exports.authorizeRole = (role) => {
  return async (req, res, next) => {
    try {
      switch (role) {
        case "admin":
          const isAdmin = await verifyAdmin(req.user.email);
          if (!isAdmin) {
            return res.status(403).json({ message: "Access denied" });
          }
          break;
        default:
          return res
            .status(403)
            .json({ message: "Server error, Invalided role" });
      }
      next();
    } catch (error) {
      res.status(500).json({ message: "Server Error: " + error.message });
    }
  };
};

/**
 * Checks with database to verify if user is an admin
 * @param {string} userEmail - the email to check with the DB if the user is admin
 * @returns
 */
const verifyAdmin = async (userEmail) => {
  const userModel = require("../models/user-model");
  const isAdmin = await userModel.getIsUserAdmin(userEmail);
  if (isAdmin) {
    return true;
  }
  return false;
};

module.exports = exports;
