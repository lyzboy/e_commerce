const db = require("../../config/db");

const seedProductsCategories = async (productsCategories) => {
  try {
    const queries = productsCategories.map((productCategory) => {
      const { product_id, category_id } = productCategory;
      return db.query(
        `INSERT INTO products_categories (product_id, category_id) 
               VALUES ($1, $2) 
               RETURNING *`,
        [product_id, category_id]
      );
    });
    await Promise.all(queries);
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = seedProductsCategories;
