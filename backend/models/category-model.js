const { query } = require("../config/db");

/**
 * Queries the database to retrieve all categories.
 */
exports.getCategories = async () => {
        const results = await query(
            "SELECT * FROM categories ORDER BY name ASC"
        );
        return results.rows;

};

/**
 * Creates a new category with provided parameters.
 * @param {string} name - the name of the category
 * @param {string} description - the description of the object
 * @returns 
 */
exports.createCategory = async (name, description) => {
        const results = await query(
            "INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *",
            [name, description]
        );
        return results.rows[0];
};

