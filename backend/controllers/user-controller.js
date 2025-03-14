const { query } = require("../config/db");
const userModel = require("../models/user-model");
const validator = require("validator");
const { createHashedPassword } = require("../middlewares/authentication");

exports.setPasswordRecovery = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res
        .status(400)
        .json({ message: "Bad Request: Missing email address" });
    const results = await userModel.setPasswordRecovery(email);
    if (!results) {
      return res.status(404).json({ message: "Email not found." });
    }

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: "Server Error: " + error.message });
  }
};

exports.verifyPasswordCode = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code)
      return res.status(400).json({ message: "Bad Request: Missing code" });
    const results = await userModel.verifyPasswordCode(code);
    if (results.message === "unverified") {
      return res.status(400).json({ message: results.message });
    }
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: "Server Error: " + error.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const email = req.user.email;
    if (!email)
      return res.status(400).json({ message: "Bad Request: Missing User ID" });
    const results = await userModel.getUserByEmail(email);
    const returnedResults = {
      email: results.email,
      username: results.username,
      name: results.name,
    };

    //TODO: query for phone and address
    if (results.phone_id == null) {
      returnedResults.phone = null;
    }
    if (results.address_id == null) {
      returnedResults.address = null;
    }
    res.status(200).json(returnedResults);
  } catch (error) {
    res.status(500).json({ message: "Server Error: " + error.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const user = req.body;
    if (!user.email || !user.username || !user.password) {
      return res
        .status(400)
        .json({ message: "Bad Request: Missing User Data" });
    }

    const userObject = this.validateUserData(user);

    const checkedEmail = await userModel.getUserByEmail(userObject.email);
    if (checkedEmail) {
      return res.status(409).json({ message: "Email already in use" });
    }
    // check if username exists
    const userCheck = await userModel.getUserByUsername(user.username);
    if (userCheck) {
      return res.status(409).json({ message: "Username already exists" });
    }
    const newUser = await userModel.createUser(userObject);
    req.logIn(newUser, (err) => {
      if (err) {
        console.error("Error during login:", err);
        return res.status(500).json({ message: "Login failed" });
      }
      res.status(200).json({ message: "logged in" });
    });
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

//TODO utilize validation from create user in this function
exports.updateUser = async (req, res) => {
  try {
    // get the rest of the body details. found in users.test.js
    const loggedInEmail = req.user.email;
    const userObject = {};
    if (req.body.email) {
      userObject.email = req.body.email;
    }
    if (userObject.email != loggedInEmail) {
      return res.status(403).json({
        message: "Forbidden: You are not authorized to edit this account.",
      });
    }
    if (req.body.username) {
      userObject.username = req.body.username;
    }
    if (req.body.name) {
      userObject.name = req.body.name;
    }
    if (req.body.password) {
      userObject.password = req.body.password;
    }
    if (req.body.phone) {
      userObject.phone = req.body.phone;
    }
    if (req.body.address) {
      userObject.address = req.body.address;
    }

    if (!loggedInEmail)
      return res.status(400).json({ message: "Bad Request: Missing User ID" });
    // send the user object, not just the email. This object needs to contain all
    // data that needs updated. don't leave null if not updated.
    let rawResults = await userModel.updateUser(userObject);
    res.status(200).json(rawResults);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error: " + error.message });
  }
};

exports.updatePasswordWithRecovery = async (req, res) => {
  try {
    const { code, password } = req.body;
    if (!code || !password)
      return res
        .status(400)
        .json({ message: "Bad Request: Missing code or password" });
    password = await createHashedPassword(password);
    const results = await userModel.updatePasswordWithRecovery(code, password);
    if (results.message === "unverified") {
      return res.status(400).json({ message: results.message });
    }
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: "Server Error: " + error.message });
  }
};

exports.getUserByEmail = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id)
      return res.status(400).json({ message: "Bad Request: Missing User ID" });
    const results = await userModel.getUserByEmail(id);

    const returnedResults = {
      email: results.email,
      username: results.username,
      name: results.name,
    };

    //TODO: query for phone and address
    if (results.phone_id == null) {
      returnedResults.phone = null;
    }
    if (results.address_id == null) {
      returnedResults.address = null;
    }
    res.status(200).json(returnedResults);
  } catch (error) {
    res.status(500).json({ message: "Server Error: " + error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    if (!req.user.email) {
      return res.status(400).json({ message: "Unauthorized delete request" });
    }
    const results = await userModel.deleteUserByEmail(req.user.email);
    if (results.deleted) {
      return res.status(200).json({ message: "Account successfully deleted" });
    } else {
      throw new Error(
        "Unable to delete. Account has already been deleted or doesn't exist."
      );
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" + error.message });
  }
};

exports.adminDeleteUser = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: "Unauthorized delete request" });
    }
    const results = await userModel.deleteUserByEmail(req.params.id);
    if (results.deleted) {
      return res.status(200).json({ message: "Account successfully deleted" });
    } else {
      throw new Error(
        "Unable to delete. Account has already been deleted or doesn't exist."
      );
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" + error.message });
  }
};

exports.validateUserData = ({
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
