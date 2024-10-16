const express = require('express');
const router = express.Router();

const queries = require ('../models/category-model');



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
      const results = await queries.createCategory(req.body);
      res.status(200).json(results);
  } catch (error) {
      res.status(500).json({ message: "Server Error: " + error.message });
  }
});

module.exports = router;