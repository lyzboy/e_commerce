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

exports.createProduct = async (productObject) => {
    try {
        const { barcode, name, description, price, stock_quantity, variants } =
            productObject;

        let queryText = "INSERT INTO products ";
        let fieldsArray = [];
        let queryParams = [];
        let valuesArray = [];

        if (barcode) {
            fieldsArray.push("barcode");
            queryParams.push(barcode);
            valuesArray.push(`$${queryParams.length}`);
        }
        if (name) {
            fieldsArray.push("name");
            queryParams.push(name);
            valuesArray.push(`$${queryParams.length}`);
        }
        if (description) {
            fieldsArray.push("description");
            queryParams.push(description);
            valuesArray.push(`$${queryParams.length}`);
        }
        if (price) {
            fieldsArray.push("price");
            queryParams.push(price);
            valuesArray.push(`$${queryParams.length}`);
        }
        if (stock_quantity) {
            fieldsArray.push("stock_quantity");
            queryParams.push(stock_quantity);
            valuesArray.push(`$${queryParams.length}`);
        }
        queryText += `(${fieldsArray.join(", ")}) `;
        queryText += `VALUES (${valuesArray.join(", ")}) `;
        queryText += `RETURNING *`;
        const results = await query(queryText, queryParams, true);
        return results.rows[0];
    } catch (error) {
        throw new Error(error);
    }
};
exports.getProduct = async () => {};
exports.updateProduct = async () => {};
exports.deleteProduct = async () => {};
