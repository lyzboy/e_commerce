const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth-controller");
const authMiddleware = require("../middlewares/auth");

router.post("/login", authMiddleware.authenticate, authController.login);

router.post("/register", authController.createUser);

router.post("/logout", authController.logout);

module.exports = router;
