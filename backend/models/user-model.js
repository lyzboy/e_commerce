const { query } = require("../config/db");
const { generateResetCode } = require("../util/helpers");
const authentication = require("../middlewares/authentication");

const userAddressDao = require("./dao/user-address-dao");

exports.setPasswordRecovery = async (email) => {
  try {
    const validEmail = await this.getUserByEmail(email);
    if (!validEmail) {
      return false;
    }
    const code = generateResetCode();
    const expire_date = new Date(Date.now() + 15 * 60 * 1000);
    const queryText =
      "INSERT INTO reset_password_codes (email, expire_time, reset_code) VALUES ($1, $2, $3) RETURNING *";
    const queryParams = [email, expire_date, code];
    const results = await query(queryText, queryParams);
    const finalResults = {
      id: results.rows[0].id,
      email: results.rows[0].email,
      code: results.rows[0].reset_code,
      expireTime: results.rows[0].expire_time,
    };
    return finalResults;
  } catch (error) {
    throw new Error(error);
  }
};

exports.updatePasswordWithRecovery = async (code, password) => {
  try {
    const queryText =
      "SELECT * FROM reset_password_codes WHERE reset_code = $1";
    const queryParams = [code];
    const results = await query(queryText, queryParams);
    if (results.rows.length === 0) {
      return { message: "unverified" };
    }
    const expire_time = new Date(results.rows[0].expire_time);
    if (expire_time < new Date()) {
      return { message: "unverified" };
    }
    const email = results.rows[0].email;
    const queryText2 = "UPDATE accounts SET password = $1 WHERE email = $2";
    const queryParams2 = [password, email];
    await query(queryText2, queryParams2);
    queryText3 = "DELETE FROM reset_password_codes WHERE reset_code = $1";
    queryParams3 = [code];
    await query(queryText3, queryParams3);
    return { message: "Password updated" };
  } catch (error) {
    throw new Error(error);
  }
};

exports.verifyPasswordCode = async (code) => {
  try {
    const queryText =
      "SELECT * FROM reset_password_codes WHERE reset_code = $1";
    const queryParams = [code];
    const results = await query(queryText, queryParams);
    if (results.rows.length === 0) {
      return { message: "unverified" };
    }
    const expire_time = new Date(results.rows[0].expire_time);
    if (expire_time < new Date()) {
      return { message: "unverified" };
    }
    return { message: "verified" };
  } catch (error) {
    throw new Error(error);
  }
};

