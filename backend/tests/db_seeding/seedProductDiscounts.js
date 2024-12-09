const db = require("../../config/db");

const seedProductDiscounts = async (productDiscounts) => {
  try {
    const queries = productDiscounts.map((productDiscount) => {
      const { product_id, discount_id, product_variant_id } = productDiscount;
      return db.query(
        `INSERT INTO products_discounts (product_id, discount_id, product_variant_id) 
               VALUES ($1, $2, $3) 
               RETURNING *`,
        [product_id, discount_id, product_variant_id]
      );
    });
    await Promise.all(queries);
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = seedProductDiscounts;
