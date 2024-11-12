const express = require("express");
const router = express.Router();
const productController = require("../controllers/product-controller");
const variantController = require("../controllers/variant-controller");
const authMiddleware = require("../middlewares/auth");
const passport = require("passport");

router.get(
  "/",
  authMiddleware.authorizeUserAccess,
  productController.getProducts
);

router.post(
  "/",
  authMiddleware.authorizeAdminAccess,
  productController.createProduct
);

router.get(
  "/:id",
  authMiddleware.authorizeUserAccess,
  productController.getProduct
);

router.put(
  "/:id",
  authMiddleware.authorizeAdminAccess,
  productController.updateProduct
);

router.delete(
  "/:id",
  authMiddleware.authorizeAdminAccess,
  productController.deleteProduct
);

router.post(
  "/:productId/variants",
  authMiddleware.authorizeAdminAccess,
  variantController.createProductVariant
);

router.put(
  "/:productId/variants/:variantId",
  authMiddleware.authorizeAdminAccess,
  variantController.updateProductVariant
);

router.delete(
  "/:productId/variants/:variantId",
  authMiddleware.authorizeAdminAccess,
  variantController.deleteProductVariant
);

module.exports = router;
