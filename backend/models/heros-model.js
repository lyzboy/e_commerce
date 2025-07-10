const { query } = require("../config/db");
const { uploadImage, deleteImage } = require("../util/cloudinaryUtils");

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

exports.getHeroById = async (id) => {
  const queryText = `SELECT * FROM heros WHERE id = $1;`;
  const queryParams = [id];
  const results = await query(queryText, queryParams, true);
  if (results.rowCount === 0) {
    return null;
  }
  return formatHero(results.rows[0]);
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
    imagePath,
  } = hero;

  // the image url from cloudinary
  let imageUrl;
  let imagePublicId;

  if (imagePath) {
    // upload image and get the image url
    const imageResult = await uploadImage(imagePath);
    imageUrl = imageResult.eager.url;

    // collect public_id and save to DB to be able to destroy it later.
    imagePublicId = imageResult.public_id;
  }

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
    imagePath
  );

  // Combine query text
  queryText += queryValues;

  // add returning clause
  queryText += ` RETURNING *;`;

  // Execute query
  const results = await query(queryText, queryParams, true);

  // TODO: add public id to `hero_image_urls` in the `image_public_id` section

  return formatHero(results.rows[0]);
};

exports.updateHero = async (id, hero) => {
  const {
    categoryId,
    productId,
    layout,
    heading,
    subTitle1,
    subTitle2,
    backgroundColor,
    textColor,
    imagePath,
  } = hero;

  // Base query and parameters
  let queryText = `UPDATE heros SET `;
  const queryParams = [];
  let paramIndex = 1;

  // Dynamically add fields
  if (categoryId) {
    queryText += `category_id = $${paramIndex}, `;
    queryParams.push(categoryId);
    paramIndex++;
  }
  if (productId) {
    queryText += `product_id = $${paramIndex}, `;
    queryParams.push(productId);
    paramIndex++;
  }
  if (layout) {
    queryText += `layout = $${paramIndex}, `;
    queryParams.push(layout);
    paramIndex++;
  }
  if (heading) {
    queryText += `heading = $${paramIndex}, `;
    queryParams.push(heading);
    paramIndex++;
  }
  if (subTitle1) {
    queryText += `sub_title_1 = $${paramIndex}, `;
    queryParams.push(subTitle1);
    paramIndex++;
  }
  if (subTitle2) {
    queryText += `sub_title_2 = $${paramIndex}, `;
    queryParams.push(subTitle2);
    paramIndex++;
  }
  if (backgroundColor) {
    queryText += `background_color = $${paramIndex}, `;
    queryParams.push(backgroundColor);
    paramIndex++;
  }
  if (textColor) {
    queryText += `text_color = $${paramIndex}, `;
    queryParams.push(textColor);
    paramIndex++;
  }
  if (imagePath) {
    const imageResults = await uploadImage(imagePath);
    let imageUrl = imageResults.eager.url;

    if (imageUrl) {
      // delete image before assigning new image
      deleteImage(heroImagePublicID);
      queryText += `imageurl = $${paramIndex}, `;
      queryParams.push(imageUrl);
      paramIndex++;
    }
  }
  // Remove trailing comma and space
  queryText = queryText.slice(0, -2);
  queryText += ` WHERE id = $${paramIndex} RETURNING *;`;
  queryParams.push(id);
  // Execute query
  const results = await query(queryText, queryParams, true);
  if (results.rowCount === 0) {
    throw new Error(HERO_ERROR + "Hero not found");
  }
  return formatHero(results.rows[0]);
};

exports.deleteHero = async (heroId) => {
  // check for hero
  const isHeroResults = await query(
    "SELECT * FROM heros WHERE id = $1",
    [heroId],
    true
  );
  if (isHeroResults.rows.length < 1) {
    return 0;
  }
  // remove hero image
  deleteImage(heroImagePublicID);

  const results = await query("DELETE FROM heros WHERE id = $1", [heroId]);
  return 1;
};
