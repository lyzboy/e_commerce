const express = require("express");
const router = express.Router();
const userController = require("../controllers/user-controller");
const authentication = require("../middlewares/authentication");
const authorization = require("../middlewares/authorization");

router.post("/recovery", userController.setPasswordRecovery);

router.post("/verify", userController.verifyPasswordCode);

// router.post(
//   "/",
//   authorization.authorizeRole("admin"),
//   productController.createProduct
// );

// router.get(
//   "/:id",
//   authentication.authenticateUser,
//   productController.getProduct
// );

// router.put(
//   "/:id",
//   authorization.authorizeRole("admin"),
//   productController.updateProduct
// );

// router.delete(
//   "/:id",
//   authorization.authorizeRole("admin"),
//   productController.deleteProduct
// );

// router.post(
//   "/:productId/variants",
//   authorization.authorizeRole("admin"),
//   variantController.createProductVariant
// );

// router.put(
//   "/:productId/variants/:variantId",
//   authorization.authorizeRole("admin"),
//   variantController.updateProductVariant
// );

// router.delete(
//   "/:productId/variants/:variantId",
//   authorization.authorizeRole("admin"),
//   variantController.deleteProductVariant
// );

module.exports = router;
