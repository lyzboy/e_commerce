const db = require("../../config/db");

const seedHeros = async (heros) => {
  try {
    const queries = heros.map((hero) => {
      const {
        categoryId,
        productId,
        layout,
        heading,
        subTitle1,
        subTitle2,
        bgColor,
        textColor,
      } = heros;
      return db.query(
        "INSERT INTO heros (category_id, product_id, layout, heading, sub_title_1, sub_title_2, background_color, text_color) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
        [
          categoryId,
          productId,
          layout,
          heading,
          subTitle1,
          subTitle2,
          bgColor,
          textColor,
        ]
      );
    });
    await Promise.all(queries);
  } catch (error) {
    throw new Error("Seeding Heros: " + error);
  }
};

module.exports = seedHeros;
