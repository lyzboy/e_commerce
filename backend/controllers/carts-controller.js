const cartModel = require("../models/carts-model");

exports.getCartAdmin = async (req, res) => {
  try {
    const cart = await cartModel.getCart(req.params.id);
    if (!cart) {
      return res.status(200).json({ message: "Cart is empty" });
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Server Error: " + error.message });
  }
};

exports.updateCart = (req, res) => {
  res.status(200).json({ message: "Update cart" });
};

exports.deleteCart = (req, res) => {
  res.status(200).json({ message: "Delete cart" });
};

exports.getCartUser = async (req, res) => {
  try {
    // check if resources exists for user
    const cart = await cartModel.getCart(null, req.user.email);
    if (!cart) {
      await cartModel.createCart(req.user.email);
      return res.status(200).json({ message: "Cart is empty" });
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Server Error: " + error.message });
  }
};
