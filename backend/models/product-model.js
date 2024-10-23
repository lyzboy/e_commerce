const { query } = require("../config/db");

exports.getProducts = async (paramsObject) => {
    const { categoryId, minPrice, maxPrice } = paramsObject;
    const queryText = "SELECT * FROM products";
    const queryParams = [];
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
