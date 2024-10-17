const express = require("express");
const router = express.Router();

const queries = require("../models/category-model");

// Categories
router.get("/", async (req, res) => {
    try {
        const results = await queries.getCategories();
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: "Server error: " + error.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name || !description) {
            return res.status(400).json({ message: "Invalid request object." });
        }
        const results = await queries.createCategory(name, description);
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: "Server Error: " + error.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const results = await queries.getCategory(req.params.id);
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: "Server Error: " + error.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name || !description) {
            return res.status(400).json({ message: "Invalid request object." });
        }
        const results = await queries.updateCategory({
            id: req.params.id,
            ...req.body,
        });
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: "Server Error: " + error.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const results = await queries.deleteCategory(id);
        if (results === 0) {
            return res
                .status(404)
                .json({ message: `Item with id ${id} not found` });
        }
        res.status(200).json({ message: `${results} item deleted.` });
    } catch (error) {
        res.status(500).json({ message: "Server Error: " + error.message });
    }
});

module.exports = router;
