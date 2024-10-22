const categoryModel = require("../models/category-model");

/**
 * Controller function to fetch all categories.
 * Sends a JSON response with a list of categories or an error message.
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>} - A promise that resolves with no value (void)
 */
exports.getCategories = async (req, res) => {
    try {
        // Extract query parameters for pagination
        const { limit = 25, offset = 0, name } = req.query;
        const results = await categoryModel.getCategories({
            limit,
            offset,
            name,
        });

        if (!results.length) {
            throw new Error("No results returned.");
        }
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: "Server error: " + error.message });
    }
};
/**
 * Controller function to create a category.
 * Sends a JSON response with the created category or an error message.
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>} - A promise that resolves with no value (void)
 */
exports.createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name || !description) {
            return res.status(400).json({ message: "Invalid request object." });
        }
        const results = await categoryModel.createCategory(name, description);
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: "Server Error: " + error.message });
    }
};

/**
 * Controller function to fetch a category based on the given ID.
 * Sends a JSON response with the category or an error message.
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>} - A promise that resolves with no value (void)
 */
exports.getCategory = async (req, res) => {
    try {
        // Extract query parameters for pagination
        const { limit = 25, offset = 0, name } = req.query;
        const results = await categoryModel.getCategory({
            //TODO: insert correct queries.
            limit,
            offset,
            name,
        });

        if (!results.length) {
            throw new Error("No results returned.");
        }
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: "Server Error: " + error.message });
    }
};

/**
 * Controller function to update a category based on the given category object.
 * Sends a JSON response with the updated category or an error message.
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>} - A promise that resolves with no value (void)
 */
exports.updateCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name || !description) {
            return res.status(400).json({ message: "Invalid request object." });
        }
        const results = await categoryModel.updateCategory({
            id: req.params.id,
            ...req.body,
        });
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: "Server Error: " + error.message });
    }
};

/**
 * Controller function to delete a category.
 * Sends a JSON response with a success message or an error message.
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>} - A promise that resolves with no value (void)
 */
exports.deleteCategory = async (req, res) => {
    try {
        const id = req.params.id;
        const results = await categoryModel.deleteCategory(id);
        if (results === 0) {
            return res
                .status(404)
                .json({ message: `Item with id ${id} not found` });
        }
        res.status(200).json({ message: `Item with id ${id} was deleted.` });
    } catch (error) {
        res.status(500).json({ message: "Server Error: " + error.message });
    }
};