exports.createUser = async (userObject) => {
  try {
    let { email, username, name, password, address, phoneNumber } = userObject;

    password = await authentication.createHashedPassword(password);

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
      const phoneId = await this.getPhoneNumber(userObject.phone);
      if (phoneId) {
        valuesArray.push(phoneId);
      } else {
        const newPhoneId = await this.createPhoneNumber(userObject.phone);
        valuesArray.push(newPhoneId);
      }
      fieldsArray.push(`phone_id`);
      valuesIndexes.push(`$${valuesArray.length}`);
    }
    if (address) {
      const { streetName, city, state, zipCode } = address;
      if (
        streetName === undefined ||
        city === undefined ||
        state === undefined ||
        zipCode === undefined
      ) {
        throw new Error(
          `Missing address fields for: ${JSON.stringify(address)}`
        );
      }
      let retrievedZipcodeId = await userAddressDao.getZipcodeId(zipCode);
      if (!retrievedZipcodeId) {
        retrievedZipcodeId = await userAddressDao.createZipcode(zipCode);
      }
      let retrievedStreetNameId = await userAddressDao.getStreetNameId(
        streetName
      );
      let retrievedCityId = await userAddressDao.getCityIdByName(city);
      const retrievedStateId = await userAddressDao.getStateId(state);
      if (!retrievedCityId) {
        retrievedCityId = await userAddressDao.createCity(
          city,
          retrievedStateId
        );
      }
      if (!retrievedStreetNameId) {
        // create street name
        retrievedStreetNameId = await userAddressDao.createStreetName(
          streetName,
          retrievedCityId,
          retrievedZipcodeId
        );
      }
      valuesArray.push(retrievedStreetNameId);
      fieldsArray.push(`address_id`);
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
    const finalResults = {
      email: results.rows[0].email,
      username: results.rows[0].username,
      name: results.rows[0].name,
    };
    finalResults.phone = await this.getPhoneNumberById(
      results.rows[0].phone_id
    );
    finalResults.address = await userAddressDao.getAddress(
      results.rows[0].address_id
    );
    return finalResults;
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

exports.updateUser = async (userObject) => {
  try {
    let queryText = "UPDATE accounts SET ";
    const valuesArray = [userObject.email];
    const fieldsArray = [];
    if (userObject.username) {
      valuesArray.push(userObject.username);
      fieldsArray.push(`username = $${valuesArray.length}`);
    }
    if (userObject.password) {
      const newPassword = await authentication.createHashedPassword(
        userObject.password
      );
      valuesArray.push(newPassword);
      fieldsArray.push(`password = $${valuesArray.length}`);
    }
    if (userObject.name) {
      valuesArray.push(userObject.name);
      fieldsArray.push(`name = $${valuesArray.length}`);
    }
    if (userObject.phone) {
      const phoneId = await this.getPhoneNumber(userObject.phone);
      if (phoneId) {
        valuesArray.push(phoneId);
      } else {
        const newPhoneId = await this.createPhoneNumber(userObject.phone);
        valuesArray.push(newPhoneId);
      }
      fieldsArray.push(`phone_id = $${valuesArray.length}`);
    }
    if (userObject.address) {
      const { streetName, city, state, zipCode } = userObject.address;
      if (
        streetName === undefined ||
        city === undefined ||
        state === undefined ||
        zipCode === undefined
      ) {
        throw new Error("Missing address fields");
      }
      let retrievedStreetNameId = await userAddressDao.getStreetNameId(
        streetName
      );
      let retrievedCityId = await userAddressDao.getCityIdByName(city);
      const retrievedStateId = await userAddressDao.getStateId(state);
      if (!retrievedCityId) {
        retrievedCityId = await userAddressDao.createCity(
          city,
          retrievedStateId
        );
      }
      if (!retrievedStreetNameId) {
        // create street name
        retrievedStreetNameId = await userAddressDao.createStreetName(
          streetName,
          retrievedCityId,
          zipCode
        );
      }
      valuesArray.push(retrievedStreetNameId);
      fieldsArray.push(`address_id = $${valuesArray.length}`);
    }
    queryText += fieldsArray.join(", ");
    queryText += " WHERE email = $1 RETURNING *";
    const results = await query(queryText, valuesArray, true);
    if (results.rows.length === 0) {
      throw new Error("Unable to update user");
    }
    const finalResults = {
      email: results.rows[0].email,
      username: results.rows[0].username,
      name: results.rows[0].name,
    };
    finalResults.phone = await this.getPhoneNumberById(
      results.rows[0].phone_id
    );
    finalResults.address = await userAddressDao.getAddress(
      results.rows[0].address_id
    );
    return finalResults;
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

exports.getPhoneNumber = async (phoneNumber) => {
  try {
    const queryText = "SELECT * FROM phones WHERE number = $1";
    const queryParams = [phoneNumber];
    const results = await query(queryText, queryParams);
    if (results.rows.length === 0) {
      return null;
    }
    return results.rows[0].id;
  } catch (error) {
    throw new Error(error);
  }
};

exports.getPhoneNumberById = async (phoneId) => {
  try {
    if (!phoneId) {
      throw new Error("Phone ID is required");
    }
    const queryText = "SELECT number FROM phones WHERE id = $1";
    const queryParams = [phoneId];
    const results = await query(queryText, queryParams);
    return results.rows[0].number;
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
    const queryText = "INSERT INTO phones VALUES (DEFAULT, $1) RETURNING *";

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

exports.deleteUserByEmail = async (userEmail) => {
  const queryText = "DELETE FROM accounts WHERE email = $1";
  const queryParams = [userEmail];
  const results = await query(queryText, queryParams, true);
  if (results.rowCount > 0) {
    return { deleted: true };
  } else {
    return { deleted: false };
  }
};
