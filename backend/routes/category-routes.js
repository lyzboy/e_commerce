const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category-controller");
const authMiddleware = require("../middlewares/auth");

router.get(
    "/",
    authMiddleware.authenticateToken,
    categoryController.getCategories
);

router.post(
    "/",
    authMiddleware.authenticateToken,
    authMiddleware.checkAdminRole,
    categoryController.createCategory
);

router.get(
    "/:id",
    authMiddleware.authenticateToken,
    categoryController.getCategory
);

router.put(
    "/:id",
    authMiddleware.authenticateToken,
    authMiddleware.checkAdminRole,
    categoryController.updateCategory
);

router.delete(
    "/:id",
    authMiddleware.authenticateToken,
    authMiddleware.checkAdminRole,
    categoryController.deleteCategory
);

module.exports = router;
