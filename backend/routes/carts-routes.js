const express = require("express");
const router = express.Router();
const cartController = require("../controllers/carts-controller");
const authentication = require("../middlewares/authentication");
const authorization = require("../middlewares/authorization");

// this will be the only route for users to get their cart
router.get("/", authentication.authenticateUser, cartController.getUserCart);
//TODO: this should only be used by admin. users should not specify the cart id
router.get(
  "/:id",
  authentication.authenticateUser,
  //TODO: change to authorizeRole("admin")
  authorization.authorizeOwnership("cart"),
  cartController.getCart
);

router.put("/", authentication.authenticateUser, cartController.updateCart);

router.delete("/", authentication.authenticateUser, cartController.deleteCart);

module.exports = router;
