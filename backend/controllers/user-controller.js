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

exports.createUser = async (req, res) => {
  try {
    const userObject = req.body;
    if (!userObject.email || !userObject.username || !userObject.password) {
      return res
        .status(400)
        .json({ message: "Bad Request: Missing User Data" });
    }
    const results = await userModel.createUser(userObject);
    res.status(200).json(results);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error: " + error.message });
  }
};

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
