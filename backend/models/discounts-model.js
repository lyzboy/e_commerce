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

exports.getDiscountByCode = async (code) => {
  try {
    let queryText = `SELECT * FROM discounts WHERE code = $1`;
    const results = await query(queryText, [code]);
    return results.rows[0];
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
) => {
  const queryText = `DELETE FROM products_discounts WHERE `;
  const queryParams = [];
  if (productDiscountId) {
    queryText += `id = $1`;
    queryParams.push(productDiscountId);
  } else {
    if (productId && discountId) {
      queryText += `product_id = $1`;
      queryParams.push(productId);
      queryText += ` AND discount_id = $2`;
      queryParams.push(discountId);
      if (productVariantId) {
        queryText += ` AND product_variant_id = $3`;
        queryParams.push(productVariantId);
      }
    }
  }
  const results = await query(queryText, queryParams);
  return results.rowCount;
};

exports.deleteDiscount = async (id) => {
  try {
    const queryText = `DELETE FROM discounts WHERE id = $1`;
    const queryParams = [id];
    const results = await query(queryText, queryParams);
    return results.rowCount;
  } catch (error) {
    throw new Error(error);
  }
};

exports.getDiscount = async (id) => {
  try {
    const queryText = `SELECT * FROM discounts WHERE id = $1`;
    const queryParams = [id];
    const results = await query(queryText, queryParams);
    if (results.rows.length === 0) {
      return null;
    }
    const result = results.rows[0];
    const formattedResults = {
      id: result.id,
      code: result.code,
      percentOff: parseInt(result.percent_off, 10),
      amountOff: parseFloat(result.amount_off, 10),
      expireDate: new Date(result.expire_date).toISOString().split("T")[0],
      quantity: parseInt(result.quantity, 10),
    };
    return formattedResults;
  } catch (error) {
    throw new Error(error);
  }
};

exports.createDiscount = async (
  code,
  percentOff,
  amountOff,
  expireDate,
  quantity
) => {
  try {
    let queryText = `
      INSERT INTO discounts (percent_off,

    `;
    const queryElements = [];
    const queryParams = [percentOff];
    const queryValues = ["$1"];
    if (code) {
      queryElements.push("code");
      queryParams.push(code);
      queryValues.push(`$${queryParams.length}`);
    }
    if (amountOff) {
      queryElements.push("amount_off");
      queryParams.push(amountOff);
      queryValues.push(`$${queryParams.length}`);
    }
    if (expireDate) {
      queryElements.push("expire_date");
      queryParams.push(expireDate);
      queryValues.push(`$${queryParams.length}`);
    }
    if (quantity) {
      queryElements.push("quantity");
      queryParams.push(quantity);
      queryValues.push(`$${queryParams.length}`);
    }
    queryText += queryElements.join(", ");
    queryText += `) VALUES (${queryValues.join(", ")}) RETURNING *`;
    const results = await query(queryText, queryParams);

    const result = results.rows[0];

    let formattedResults = {
      id: result.id,
      code: result.code,
      percentOff: parseInt(result.percent_off, 10),
      amountOff: parseFloat(result.amount_off, 10),
      expireDate: new Date(result.expire_date).toISOString().split("T")[0],
      quantity: parseInt(result.quantity, 10),
    };

    return formattedResults;
  } catch (error) {
    throw error;
  }
};

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
    const formattedResults = results.rows.map((result) => {
      return {
        id: result.id,
        code: result.code,
        percentOff: parseInt(result.percent_off, 10),
        amountOff: parseFloat(result.amount_off, 10),
        expireDate: new Date(result.expire_date).toISOString().split("T")[0],
        quantity: parseInt(result.quantity, 10),
      };
    });
    return formattedResults;
  } catch (error) {
    throw error;
  }
};
