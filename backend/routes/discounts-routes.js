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

/**
 * returns all products with discounts based on req.query. Standard User access
 */
router.get(
  "/products",
  authentication.authenticateUser,
  discountController.getDiscountedProducts
);

router.post(
  "/products",
  authentication.authenticateUser,
  authorization.authorizeRole("admin"),
  discountController.addDiscountToProduct
);

router.delete(
  "/products",
  authentication.authenticateUser,
  authorization.authorizeRole("admin"),
  discountController.removeDiscountFromProduct
);

router.post(
  "/code/:code",
  authentication.authenticateUser,
  discountController.validateDiscountCode
);

router.post(
  "/code/:code/use",
  authentication.authenticateUser,
  discountController.validateDiscount
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

module.exports = router;
