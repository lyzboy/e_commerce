const { query } = require("../config/db");
const userModel = require("../models/user-model");

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

exports.updateUser = async (req, res) => {
  try {
    const email = req.body.email;
    // get the rest of the body details. found in users.test.js
    const loggedInEmail = req.user.email;
    if (!email)
      return res.status(400).json({ message: "Bad Request: Missing User ID" });
    // send the user object, not just the email. This object needs to contain all
    // data that needs updated. don't leave null if not updated.
    const results = await userModel.updateUserByEmail(email);
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

exports.updatePasswordWithRecovery = async (req, res) => {
  try {
    const { code, password } = req.body;
    if (!code || !password)
      return res
        .status(400)
        .json({ message: "Bad Request: Missing code or password" });
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
