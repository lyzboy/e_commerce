const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth-controller");
const passport = require("passport");

router.post("/login", passport.authenticate("local"), authController.login);

router.post("/register", authController.createUser);

router.post("/logout", authController.logout);

module.exports = router;
