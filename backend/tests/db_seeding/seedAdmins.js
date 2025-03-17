const db = require("../../config/db");

const seedAdmins = async (accounts) => {
  try {
    const queries = accounts.map((account) => {
      const { email } = account;
      return db.query(
        `INSERT INTO admins (account_email) 
               VALUES ($1) 
               RETURNING *`,
        [email]
      );
    });
    await Promise.all(queries);
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = seedAdmins;
