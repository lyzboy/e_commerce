const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart-controller");
const authMiddleware = require("../middlewares/auth");

router.get("/", authMiddleware.authenticateToken, cartController.getCart);

router.put("/:id", authMiddleware.authenticateToken, cartController.updateCart);

router.post("/", authMiddleware.authenticateToken, cartController.createCart);

router.delete(
  "/:id",
  authMiddleware.authenticateToken,
  cartController.deleteCart
);

module.exports = router;
