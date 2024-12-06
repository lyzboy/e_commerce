const db = require("../../config/db");

const seedCategories = async (categories) => {
  try {
    const queries = categories.map((category) => {
      const { name, description } = category;
      return db.query(
        `INSERT INTO categories (name, description) 
             VALUES ($1, $2) 
             RETURNING *`,
        [name, description]
      );
    });
    await Promise.all(queries);
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = seedCategories;
