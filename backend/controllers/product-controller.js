const { query } = require("../config/db");
const productModel = require("../models/product-model");

exports.getProducts = async (req, res) => {
    try {
        const { categoryId, maxPrice, minPrice } = req.body;
        const params = {};
        if (categoryId) params.categoryId = categoryId;
        if (maxPrice) params.maxPrice = maxPrice;
        if (minPrice) params.minPrice = minPrice;

        const results = await productModel.getProducts(params);

        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: "Server Error: " + error.message });
    }
};
exports.createProduct = async (req, res) => {
    try {
        const { barcode, name, description, price, stock_quantity, variants } =
            req.body;

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
        if (variants) params.variants = variants;
        const results = await productModel.createProduct(params);
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: "Error: " + error });
    }
};
exports.getProduct = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id)
            return res
                .status(400)
                .json({ message: "Bad Request: Missing Product ID." });
        const results = await productModel.getProductWithVariants(id);
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: "There was a server error: " + error });
    }
};
exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id)
            return res
                .status(400)
                .json({ message: "Bad Request: Missing Product ID" });
        const { barcode, name, description, price, stock_quantity, variants } =
            req.body;

        const params = { id };
        if (barcode) params.barcode = barcode;
        if (name) params.name = name;
        if (description) params.description = description;
        if (price) params.price = price;
        if (stock_quantity) params.stock_quantity = stock_quantity;
        if (variants) params.variants = variants;
        const results = await productModel.updateProduct(params);
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: error });
    }
};
exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id)
            return res
                .status(400)
                .json({ message: "Bad Request. Missing Product ID" });
        const results = await productModel.deleteProduct(id);
        res.status(200).json({ message: `Deleted ${results} row(s)` });
    } catch (error) {
        res.status(500).json({ message: error });
    }
};
