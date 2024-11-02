const express = require("express");
const router = express.Router();
const discountController = require("../controllers/discount-controller");
const authMiddleware = require("../middlewares/auth");

router.get("/", authMiddleware.authenticateToken, cartController.getCategories);

module.exports = router;
