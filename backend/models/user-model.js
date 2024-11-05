const { query } = require("../config/db");

exports.getUseById = async (id) => {
  try {
    const queryText = "SELECT * FROM users WHERE id = $1";
    const queryParams = [id];
    const results = await query(queryText, queryParams);
    return results.rows[0];
  } catch (error) {
    throw new Error(error);
  }
};
