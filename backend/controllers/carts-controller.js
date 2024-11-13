const cartModel = require("../models/carts-model");

exports.getCart = (req, res) => {
  res.status(200).json({ message: "Get cart" });
};

exports.updateCart = (req, res) => {
  res.status(200).json({ message: "Update cart" });
};

exports.deleteCart = (req, res) => {
  res.status(200).json({ message: "Delete cart" });
};
