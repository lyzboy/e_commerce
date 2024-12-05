const db = require("../../config/db");

const seedDiscounts = async (discounts) => {
  try {
    const queries = discounts.map((discount) => {
      const { code, percent_off, expire_date, amount_off, quantity } = discount;
      return db.query(
        `INSERT INTO discounts (code, percent_off, expire_date, amount_off, quantity) 
                 VALUES ($1, $2, $3, $4, $5) 
                 RETURNING *`,
        [code, percent_off, expire_date, amount_off, quantity]
      );
    });
    await Promise.all(queries);
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = seedDiscounts;
