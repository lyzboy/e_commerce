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
    //TODO: finish implementing the rest of the user fields
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
    let queryText = "INSERT INTO accounts (";
    const fieldsArray = [];
    const valuesIndexes = [];
    if (email) {
      valuesArray.push(email);
      fieldsArray.push("email");
      valuesIndexes.push(`$${valuesArray.length}`);
    }
    if (username) {
      valuesArray.push(username);
      fieldsArray.push("username");
      valuesIndexes.push(`$${valuesArray.length}`);
    }
    if (name) {
      valuesArray.push(name);
      fieldsArray.push("name");
      valuesIndexes.push(`$${valuesArray.length}`);
    }
    if (password) {
      valuesArray.push(password);
      fieldsArray.push("password");
      valuesIndexes.push(`$${valuesArray.length}`);
    }
    if (phoneId) {
      valuesArray.push(phoneId);
      fieldsArray.push("phone_id");
      valuesIndexes.push(`$${valuesArray.length}`);
    }
    queryText += fieldsArray.join(", ");
    queryText += ") VALUES (";
    queryText += valuesIndexes.join(", ");
    queryText += ") RETURNING *";
    const results = await query(queryText, valuesArray);
    if (results.rows.length === 0) {
      throw new Error("Unable to create user");
    }
    return results.rows[0];
  } catch (error) {
    throw new Error(error);
  }
};

exports.getUserByEmail = async (email) => {
  try {
    const queryText = "SELECT * FROM accounts WHERE email = $1";
    const queryParams = [email];
    const results = await query(queryText, queryParams);
    if (results.rows.length === 0) {
      return null;
    }
    return results.rows[0];
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * Gets a user object by the username
 * @param {string} username - the username to search for in the database
 * @returns - the user object with the matching username
 */
exports.getUserByUsername = async (username) => {
  try {
    const queryText = "SELECT * FROM accounts WHERE username = $1";
    const queryParams = [username];
    const results = await query(queryText, queryParams);
    if (results.rows.length === 0) {
      return null;
    }
    return results.rows[0];
  } catch (error) {
    throw new Error(error);
  }
};

exports.createCity = async (city, state) => {
  try {
    const results = await this.getCityByName(city);
    if (results) {
      return results;
    }

    const stateId = this.getState(state);
    const queryText = "INSERT INTO cities VALUES ($1, $2) RETURNING *";
    const queryParams = [city, stateId];
    results = await query(queryText, queryParams);
    return results.rows[0].id;
  } catch (error) {
    throw new Error(error);
  }
};

exports.getCityByName = async (city) => {
  try {
    const queryText = "SELECT id FROM cities WHERE name = $1";
    const queryParams = [city];
    const results = await query(queryText, queryParams);
    if (results.rows.length === 0) {
      return null;
    }
    return results.rows[0];
  } catch (error) {
    throw new Error(error);
  }
};

exports.getStateId = async (state) => {
  try {
    const queryText =
      "SELECT id FROM states WHERE name = $1 OR short_name = $1";
    const queryParams = [state];
    const results = await query(queryText, queryParams);
    return results.rows[0].id;
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * Creates a new phone number in the database if not already existing
 * @param {string} phoneNumber - the phone number to insert into the database
 * @returns - the created phone number's id
 */
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

/**
 * Checks if an account is an admin
 * @param {string} account_email - the accounts email to check if they are an admin
 * @returns a boolean indicating if the account is an admin
 */
exports.getIsUserAdmin = async (account_email) => {
  const queryText = "SELECT * FROM admins WHERE account_email = $1";
  const queryParams = [account_email];
  const results = await query(queryText, queryParams, true);
  if (results.rows.length === 0) {
    return false;
  }
  return true;
};
