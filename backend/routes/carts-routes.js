const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart-controller");
const authentication = require("../middlewares/authentication");

router.get("/", authentication.authenticateUser, cartController.getCart);

router.put("/:id", authentication.authenticateUser, cartController.updateCart);

router.post("/", authentication.authenticateUser, cartController.createCart);

router.delete(
  "/:id",
  authentication.authenticateUser,
  cartController.deleteCart
);

module.exports = router;
