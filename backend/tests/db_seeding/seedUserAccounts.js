const db = require("../../config/db");

const seedUserAccounts = async (accounts) => {
  try {
    const queries = accounts.map((account) => {
      const { email, username, name, password } = account;
      return db.query(
        `INSERT INTO accounts (email, username, name, password) 
               VALUES ($1, $2, $3, $4) 
               RETURNING *`,
        [email, username, name, password]
      );
    });
    await Promise.all(queries);
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = seedUserAccounts;
