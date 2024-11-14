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
          p.name AS name,
          p.description AS description,
          p.brand,
          p.weight,
          p.weight_units,
          cp.quantity AS quantity,
          COALESCE(pv.price, p.price) AS price,  -- Use variant price if available, otherwise product price
          av1.value as variant_1,
          av2.value as variant_2,
          av3.value as variant_3,
          av4.value as variant_4,
          av5.value as variant_5
      FROM carts_products AS cp
      JOIN carts AS c ON cp.cart_id = c.id
      JOIN products AS p ON p.id = cp.product_id
      LEFT JOIN variant_attribute_values AS vav ON vav.id = cp.variant_attribute_value_id  -- Use LEFT JOIN here
      LEFT JOIN product_variants AS pv ON pv.id = vav.product_variant_id
      LEFT JOIN attribute_values AS av1 ON av1.id = vav.attribute_value_1_id
      LEFT JOIN attribute_values AS av2 ON av2.id = vav.attribute_value_2_id
      LEFT JOIN attribute_values AS av3 ON av3.id = vav.attribute_value_3_id
      LEFT JOIN attribute_values AS av4 ON av4.id = vav.attribute_value_4_id
      LEFT JOIN attribute_values AS av5 ON av5.id = vav.attribute_value_5_id
    `;

    const queryParams = [];

    if (cartId) {
      queryText += ` WHERE c.id = $1`;
      queryParams.push(cartId);
    } else if (userEmail) {
      // have to search for cartId first
      queryText += ` WHERE c.account_email = $1`;
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
    await query(queryText, queryParams, true);
    return null;
  } catch (error) {
    throw new Error(error);
  }
};
