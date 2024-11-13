const { query } = require("../config/db");

exports.getResourceById = async (id) => {
  try {
    const queryText = `SELECT * FROM carts WHERE id = $1`;
    const queryParams = [id];
    const result = await query(queryText, queryParams);
    return result.rows[0];
  } catch (error) {
    throw new Error(error);
  }
};
