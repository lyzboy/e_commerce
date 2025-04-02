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
  let queryText = `INSERT INTO heros(category_id, product_id, 
  layout, heading, sub_title_1, sub_title_2, background_color, 
  text_color, imageurl) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`;
  const queryParams = [];
  categoryId ? queryParams.push(categoryId) : queryParams.push("NULL");
  productId ? queryParams.push(productId) : queryParams.push("NULL");
  if (!layout) {
    throw new Error(HERO_ERROR + "Missing layout.");
  }
};
