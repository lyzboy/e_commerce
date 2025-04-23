const { query } = require("../config/db");

const formatHero = (result) => {
  return {
    id: result.id,
    categoryId: result.category_id,
    productId: result.product_id,
    layout: result.layout,
    heading: result.heading,
    subTitle1: result.sub_title_1,
    subTitle2: result.sub_title_2,
    backgroundColor: result.background_color,
    textColor: result.text_color,
    imageurl: result.imageurl,
  };
};

const HERO_ERROR = "HERO MODEL ERROR: ";

exports.getAllHeros = async () => {
  try {
    let queryText = "SELECT * FROM heros;";
    const queryParams = [];
    const results = query(queryText, queryParams, true);
    return formatHero(results);
  } catch (error) {
    throw new Error(HERO_ERROR + error);
  }
};

exports.createHero = async (hero) => {
  const {
    categoryId,
    productId,
    layout,
    heading,
    subTitle1,
    subTitle2,
    backgroundColor,
    textColor,
    imageurl,
  } = hero;

  // Base query and parameters
  let queryText = `INSERT INTO heros (`;
  let queryValues = `VALUES (`;
  const queryParams = [];
  let paramIndex = 1;

  // Dynamically add fields and values
  if (categoryId) {
    queryText += `category_id, `;
    queryValues += `$${paramIndex}, `;
    queryParams.push(categoryId);
    paramIndex++;
  }
  if (productId) {
    queryText += `product_id, `;
    queryValues += `$${paramIndex}, `;
    queryParams.push(productId);
    paramIndex++;
  }

  // Add required fields
  queryText += `layout, heading, sub_title_1, sub_title_2, background_color, text_color, imageurl)`;
  queryValues += `$${paramIndex}, $${paramIndex + 1}, $${paramIndex + 2}, $${
    paramIndex + 3
  }, $${paramIndex + 4}, $${paramIndex + 5}, $${paramIndex + 6})`;
  queryParams.push(
    layout,
    heading,
    subTitle1,
    subTitle2,
    backgroundColor,
    textColor,
    imageurl
  );

  // Combine query text
  queryText += queryValues;

  // add returning clause
  queryText += ` RETURNING *;`;

  // Execute query
  const results = await query(queryText, queryParams, true);
  return formatHero(results.rows[0]);
};
