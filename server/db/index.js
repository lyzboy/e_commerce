const Pool = require("pg").Pool;
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "ecommerce",
    password: "postgres",
    port: 5432,
});

const query = (text, params, callback) => {
    return pool.query(text, params, callback);
};

module.exports = {
    query,
};
