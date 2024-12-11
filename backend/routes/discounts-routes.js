const express = require("express");
const router = express.Router();
const discountController = require("../controllers/discounts-controller");
const authentication = require("../middlewares/authentication");
const authorization = require("../middlewares/authorization");

router.get(
  "/",
  authentication.authenticateUser,
  authorization.authorizeRole("admin"),
  discountController.getDiscounts
);

router.post(
  "/",
  authentication.authenticateUser,
  authorization.authorizeRole("admin"),
  discountController.createDiscount
);

router.get(
  "/:id",
  authentication.authenticateUser,
  authorization.authorizeRole("admin"),
  discountController.getDiscountById
);

router.put(
  "/:id",
  authentication.authenticateUser,
  authorization.authorizeRole("admin"),
  discountController.updateDiscount
);

router.delete(
  "/:id",
  authentication.authenticateUser,
  authorization.authorizeRole("admin"),
  discountController.deleteDiscount
);

/**
 * returns all products with discounts based on req.query. Standard User access
 */
router.get(
  "/products",
  authentication.authenticateUser,
  discountController.getDiscountedProducts
);

router.post(
  "/products/add",
  authentication.authenticateUser,
  authorization.authorizeRole("admin"),
  discountController.addDiscountToProduct
);

router.delete(
  "/products/remove",
  authentication.authenticateUser,
  authorization.authorizeRole("admin"),
  discountController.removeDiscountFromProduct
);

router.post(
  "/use/:code",
  authentication.authenticateUser,
  discountController.validateDiscountCode
);

router.post(
  "/validate",
  authentication.authenticateUser,
  discountController.validateDiscount
);

module.exports = router;
