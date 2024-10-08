const { query } = require("./index.js");

const getStates = (req, res) => {
    query("SELECT * FROM states ORDER BY id ASC", (err, results) => {
        if (err) {
            throw err;
        }
        res.status(200).json(results.rows);
    });
};

const getCategories = async (req, res) => {
    try {
        const results = await query(
            "SELECT * FROM categories ORDER BY name ASC"
        );
        return results.rows;
    } catch (err) {
        throw err;
    }
};

module.exports = {
    getStates,
    getCategories,
};
