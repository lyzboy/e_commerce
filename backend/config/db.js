const dotenv = require("dotenv");
const path = require("path");
dotenv.config(); //{ path: path.resolve(__dirname, "../../.env") });
const { Pool } = require("pg");

/**
 * This is the pool to use for Admin users. This pool has full access
 * to HTTP and database statements.
 */
const adminPool = new Pool({
  user: process.env.ADMIN_USER_NAME,
  host: process.env.POOL_HOST_NAME,
  database: process.env.POOL_DATABASE_NAME,
  password: process.env.ADMIN_PASSWORD,
  port: process.env.POOL_PORT,
});

/**
 * This is the pool to use for standard users. This pool is limited
 * to the HTTP and database statements that can be used.
 */
const standardPool = new Pool({
  user: process.env.STANDARD_USER_NAME,
  host: process.env.POOL_HOST_NAME,
  database: process.env.POOL_DATABASE_NAME,
  password: process.env.STANDARD_PASSWORD,
  port: process.env.POOL_PORT,
});

const testPool = new Pool({
  user: process.env.TEST_DB_USER,
  host: process.env.TEST_DB_HOST,
  database: process.env.TEST_DB_NAME,
  password: process.env.TEST_DB_PASSWORD,
  port: process.env.TEST_DB_PORT,
});

/**
 * This function is used to query the database.
 * @param {string} queryText - The query statement
 * @param {*} params - Any query parameters
 * @param {*} isAdmin - Determines where to use the adminPool or standardPool
 * @returns
 */
const query = async (queryText, queryParams, isAdmin = false) => {
  try {
    if (process.env.JEST_WORKER_ID || process.env.NODE_ENV === "test") {
      const result = await testPool.query(queryText, queryParams);
      return result;
    }
    const pool = isAdmin ? adminPool : standardPool;
    const result = await pool.query(queryText, queryParams);
    return result;
  } catch (err) {
    console.log("Error executing query: ", err);
  }
};

module.exports = {
  query,
  testPool,
};
