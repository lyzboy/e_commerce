const authMiddleware = require("../middlewares/auth");
const validator = require("validator");

const { passwordHash } = require("../util/helpers");

const userModel = require("../models/user-model");

exports.createUser = async (req, res) => {
  try {
    const user = validateUser(req.body);
    user.password = await passwordHash(user.password);

    // check if user exists
    const emailCheck = await userModel.getUserByEmail(user.email);
    if (emailCheck) {
      return res.status(409).json({ message: "Email already exists" });
    }
    // check if username exists
    const userCheck = await userModel.getUserByUsername(user.username);
    if (userCheck) {
      return res.status(409).json({ message: "Username already exists" });
    }
    // query the database to create a new user
    const newUser = await userModel.createUser(user);
    // generate a token for the new user
    const token = authMiddleware.generateAccessToken(newUser);
    // return the token in the response
    res.status(200).json(token);
  } catch (error) {
    if (error instanceof CustomError) {
      console.error(error);
      res.status(error.statusCode).json({ message: error.message });
    } else {
      console.error(error);
      res.status(500).json({ message: `${error}` });
    }
  }
};

exports.login = async (req, res) => {};

/**
 * Validate the user object
 * @param {object} param0 - the user object to validate
 * @returns {object} the validated user object
 */
const validateUser = ({
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
}) => {
  if (!email || !username || !password) {
    throw new CustomError(
      422,
      "Unprocessable Entity: no email, username, or password"
    );
  }
  if (!validator.isEmail(email)) {
    throw new CustomError(422, "Unprocessable Entity: invalid email");
  }
  if (!validator.isAlphanumeric(username, "en-US")) {
    throw new CustomError(422, "Unprocessable Entity: invalid username");
  }
  if (
    !validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
  ) {
    throw new CustomError(422, "Unprocessable Entity: invalid password");
  }
  if (name) {
    if (!validator.isAlphanumeric(name, "en-US", { ignore: " " })) {
      throw new CustomError(422, "Unprocessable Entity: invalid name");
    }
  }
  if (streetName) {
    if (!validator.isAlphanumeric(streetName, "en-US", { ignore: " ." })) {
      throw new CustomError(422, "Unprocessable Entity: invalid street name");
    }
  }
  if (streetNumber) {
    if (!validator.isNumeric(streetNumber)) {
      throw new CustomError(422, "Unprocessable Entity: invalid street number");
    }
  }
  if (city) {
    if (!validator.isAlphanumeric(city, "en-US", { ignore: " " })) {
      throw new CustomError(422, "Unprocessable Entity: invalid city");
    }
  }
  if (state) {
    if (
      !validator.isAlpha(state) &&
      !validator.isLength(state, { min: 2, max: 2 })
    ) {
      throw new CustomError(422, "Unprocessable Entity: invalid state");
    }
  }
  if (zipCode) {
    if (!validator.isPostalCode(zipCode, "US")) {
      throw new CustomError(422, "Unprocessable Entity: invalid zip code");
    }
  }
  if (phoneNumber) {
    if (!validator.isMobilePhone(phoneNumber, "en-US")) {
      throw new CustomError(422, "Unprocessable Entity: invalid phone number");
    }
  }

  return {
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
  };
};

class CustomError extends Error {
  constructor(statusCode = 500, ...params) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(...params);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError);
    }

    this.name = "CustomError";
    // Custom debugging information
    this.statusCode = statusCode;
  }
}
