const express = require("express");
const router = express.Router();
const userController = require("../controllers/user-controller");
const authentication = require("../middlewares/authentication");
const authorization = require("../middlewares/authorization");

/***
 * Route that creates a recovery code for a user
 */
router.post("/recovery", userController.setPasswordRecovery);

/***
 * Route that verifies a recovery code for a user
 * will return message: "unverified" if code is invalid or expired
 * will return message: "verified" if code is valid
 */
router.post("/recovery/verify", userController.verifyPasswordCode);

/***
 *  Route to update a password using recovery code
 *  will return message: "unverified" if code is invalid or expired
 */
router.post("/recovery/update", userController.updatePasswordWithRecovery);

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
