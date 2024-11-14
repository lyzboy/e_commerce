const { query } = require("../config/db");

//TODO: return products from cart here.
exports.getCartByEmail = async (email) => {
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
/**
 * Used to get the products in a cart. If using email, provide null for cartId i.e. (null, email)
 * @param {integer} cartId - The id of the cart to get
 * @param {string} userEmail - The email of the user to get the cart
 * @returns
 */
exports.getCart = async (cartId, userEmail) => {
  try {
    let queryText = `
      SELECT
        p.name AS product_name,
        p.description AS product_description,
        p.price AS product_price,
        cp.quantity AS cart_quantity
      FROM products AS p
      JOIN carts_products AS cp ON p.id = cp.product_id
    `;
    const queryParams = [];

    if (cartId) {
      queryText += ` WHERE cp.cart_id = $1`;
      queryParams.push(cartId);
    } else if (userEmail) {
      // have to search for cartId first
      queryText += ` WHERE cp.account_email = $1`;
      queryParams.push(userEmail);
    } else {
      throw new Error("Either cartId or userEmail must be provided");
    }

    const result = await query(queryText, queryParams);
    if (result.rows.length === 0) {
      return null;
    }
    return result.rows;
  } catch (error) {
    throw new Error(error);
  }
};

exports.createCart = async (email) => {
  try {
    const queryText = `INSERT INTO carts (account_email) VALUES ($1)`;
    const queryParams = [email];
    await query(queryText, queryParams);
    return null;
  } catch (error) {
    throw new Error(error);
  }
};
