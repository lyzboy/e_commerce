const express = require("express");
const router = express.Router();
const productController = require("../controllers/product-controller");
const variantController = require("../controllers/variant-controller");
const authMiddleware = require("../middlewares/auth");

router.get("/", authMiddleware.authenticate, productController.getProducts);

router.post(
  "/",
  authMiddleware.authenticate,
  authMiddleware.checkAdminRole,
  productController.createProduct
);

router.get("/:id", authMiddleware.authenticate, productController.getProduct);

router.put(
  "/:id",
  authMiddleware.authenticate,
  authMiddleware.checkAdminRole,
  productController.updateProduct
);

router.delete(
  "/:id",
  authMiddleware.authenticate,
  authMiddleware.checkAdminRole,
  productController.deleteProduct
);

router.post(
  "/:productId/variants",
  authMiddleware.authenticate,
  authMiddleware.checkAdminRole,
  variantController.createProductVariant
);

router.put(
  "/:productId/variants/:variantId",
  authMiddleware.authenticate,
  authMiddleware.checkAdminRole,
  variantController.updateProductVariant
);

router.delete(
  "/:productId/variants/:variantId",
  authMiddleware.authenticate,
  authMiddleware.checkAdminRole,
  variantController.deleteProductVariant
);

module.exports = router;
