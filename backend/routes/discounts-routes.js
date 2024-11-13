const express = require("express");
const router = express.Router();
const discountController = require("../controllers/discount-controller");
const authentication = require("../middlewares/authentication");

router.get("/", authentication.authenticateUser, cartController.getCategories);

module.exports = router;
