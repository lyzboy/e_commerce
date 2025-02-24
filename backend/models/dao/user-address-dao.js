const { query } = require("../../config/db");

/**
 * Creates a new city in the database.
 * @param {string} city
 * @param {int} state - the state's id
 * @returns
 */
exports.createCity = async (city, state) => {
  try {
    if (state === null) {
      throw new Error(`State not found for: ${state}`);
    }
    const queryText = "INSERT INTO cities VALUES (DEFAULT, $1, $2) RETURNING *";
    const queryParams = [city, state];
    results = await query(queryText, queryParams);
    if (results.rows.length === 0) {
      throw new Error(`Unable to create city: ${city}, ${state}`);
    }
    return results.rows[0].id;
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * Creates a new city in the database if not already existing.
 * @param {string} city - the name of the city
 * @returns
 */
exports.getCityIdByName = async (city) => {
  try {
    const queryText = "SELECT id FROM cities WHERE name = $1";
    const queryParams = [city];
    const results = await query(queryText, queryParams);
    if (results.rows.length === 0) {
      return null;
    }
    return results.rows[0].id;
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * Returns the city name for the given city id.
 * @param {int} cityId
 * @returns
 */
exports.getCityNameById = async (cityId) => {
  try {
    const queryText = "SELECT name FROM cities WHERE id = $1";
    const queryParams = [cityId];
    const results = await query(queryText, queryParams);
    return results.rows[0].name;
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * Returns an address object for the given street name id. The object contains streetName, city, state.
 * @param {int} streetNameId
 * @returns
 */
exports.getAddress = async (streetNameId) => {
  try {
    const queryText = `SELECT addresses.street_name AS street, cities.name AS city, states.abbreviation AS state FROM addresses join
     cities on addresses.city_id = cities.id join
     states on states.id = cities.state_id WHERE addresses.id = $1`;
    const queryParams = [streetNameId];
    const results = await query(queryText, queryParams);
    return {
      streetName: results.rows[0].street,
      city: results.rows[0].city,
      state: results.rows[0].state,
    };
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * Returns the state name for the given state id.
 * @param {int} stateId
 * @returns
 */
exports.getStateNameById = async (stateId) => {
  try {
    const queryText = "SELECT name FROM states WHERE id = $1";
    const queryParams = [stateId];
    const results = await query(queryText, queryParams);
    return results.rows[0].name;
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * Returns the state abbreviation for the given state id.
 * @param {int} stateId
 * @returns
 */
exports.getStateAbbreviationById = async (stateId) => {
  try {
    const queryText = "SELECT abbreviation FROM states WHERE id = $1";
    const queryParams = [stateId];
    const results = await query(queryText, queryParams);
    return results.rows[0].name;
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * Creates a new street name in the database if not already existing.
 * @param {string} streetName
 * @param {int} cityId
 * @returns
 */
exports.createStreetName = async (streetName, cityId) => {
  try {
    const queryText =
      "INSERT INTO addresses VALUES (DEFAULT, $1, $2) RETURNING *";
    const queryParams = [streetName, cityId];
    const results = await query(queryText, queryParams);
    if (results.rows.length === 0) {
      throw new Error(`Unable to create street name: ${streetName}, ${cityId}`);
    }
    return results.rows[0].id;
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * Returns the street name id for the given street name.
 * @param {string} streetName
 * @returns
 */
exports.getStreetNameId = async (streetName) => {
  try {
    streetName = streetName.toLowerCase();
    const results = await query(
      "SELECT * FROM addresses WHERE street_name = $1",
      [streetName]
    );
    if (results.rows.length === 0) {
      return null;
    }
    return results.rows[0].id;
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * Returns the street name for the given street name id.
 * @param {int} streetNameId
 * @returns
 */
exports.getStreetNameById = async (streetNameId) => {
  try {
    const queryText = "SELECT street_name FROM addresses WHERE id = $1";
    const queryParams = [streetNameId];
    const results = await query(queryText, queryParams);
    return results.rows[0].name;
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * Returns the state id for the given state name or abbreviation.
 * @param {string} state
 * @returns
 */
exports.getStateId = async (state) => {
  try {
    const queryText =
      "SELECT id FROM states WHERE name = $1 OR abbreviation = $1";
    const queryParams = [state];
    const results = await query(queryText, queryParams);
    if (results.rows.length === 0) {
      throw new Error(`State not found: ${state}`);
    }
    return results.rows[0].id;
  } catch (error) {
    throw new Error(error);
  }
};
