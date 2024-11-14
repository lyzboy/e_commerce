const express = require("express");
const router = express.Router();
const cartController = require("../controllers/carts-controller");
const authentication = require("../middlewares/authentication");
const authorization = require("../middlewares/authorization");

// this will be the only route for users to get their cart
router.get("/", authentication.authenticateUser, cartController.getUserCart);

router.get(
  "/:id",
  authentication.authenticateUser,
  authorization.authorizeRole("admin"),
  cartController.getCartAdmin
);

router.put("/", authentication.authenticateUser, cartController.updateCart);

router.delete("/", authentication.authenticateUser, cartController.deleteCart);

module.exports = router;
