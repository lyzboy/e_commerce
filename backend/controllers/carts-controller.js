const cartModel = require("../models/carts-model");

exports.getCartAdmin = async (req, res) => {
  try {
    const products = await cartModel.getCart(req.params.id);
    if (!products) {
      return res.status(200).json({ message: "Cart is empty" });
    }
    res.status(200).json({ products });
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

exports.getUserCart = async (req, res) => {
  try {
    // check if resources exists for user
    const cart = await cartModel.getCart(null, req.user.email);
    if (!cart) {
      const createdResource = await cartModel.createCart(req.user.email);
      return res.status(200).json({ message: "Cart is empty" });
    }
    const products = await cartModel.getCartById(cart.id);
    if (!products) {
      return res.status(200).json({ message: "Cart is empty" });
    }
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: "Server Error: " + error.message });
  }
};
