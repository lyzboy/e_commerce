/**
 * Checks within the req.user.role to see if it matches the provided argument
 * @param {string} role - the value of the role to authorize
 * @returns
 */
exports.authorizeRole = (role) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
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

//TODO: this will not be needed as users will not be able to specify the cart id
/**
 *
 * @param {string} requestedModel - the model to authorize data ownership of. Must be in singular form. (carts -> cart)
 * @returns
 */
exports.authorizeOwnership = (requestedModel) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
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
      if (!resource) {
        return res.status(404).json({ message: "Resource not found" });
      }
      if (req.user.role === "admin") {
        const isAdmin = await verifyAdmin(req.user.email);
        if (isAdmin) {
          req.resource = resource;
          return next();
        }
        return res.status(403).json({ message: "Access denied" });
      }
      if (resource.account_email !== req.user.email) {
        return res.status(403).json({ message: "Access denied" });
      }
      req.resource = resource;
      next();
    } catch (error) {
      res.status(500).json({ message: "Server Error: " + error.message });
    }
  };
};
