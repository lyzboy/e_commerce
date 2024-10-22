const express = require("express");
const router = express.Router();
const productController = require("../controllers/product-controller");
const authMiddleware = require("../middlewares/auth");

router.get(
    "/",
    authMiddleware.authenticateToken,
    productController.getProducts
);

router.post(
    "/",
    authMiddleware.authenticateToken,
    authMiddleware.checkAdminRole,
    productController.createProduct
);

router.get(
    "/:id",
    authMiddleware.authenticateToken,
    productController.getProduct
);

router.put(
    "/:id",
    authMiddleware.authenticateToken,
    authMiddleware.checkAdminRole,
    productController.updateProduct
);

router.delete(
    "/:id",
    authMiddleware.authenticateToken,
    authMiddleware.checkAdminRole,
    productController.deleteProduct
);

module.exports = router;
