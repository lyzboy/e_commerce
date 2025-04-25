const express = require("express");
const router = express.Router();
const herosController = require("../controllers/heros-controller");
const authentication = require("../middlewares/authentication");
const authorization = require("../middlewares/authorization");

router.get("/", herosController.getHeros);

router.post(
  "/",
  authentication.authenticateUser,
  authorization.authorizeRole("admin"),
  herosController.createHero
);

router.put(
  "/:id",
  authentication.authenticateUser,
  authorization.authorizeRole("admin"),
  herosController.updateHero
);

// router.delete(
//   "/:id",
//   authentication.authenticateUser,
//   authorization.authorizeRole("admin"),
//   herosController.deleteHero
// );

module.exports = router;
