const express = require("express");
const router = express.Router();
const productController = require("../controllers/product-controller");
const variantController = require("../controllers/variant-controller");
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

router.post(
    "/:productId/variants",
    authMiddleware.authenticateToken,
    authMiddleware.checkAdminRole,
    variantController.createProductVariant
);

router.put(
    "/:productId/variants/:variantId",
    authMiddleware.authenticateToken,
    authMiddleware.checkAdminRole,
    variantController.updateProductVariant
);

router.delete(
    "/:productId/variants/:variantId",
    authMiddleware.authenticateToken,
    authMiddleware.checkAdminRole,
    variantController.deleteProductVariant
);

module.exports = router;
