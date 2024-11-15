const { query } = require("../config/db");

exports.getDiscountedProducts = async (limit, page, category) => {
  try {
    let queryText = `
      SELECT 
      products.*,
      COALESCE(MIN(product_variants.price), products.price) AS effective_price
      FROM 
      products
      LEFT JOIN 
      product_variants ON products.id = product_variants.product_id
    `;
    const queryParams = [];
    const conditions = [];

    if (category) {
      queryText += `
      JOIN products_categories 
      ON products.id = products_categories.product_id
      JOIN categories 
      ON categories.id = products_categories.category_id
      `;
      conditions.push(`categories.id = $${queryParams.length + 1}`);
      queryParams.push(category);
    }

    if (conditions.length > 0) {
      queryText += ` WHERE ` + conditions.join(" AND ");
    }

    queryText += ` GROUP BY products.id`;

    if (limit !== undefined) {
      queryText += ` LIMIT $${queryParams.length + 1}`;
      queryParams.push(limit);
    }

    if (page !== undefined) {
      const offset = (page - 1) * limit;
      queryText += ` OFFSET $${queryParams.length + 1}`;
      queryParams.push(offset);
    }

    const results = await query(queryText, queryParams);
    return results.rows;
  } catch (error) {
    throw new Error(error);
  }
};

exports.addDiscountToProduct = async (
  productId,
  discountId,
  productVariantId
) => {
  try {
    let queryText = `
      INSERT INTO product_discounts (product_id, discount_id, product_variant_id)
      VALUES ($1, $2, ${productVariantId ? "$3" : "NULL"})
      RETURNING *
    `;
    const queryParams = [productId, discountId];
    if (productVariantId) {
      queryParams.push(productVariantId);
    }
    const results = await query(queryText, queryParams);
    return results.rows[0];
  } catch (error) {
    throw new Error(error);
  }
};

exports.removeDiscountFromProduct = async (
  productDiscountId,
  productId,
  discountId,
  productVariantId
) => {};

exports.deleteDiscount = async (id) => {};

exports.getDiscount = async (id) => {};

exports.createDiscount = async (
  code,
  percentOff,
  amountOff,
  expireDate,
  quantity
) => {};

exports.getDiscounts = async (limit, page, categoryId) => {
  try {
    let queryText = `SELECT * FROM discounts`;
    const queryParams = [];
    if (categoryId) {
      queryText += `
      JOIN products_discounts 
      ON discounts.id = products_discounts.discount_id
      JOIN products 
      ON products.id = products_discounts.product_id
      JOIN products_categories 
      ON products.id = products_categories.product_id
      JOIN categories 
      ON categories.id = products_categories.category_id
      WHERE categories.id = $1
      `;
      queryParams.push(categoryId);
    }

    if (limit) {
      queryText += ` LIMIT $${queryParams.length + 1}`;
      queryParams.push(limit);
    }

    if (page) {
      const offset = (page - 1) * limit;
      queryText += ` OFFSET $${queryParams.length + 1}`;
      queryParams.push(offset);
    }

    const results = await query(queryText, queryParams);
    return results.rows;
  } catch (error) {
    throw new Error(error);
  }
};
