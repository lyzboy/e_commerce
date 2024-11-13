const express = require("express");
const router = express.Router();
const cartController = require("../controllers/carts-controller");
const authentication = require("../middlewares/authentication");
const authorization = require("../middlewares/authorization");

router.get(
  "/:id",
  authentication.authenticateUser,
  authorization.authorizeOwnership("cart"),
  cartController.getCart
);

router.put(
  "/:id",
  authentication.authenticateUser,
  authorization.authorizeOwnership("cart"),
  cartController.updateCart
);

router.delete(
  "/:id",
  authentication.authenticateUser,
  authorization.authorizeOwnership("cart"),
  cartController.deleteCart
);

module.exports = router;
