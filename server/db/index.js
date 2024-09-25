const Pool = require("pg").Pool;
const pool = new Pool({
    user: "postgres", //TODO: move to env
    host: "localhost", //TODO: move to env
    database: "ecommerce", //TODO: move to env
    password: "postgres", //TODO: move to env
    port: 5432, //TODO: move to env
});

const query = (text, params, callback) => {
    return pool.query(text, params, callback);
};

module.exports = {
    query,
};
