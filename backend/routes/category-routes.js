const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category-controller");
const authentication = require("../middlewares/authentication");
const authorization = require("../middlewares/authorization");

router.get(
  "/",
  authentication.authenticateUser,
  categoryController.getCategories
);

router.post(
  "/",
  authorization.authorizeRole("admin"),
  categoryController.createCategory
);

router.get(
  "/:id",
  authentication.authenticateUser,
  categoryController.getCategory
);

router.put(
  "/:id",
  authorization.authorizeRole("admin"),
  categoryController.updateCategory
);

router.delete(
  "/:id",
  authorization.authorizeRole("admin"),
  categoryController.deleteCategory
);

module.exports = router;
