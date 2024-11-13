const { query } = require("../config/db");
const BaseModel = require("./base_resource-model");

const CartsModel = Object.create(BaseModel);
CartsModel.tableName = "carts";

CartsModel.getCartByEmail = async (email) => {
  try {
    const queryText = `SELECT * FROM carts WHERE account_email = $1`;
    const queryParams = [email];
    const result = await query(queryText, queryParams);
    return result.rows[0];
  } catch (error) {
    throw new Error(error);
  }
};

//TODO: needs to search for variants when getting products
CartsModel.getCartProducts = async (cartId) => {
  try {
    const queryText = `
    SELECT
      p.name AS product_name,
      p.description AS product_description,
      p.price AS product_price,
      cp.quantity AS cart_quantity
    FROM products AS p
    JOIN carts_products AS cp
      ON p.id = cp.product_id
    WHERE
      cp.cart_id = $1`;
    const queryParams = [cartId];
    const result = await query(queryText, queryParams);
    if (result.rows.length === 0) {
      return null;
    }
    return result.rows;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = CartsModel;
