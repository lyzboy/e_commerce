const productModel = require("../models/product-model");

exports.getProducts = async (req, res) => {
    try {
        const { id, maxPrice, minPrice } = req.body;

        // Create a params object with only defined values
        const params = {};
        if (categoryId) params.categoryId = categoryId;
        if (maxPrice) params.maxPrice = maxPrice;
        if (minPrice) params.minPrice = minPrice;

        // Pass params object to the model function
        const results = await productModel.getCategories(params);

        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: "Server Error: " + error.message });
    }
};
exports.createProduct = async (req, res) => {};
exports.getProduct = async (req, res) => {};
exports.updateProduct = async (req, res) => {};
exports.deleteProduct = async (req, res) => {};
