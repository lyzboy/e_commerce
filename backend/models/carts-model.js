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

module.exports = CartsModel;
