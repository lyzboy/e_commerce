const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category-controller");
const authMiddleware = require("../middlewares/auth");

router.get(
    "/",
    authMiddleware.authenticate,
    categoryController.getCategories
);

router.post(
    "/",
    authMiddleware.authenticate,
    authMiddleware.checkAdminRole,
    categoryController.createCategory
);

router.get(
    "/:id",
    authMiddleware.authenticate,
    categoryController.getCategory
);

router.put(
    "/:id",
    authMiddleware.authenticate,
    authMiddleware.checkAdminRole,
    categoryController.updateCategory
);

router.delete(
    "/:id",
    authMiddleware.authenticate,
    authMiddleware.checkAdminRole,
    categoryController.deleteCategory
);

module.exports = router;
