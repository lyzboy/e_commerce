require("dotenv").config();

const Pool = require("pg").Pool;
const pool = new Pool({
    user: process.env.POOL_USER_NAME,
    host: process.env.POOL_HOST_NAME,
    database: process.env.POOL_DATABASE_NAME,
    password: process.env.POOL_PASSWORD,
    port: process.env.POOL_PORT,
});

const query = (text, params, callback) => {
    return pool.query(text, params, callback);
};

module.exports = {
    query,
};
