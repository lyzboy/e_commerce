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
