const { query } = require("../config/db");

exports.getProducts = async ({ categoryId, minPrice, maxPrice }) => {
    let queryText = "SELECT * FROM products";
    const queryParams = [];
    const conditions = [];

    // Add JOINs and filter by category if categoryId is provided
    if (categoryId) {
        queryText += ` JOIN products_categories 
                       ON products.id = products_categories.product_id
                       JOIN categories
                       ON categories.id = products_categories.category_id`;
        conditions.push(`categories.id = $${queryParams.length + 1}`);
        queryParams.push(categoryId);
    }

    // Add price conditions if specified
    if (minPrice) {
        conditions.push(`products.price >= $${queryParams.length + 1}`);
        queryParams.push(minPrice);
    }
    if (maxPrice) {
        conditions.push(`products.price <= $${queryParams.length + 1}`);
        queryParams.push(maxPrice);
    }

    // Combine all conditions with WHERE/AND logic
    if (conditions.length > 0) {
        queryText += ` WHERE ` + conditions.join(" AND ");
    }

    const results = await query(queryText, queryParams);
    return results.rows;
};

exports.createProduct = async () => {};
exports.getProduct = async () => {};
exports.updateProduct = async () => {};
exports.deleteProduct = async () => {};
