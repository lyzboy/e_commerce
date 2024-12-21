const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth-controller");
const passport = require("passport");
const authentication = require("../middlewares/authentication");
const authorization = require("../middlewares/authorization");

router.post("/login", passport.authenticate("local"), authController.login);

router.post("/register", authController.createUser);

router.post("/logout", authController.logout);

router.post(
  "/admin",
  authentication.authenticateUser,
  authorization.authorizeRole("admin"),
  authController.addAdmin
);

router.delete(
  "/admin",
  authentication.authenticateUser,
  authorization.authorizeRole("admin"),
  authController.removeAdmin
);

module.exports = router;
