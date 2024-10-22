const { query } = require("../config/db");

/**
 * Queries the database to retrieve all categories.
 * @param {object} object - and object containing the optional query parameters
 * @returns array
 */
exports.getCategories = async ({ limit = 25, offset = 0, name } = {}) => {
    // Start with the base query
    let queryText = `SELECT * FROM categories`;
    const queryParams = [];

    // Add filters based on query parameters
    if (name) {
        queryParams.push(`%${name}%`); // Add name filter
        queryText += ` WHERE name ILIKE $${queryParams.length}`;
    }

    // Add ordering, limit, and offset for pagination
    queryText += ` ORDER BY name ASC LIMIT $${queryParams.length + 1} OFFSET $${
        queryParams.length + 2
    }`;
    queryParams.push(limit);
    queryParams.push(offset);

    // Execute the query
    const results = await query(queryText, queryParams);
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
        [name, description],
        true
    );
    return results.rows[0];
};

/**
 * Gets a single ID from the database
 * @param {string} id - the ID of the category
 * @returns
 */
exports.getCategory = async (id) => {
    let queryText = `SELECT * FROM categories`;
    const queryParams = [];
    if (id) {
        queryParams.push(id); // Add name filter
        queryText += ` WHERE id = $${queryParams.length}`;
    }
    console.log(`params in model= ${queryParams}`);

    const results = await query(queryText, queryParams);
    return results.rows[0];
};

/**
 *
 * @param {object} categoryObject - the category object to update
 * @returns
 */
exports.updateCategory = async (categoryObject) => {
    const { name, description, id } = categoryObject;
    let queryText = `UPDATE categories SET `;
    const queryParams = [];
    // used to add comma for multiple params
    let setClauses = [];

    if (name) {
        queryParams.push(name);
        setClauses.push(`name = $${queryParams.length}`);
    }

    if (description) {
        queryParams.push(description);
        setClauses.push(`description = $${queryParams.length}`);
    }

    // Join the clauses with a comma
    queryText += setClauses.join(", ");

    queryParams.push(id);
    queryText += ` WHERE id = $${queryParams.length} RETURNING *`;

    const results = await query(queryText, queryParams, true);
    return results.rows[0];
};

/**
 * Deletes a category object from the database with the given ID.
 * @param {string} id - the ID of the object to delete
 * @returns {integer} number of items deleted
 */
exports.deleteCategory = async (id) => {
    const results = await query(
        "DELETE FROM categories WHERE id = $1",
        [id],
        true
    );

    return results.rowCount;
};
