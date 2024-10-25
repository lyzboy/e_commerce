const { query } = require("../config/db");

exports.getProducts = async (paramsObject) => {
    const { categoryId, minPrice, maxPrice } = paramsObject;
    const queryText = "SELECT * FROM products";
    const queryParams = [];

    const exampleQuery = `SELECT * FROM products 
    JOIN products_categories 
    ON products.id = products_categories.product_id
    JOIN categories
    ON categories.id = products_categories.category_id
    WHERE categories.id = ${categoryId} AND products.price BETWEEN ${minPrice} AND ${maxPrice}`;

    if (categoryID) {
        queryParams.push(categoryID);
        // join table category products
    }
    const results = query(queryText, queryParams);
    return results.rows;
};
exports.createProduct = async () => {};
exports.getProduct = async () => {};
exports.updateProduct = async () => {};
exports.deleteProduct = async () => {};
