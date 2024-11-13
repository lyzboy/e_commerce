const { query } = require("../config/db");

/**
 * Base model for all resources that require ownership verification. This allow for inheritance with the models
 * that will require ownership verification.
 */
const BaseModel = {
  /**
   * Gets a resource by the id
   * @param {integer} id - the id of the resource
   * @returns The resource object if found, null if not found
   */
  getResourceById: async (id) => {
    try {
      const queryText = `SELECT * FROM ${this.tableName} WHERE id = $1`;
      const queryParams = [id];
      const result = await query(queryText, queryParams);
      if (result.rows.length === 0) {
        return null;
      }
      return result.rows[0];
    } catch (error) {
      throw new Error(error);
    }
  },
  /**
   * Searches for a resource by email
   * @param {string} email - the account's email
   * @returns
   */
  createResource: async function (email) {
    try {
      const queryText = `INSERT INTO ${this.tableName} (account_email) VALUES ($1) RETURNING *`;
      const queryParams = [email];
      const result = await query(queryText, queryParams);
      return result.rows[0];
    } catch (error) {
      throw new Error(error);
    }
  },
};

module.exports = BaseModel;
