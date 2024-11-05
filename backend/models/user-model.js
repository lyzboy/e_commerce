const { query } = require("../config/db");

exports.findUserById = async (id) => {
  try {
    const queryText = "SELECT * FROM users WHERE id = $1";
    const queryParams = [id];
    const results = await query(queryText, queryParams);
    return results.rows[0];
  } catch (error) {
    throw new Error(error);
  }
};

exports.createUser = async (userObject) => {
  try {
    const {
      email,
      username,
      name,
      password,
      streetName,
      streetNumber,
      city,
      state,
      zipCode,
      phoneNumber,
    } = userObject;

    let phoneId = null;
    if (phoneNumber) {
      phoneId = await this.createPhoneNumber(phoneNumber);
    }
    const valuesArray = [];
    const queryText = "INSERT";
  } catch (error) {
    throw new Error(error);
  }
};

exports.createCity = async (city, state) => {
  try {
    //TODO: check if city already exists
    const stateId = getState(state);
    const queryText = "INSERT INTO cities VALUES ($1, $2) RETURNING *";
    const queryParams = [city, stateId];
    const results = await query(queryText, queryParams);
    return results.rows[0].id;
  } catch (error) {
    throw new Error(error);
  }
};

exports.getStateId = async (state) => {
  try {
    const queryText = "SELECT id FROM states WHERE state = $1";
    const queryParams = [state];
    const results = await query(queryText, queryParams);
    return results.rows[0].id;
  } catch (error) {
    throw new Error(error);
  }
};

exports.createPhoneNumber = async (phoneNumber) => {
  try {
    //TODO: check if phone number already exists
    const queryText = "INSERT INTO phones VALUES ($1) RETURNING *";
    const queryParams = [phoneNumber];
    const results = await query(queryText, queryParams);
    return results.rows[0].id;
  } catch (error) {
    throw new Error(error);
  }
};
