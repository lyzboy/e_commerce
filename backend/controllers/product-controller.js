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
    try {
        const { barcode, name, description, price, stock_quantity } = req.body;

        if (!name) {
            return res
                .status(400)
                .json({ message: "Bad Request. Missing product name" });
        }

        const params = {};
        params.name = name;

        if (barcode) params.barcode = barcode;
        if (description) params.description = description;
        if (price) params.price = price;
        if (stock_quantity) params.stock_quantity = stock_quantity;
        const results = await productModel.createProduct(params);
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: "Error: " + error });
    }
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
