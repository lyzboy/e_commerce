const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category-controller");

router.get("/", categoryController.getCategories);

router.post("/", categoryController.createCategory);

router.get("/:id", categoryController.getCategory);

router.put("/:id", categoryController.updateCategory);

router.delete("/:id", categoryController.deleteCategory);

module.exports = router;
