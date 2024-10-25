const productModel = require("../models/product-model");

exports.getProducts = async (req, res) => {
    try {
        const { categoryId, maxPrice, minPrice } = req.body;
        // Create a params object with only defined values
        const params = {};
        if (categoryId) params.categoryId = categoryId;
        if (maxPrice) params.maxPrice = maxPrice;
        if (minPrice) params.minPrice = minPrice;

        // Pass params object to the model function
        const results = await productModel.getProducts(params);

        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: "Server Error: " + error.message });
    }
};
exports.createProduct = async (req, res) => {
    res.status(500).json({ message: "Not implemented" });
};
exports.getProduct = async (req, res) => {
    res.status(500).json({ message: "Not implemented" });
};
exports.updateProduct = async (req, res) => {
    res.status(500).json({ message: "Not implemented" });
};
exports.deleteProduct = async (req, res) => {
    res.status(500).json({ message: "Not implemented" });
};
