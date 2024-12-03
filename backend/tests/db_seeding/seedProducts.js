const db = require("../../config/db");

const seedProducts = async (products) => {
  try {
    const queries = products.map((product) => {
      const { barcode, name, description, stock_quantity, price } = product;
      return db.query(
        `INSERT INTO products (barcode, name, description, stock_quantity, price) 
               VALUES ($1, $2, $3, $4, $5) 
               RETURNING *`,
        [barcode, name, description, stock_quantity, price]
      );
    });
    await Promise.all(queries);
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = seedProducts;
