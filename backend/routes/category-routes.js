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

router.post("/:id", async (req, res) => {
    try {
        const results = await queries.getCategory(req.params.id);
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: "Server Error: " + error.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const results = await queries.updateCategory(req.body);
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: "Server Error: " + error.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const results = await queries.deleteCategory(req.params.id);
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: "Server Error: " + error.message });
    }
});

module.exports = router;
