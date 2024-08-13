const db = require("./index.js");

const getStates = (req, res) => {
    db.query("SELECT * FROM states ORDER BY id ASC", (err, results) => {
        if (err) {
            throw err;
        }
        res.status(200).json(results.rows);
    });
};

module.exports = {
    getStates,
};
