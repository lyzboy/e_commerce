const { query } = require("../config/db");

/**
 * Queries the database to retrieve all categories.
 */
exports.getCategories = async () => {
    const results = await query("SELECT * FROM categories ORDER BY name ASC");
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

exports.getCategory = async (id) => {
    const results = await query("SELECT * FROM categories WHERE id = $1", [id]);
    results.rows[0];
};

exports.updateCategory = async (categoryObject) => {
    const results = await query(
        "UPDATE categories SET name = $1, description = $2 WHERE id = $3",
        [categoryObject.name, categoryObject.description, categoryObject.id]
    );
    return results.rows[0];
};

exports.deleteCategory = async (id) => {
    const results = await query("DELETE * FROM categories WHERE id = $1", [id]);
};
