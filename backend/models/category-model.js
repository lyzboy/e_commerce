const { query } = require("../config/db");

/**
 * Queries the database to retrieve all categories.
 */
exports.getCategories = async (limit = "25") => {
    console.log(`limit = ${limit}`);
    const results = await query(
        `SELECT * FROM categories ORDER BY name ASC LIMIT $1`,
        [limit]
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

/**
 * Gets a single ID from the database
 * @param {string} id - the ID of the category
 * @returns
 */
exports.getCategory = async (id) => {
    const results = await query("SELECT * FROM categories WHERE id = $1", [id]);
    return results.rows[0];
};

/**
 *
 * @param {object} categoryObject - the category object to update
 * @returns
 */
exports.updateCategory = async (categoryObject) => {
    const results = await query(
        "UPDATE categories SET name = $1, description = $2 WHERE id = $3 RETURNING *",
        [categoryObject.name, categoryObject.description, categoryObject.id]
    );
    return results.rows[0];
};

/**
 * Deletes a category object from the database with the given ID.
 * @param {string} id - the ID of the object to delete
 * @returns
 */
exports.deleteCategory = async (id) => {
    const results = await query("DELETE FROM categories WHERE id = $1", [id]);

    return results.rowCount;
};
