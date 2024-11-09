const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart-controller");
const authMiddleware = require("../middlewares/auth");

router.get("/", authMiddleware.authenticate, cartController.getCart);

router.put("/:id", authMiddleware.authenticate, cartController.updateCart);

router.post("/", authMiddleware.authenticate, cartController.createCart);

router.delete(
  "/:id",
  authMiddleware.authenticate,
  cartController.deleteCart
);

module.exports = router;
