const { query } = require("../config/db");

exports.addAdmin = async (email) => {
  try {
    const emailCheck = await query(
      "Select * FROM admins WHERE account_email = $1",
      [email],
      true
    );
    if (emailCheck.rows.length > 0) {
      return null;
    }
    const results = await query(
      "INSERT INTO admins (account_email) VALUES ($1) RETURNING *",
      [email],
      true
    );
    return results.rows[0];
  } catch (error) {
    throw new Error(error);
  }
};
