const express = require("express");
const router = express.Router();
const userController = require("../controllers/user-controller");
const authentication = require("../middlewares/authentication");
const authorization = require("../middlewares/authorization");
const passport = require("passport");

// get logged in user's info
router.get("/", authentication.authenticateUser, userController.getUser);

// update logged in user's info
router.put("/", authentication.authenticateUser, userController.updateUser);

router.post("/register", userController.createUser);

/**
 * Route that deletes a users account when the user is signed in
 */
router.delete("/", authentication.authenticateUser, userController.deleteUser);

/***
 * Route that creates a recovery code for a user
 */
router.post("/recovery", userController.setPasswordRecovery);

/***
 * Route that verifies a recovery code for a user
 * will return message: "unverified" if code is invalid or expired
 * will return message: "verified" if code is valid
 */
router.post("/recovery/verify", userController.verifyPasswordCode);

/***
 *  Route to update a password using recovery code
 *  will return message: "unverified" if code is invalid or expired
 */
router.post("/recovery/update", userController.updatePasswordWithRecovery);

router.get(
  "/:id",
  authentication.authenticateUser,
  authorization.authorizeRole("admin"),
  userController.getUserByEmail
);

router.delete(
  "/:id",
  authentication.authenticateUser,
  authorization.authorizeRole("admin"),
  userController.adminDeleteUser
);

module.exports = router;
