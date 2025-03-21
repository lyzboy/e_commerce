const authentication = require("../middlewares/authentication");
const validator = require("validator");

const userModel = require("../models/user-model");
const authModel = require("../models/admin-model");

// exports.createUser = async (req, res) => {
//   try {
//     const user = validateUserData(req.body);
//     user.password = await authentication.createHashedPassword(user.password);

//     // check if user exists
//     const emailCheck = await userModel.getUserByEmail(user.email);
//     if (emailCheck) {
//       return res.status(409).json({ message: "Email already exists" });
//     }
//     // check if username exists
//     const userCheck = await userModel.getUserByUsername(user.username);
//     if (userCheck) {
//       return res.status(409).json({ message: "Username already exists" });
//     }
//     const newUser = await userModel.createUser(user);
//     req.logIn(newUser, (err) => {
//       if (err) {
//         console.error("Error during login:", err);
//         return res.status(500).json({ message: "Login failed" });
//       }
//       res.status(200).json({ message: "logged in" });
//     });
//   } catch (error) {
//     if (error instanceof CustomError) {
//       console.error(error);
//       res.status(error.statusCode).json({ message: error.message });
//     } else {
//       console.error(error);
//       res.status(500).json({ message: `${error}` });
//     }
//   }
// };

exports.login = async (req, res) => {
  if (!req.user) {
    console.error("No req,user");
    return res.status(401).json({ message: "Authentication Failed" });
  }
  const isAdmin = await userModel.getIsUserAdmin(req.user.email);
  if (isAdmin) {
    req.user.role = "admin";
  }
  req.logIn(req.user, (err) => {
    if (err) {
      console.error("Error during login:", err);
      return res.status(500).json({ message: "Login failed" });
    }
    res.status(200).json({ message: "logged in" });
  });
};

exports.logout = async (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Error during logout:", err);
      return res.status(500).json({ message: "Logout failed" });
    }
    res.status(200).json({ message: "Logged out" });
  });
};

// /**
//  * Validate the user object
//  * @param {object} param0 - the user object to validate
//  * @returns {object} the validated user object
//  */
// exports.validateUserData = ({
//   email,
//   username,
//   name,
//   password,
//   streetName,
//   streetNumber,
//   city,
//   state,
//   zipCode,
//   phoneNumber,
// }) => {
//   if (!email || !username || !password) {
//     throw new CustomError(
//       422,
//       "Unprocessable Entity: no email, username, or password"
//     );
//   }
//   if (!validator.isEmail(email)) {
//     throw new CustomError(422, "Unprocessable Entity: invalid email");
//   }
//   if (!validator.isAlphanumeric(username, "en-US")) {
//     throw new CustomError(422, "Unprocessable Entity: invalid username");
//   }
//   if (
//     !validator.isStrongPassword(password, {
//       minLength: 8,
//       minLowercase: 1,
//       minUppercase: 1,
//       minNumbers: 1,
//       minSymbols: 1,
//     })
//   ) {
//     throw new CustomError(422, "Unprocessable Entity: invalid password");
//   }
//   if (name) {
//     if (!validator.isAlphanumeric(name, "en-US", { ignore: " " })) {
//       throw new CustomError(422, "Unprocessable Entity: invalid name");
//     }
//   }
//   if (streetName) {
//     if (!validator.isAlphanumeric(streetName, "en-US", { ignore: " ." })) {
//       throw new CustomError(422, "Unprocessable Entity: invalid street name");
//     }
//   }
//   if (streetNumber) {
//     if (!validator.isNumeric(streetNumber)) {
//       throw new CustomError(422, "Unprocessable Entity: invalid street number");
//     }
//   }
//   if (city) {
//     if (!validator.isAlphanumeric(city, "en-US", { ignore: " " })) {
//       throw new CustomError(422, "Unprocessable Entity: invalid city");
//     }
//   }
//   if (state) {
//     if (
//       !validator.isAlpha(state) &&
//       !validator.isLength(state, { min: 2, max: 2 })
//     ) {
//       throw new CustomError(422, "Unprocessable Entity: invalid state");
//     }
//   }
//   if (zipCode) {
//     if (!validator.isPostalCode(zipCode, "US")) {
//       throw new CustomError(422, "Unprocessable Entity: invalid zip code");
//     }
//   }
//   if (phoneNumber) {
//     if (!validator.isMobilePhone(phoneNumber, "en-US")) {
//       throw new CustomError(422, "Unprocessable Entity: invalid phone number");
//     }
//   }

//   return {
//     email,
//     username,
//     name,
//     password,
//     streetName,
//     streetNumber,
//     city,
//     state,
//     zipCode,
//     phoneNumber,
//   };
// };

exports.addAdmin = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await authModel.addAdmin(email);
    if (result === null) {
      return res.status(404).json({ message: "Admin already exists" });
    }
    res.status(200).json({ message: "Admin created" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.removeAdmin = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await authModel.deleteAdmin(email);
    if (result === 0) {
      return res.status(404).json({ message: "Email not found" });
    }
    res.status(200).json({ message: "Admin removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
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
