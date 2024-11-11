const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category-controller");
const authMiddleware = require("../middlewares/auth");

router.get(
    "/",
    authMiddleware.authorizeUserAccess,
    categoryController.getCategories
);

router.post(
    "/",
    authMiddleware.authorizeAdminAccess,
    categoryController.createCategory
);

router.get(
    "/:id",
    authMiddleware.authorizeUserAccess,
    categoryController.getCategory
);

router.put(
    "/:id",
    authMiddleware.authorizeAdminAccess,
    categoryController.updateCategory
);

router.delete(
    "/:id",
    authMiddleware.authorizeAdminAccess,
    categoryController.deleteCategory
);

module.exports = router;
