/**
 * Checks within the req.user.role to see if it matches the provided argument
 * @param {string} role - the value of the role to authorize
 * @returns
 */
exports.authorizeRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      console.error("User is not an admin");
      return res.status(403).json({ message: "Access denied" });
    }

    console.log("User is an ", role);
    next();
  };
};

exports.authorizeOwnership = (req, res, next) => {};
