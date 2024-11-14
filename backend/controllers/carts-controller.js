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

exports.updateCart = async (req, res) => {
  try {
    const { productId, cartId, quantity, variantAttributeValueId } = req.body;
    if (req.user.cartId) {
      cartId = req.user.cartId;
    }
    if (!productId || !cartId || !quantity) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const results = await cartModel.addProductToCart(
      productId,
      cartId,
      quantity,
      variantAttributeValueId
    );
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: "Server Error: " + error.message });
  }
};

exports.deleteCart = async (req, res) => {
  try {
    const { cartProductId } = req.body;
    if (!cartProductId) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const results = await cartModel.deleteProductFromCart(cartProductId);
    res.status(200).json({ message: `Deleted ${results} row(s)` });
  } catch (error) {
    res.status(500).json({ message: "Server Error: " + error.message });
  }
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
