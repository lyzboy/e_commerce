/**
 * Checks within the req.user.role to see if it matches the provided argument
 * @param {string} role - the value of the role to authorize
 * @returns
 */
exports.authorizeRole = (role) => {
  return async (req, res, next) => {
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

    console.log("User is an ", role);
    next();
  };
};

const verifyAdmin = async (userEmail) => {
  const userModel = require("../models/user-model");
  const isAdmin = await userModel.getIsUserAdmin(userEmail);
  if (isAdmin) {
    return true;
  }
  return false;
};

/**
 *
 * @param {string} requestedModel - the model to authorize data ownership of. Must be in singular form. (carts -> cart)
 * @returns
 */
exports.authorizeOwnership = (requestedModel) => {
  return async (req, res, next) => {
    try {
      if (req.user.role === "admin") {
        const isAdmin = await verifyAdmin(req.user.email);
        if (isAdmin) {
          return next();
        }
        return res.status(403).json({ message: "Access denied" });
      }
      const { id } = req.params;
      let resourceModel;
      switch (requestedModel) {
        case "cart":
          resourceModel = require("../models/carts-model");
          break;
        case "order":
          resourceModel = require("../models/accounts_orders-model");
          break;
        default:
          return res
            .status(500)
            .json({ message: "Server error, Invalid Resource Type" });
      }
      const resource = await resourceModel.getResourceById(id);

      if (resource.account_email !== req.user.email) {
        return res.status(403).json({ message: "Access denied" });
      }

      next();
    } catch (error) {
      res.status(500).json({ message: "Server Error: " + error.message });
    }
  };
};
