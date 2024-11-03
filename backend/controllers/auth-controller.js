const authMiddleware = require("../middlewares/auth");
const validator = require("validator");

exports.createUser = async (req, res) => {
  console.log(req.body);
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
  } = req.body;

  //  if the password is not hashed, return an error
  if (!validator.isHash(password, "sha256")) {
    return res.status(422).json({ message: "Unprocessable Entity" });
  }
  const token = authMiddleware.generateAccessToken({
    username: req.body.username,
    role: "admin",
  });
  res.status(200).json(token);
};
