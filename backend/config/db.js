const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
const { Pool } = require("pg");

// Admin pool
const adminPool = new Pool({
    user: process.env.ADMIN_USER_NAME,
    host: process.env.POOL_HOST_NAME,
    database: process.env.POOL_DATABASE_NAME,
    password: process.env.ADMIN_PASSWORD,
    port: process.env.POOL_PORT,
});

// Standard user pool
const standardPool = new Pool({
    user: process.env.STANDARD_USER_NAME,
    host: process.env.POOL_HOST_NAME,
    database: process.env.POOL_DATABASE_NAME,
    password: process.env.STANDARD_PASSWORD,
    port: process.env.POOL_PORT,
});

// Function to query with the appropriate pool
const query = async (text, params, isAdmin = false) => {
    try {
        const pool = isAdmin ? adminPool : standardPool;
        const result = await pool.query(text, params);
        return result;
    } catch (err) {
        console.log(err);
    }
};

module.exports = {
    query,
};
