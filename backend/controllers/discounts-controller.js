const discountModel = require("../models/discounts-model");

/**
 * Gets all discounted products based on the query parameters.
 * @param {*} req
 * @param {*} res
 */
exports.getDiscountedProducts = async (req, res) => {
  try {
    const { limit, page, category } = req.query;
    const products = await discountModel.getDiscountedProducts(
      limit,
      page,
      category
    );
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

/**
 * Adds a discount to a product. If productVariantId is provided, it will be used to add the discount. Otherwise, productId will be used.
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.addDiscountToProduct = async (req, res) => {
  try {
    const { productId, discountId, productVariantId } = req.body;
    if (!productId || !discountId) {
      return res.status(400).json({ message: "Invalid request object." });
    }
    const results = await discountModel.addDiscountToProduct(
      productId,
      discountId,
      productVariantId
    );
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: "Server Error: " + error.message });
  }
};

/**
 * Removes a discount from a product. If productDiscountId is provided, it will be used to remove the discount. Otherwise, productId and discountId will be used.
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.removeDiscountFromProduct = async (req, res) => {
  try {
    const { productDiscountId, productId, discountId, productVariantId } =
      req.body;
    if (!productDiscountId) {
      if (!productId && !discountId) {
        return res.status(400).json({ message: "Invalid request object." });
      }
    }
    const results = await discountModel.removeDiscountFromProduct(
      productDiscountId,
      productId,
      discountId,
      productVariantId
    );
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: "Server Error: " + error.message });
  }
};

/**
 * Delete a discount based on the given ID.
 * @param {*} req
 * @param {*} res
 */
exports.deleteDiscount = async (req, res) => {
  try {
    const { id } = req.params;
    const results = await discountModel.deleteDiscount(id);
    if (results.rowsDeleted === 0) {
      return res.status(404).json({ message: "Discount not found." });
    }
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: "Server Error: " + error.message });
  }
};

/**
 * Function to get a discount based on the given ID.
 * @param {*} req
 * @param {*} res
 */
exports.getDiscountById = async (req, res) => {
  try {
    const { id } = req.params;
    const results = await discountModel.getDiscount(id);
    if (!results) {
      return res.status(404).json({ message: "Discount not found." });
    }
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: "Server Error: " + error.message });
  }
};

exports.getDiscountByCode = async (req, res) => {
  try {
    const { code } = req.params;
    const results = await discountModel.getDiscountByCode(code);
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: "Server Error: " + error.message });
  }
};

exports.updateDiscount = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, percentOff, amountOff, expireDate, quantity } = req.body;
    const results = await discountModel.updateDiscount(
      id,
      code,
      percentOff,
      amountOff,
      expireDate,
      quantity
    );
    if (!results) {
      return res.status(404).json({ message: "Discount not found." });
    }
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: "Server Error: " + error.message });
  }
};

/**
 * Create a discount based on the given request object.
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.createDiscount = async (req, res) => {
  try {
    const { code, percentOff, amountOff, expireDate, quantity } = req.body;
    if (!percentOff) {
      return res.status(400).json({ message: "Invalid request object." });
    }

    const results = await discountModel.createDiscount(
      code,
      percentOff,
      amountOff,
      expireDate,
      quantity
    );
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({
      message: "Server Error: " + error.message,
      // Include the error stack for detailed debugging information
      stack: error.stack,
    });
  }
};

/**
 * Get all discounts based on the query parameters.
 * @param {*} req
 * @param {*} res
 */
exports.getDiscounts = async (req, res) => {
  try {
    const { limit, page, categoryId } = req.query;
    const results = await discountModel.getDiscounts(limit, page, categoryId);
    if (results.length === 0) {
      return res.status(404).json({ message: "No discounts found." });
    }
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: "Server Error: " + error.message });
  }
};

exports.validateDiscountCode = async (req, res) => {
  try {
    const { code } = req.params;
  } catch (error) {}
};

exports.validateDiscount = async (req, res) => {};
