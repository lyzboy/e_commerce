const express = require("express");
const router = express.Router();
const discountController = require("../controllers/discount-controller");
const authMiddleware = require("../middlewares/auth");

router.get("/", authMiddleware.authenticate, cartController.getCategories);

module.exports = router;
