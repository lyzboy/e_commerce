const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth-controller");
const authMiddleware = require("../middlewares/auth");

router.post("/login", authMiddleware.authorizeUserAccess, authController.login);

router.post("/register", authController.createUser);

router.post("/logout", authController.logout);

module.exports = router;

//TODO: req.user is beinging stored with entire user object, only needs, username, role, email.
//TODO: no session cookies being stored within postman, need to check if session is being stored in memory. Means databse calls happending on every request.
