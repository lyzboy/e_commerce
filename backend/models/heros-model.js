const { query } = require("../../config/db");

const formateHeroObject = (result) => {};
const heroErrorTag = "HERO MODEL ERROR: ";

exports.getHeros = async () => {
  try {
    // create the query
    // validate data
    // convert data to JS format
    // return the data as an array of objects
  } catch (error) {
    // throw the error to the controller
    throw new Error(heroErrorTag + error);
  }
};
