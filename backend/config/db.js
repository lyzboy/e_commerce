const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
const Pool = require("pg").Pool;
const pool = new Pool({
    user: process.env.POOL_USER_NAME,
    host: process.env.POOL_HOST_NAME,
    database: process.env.POOL_DATABASE_NAME,
    password: process.env.POOL_PASSWORD.toString(),
    port: process.env.POOL_PORT,
});

const query = async (text, params, callback) => {
    try {
        const result = await pool.query(text, params, callback);
        return result;
    } catch (err) {
        console.log(err);
    }
};

module.exports = {
    query,
};
