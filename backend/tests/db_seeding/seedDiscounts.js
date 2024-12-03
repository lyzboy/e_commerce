const db = require("../../config/db");

const seedDiscounts = async (discounts) => {
  try {
    const queries = discounts.map((discount) => {
      const { code, percent_off, expire_date } = discount;
      return db.query(
        `INSERT INTO discounts (code, percent_off, expire_date) 
                 VALUES ($1, $2, $3) 
                 RETURNING *`,
        [code, percent_off, expire_date]
      );
    });
    await Promise.all(queries);
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = seedDiscounts;
