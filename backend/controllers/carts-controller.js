const cartModel = require("../models/carts-model");

exports.getCart = async (req, res) => {
  //TODO: this should only be used by admin. users should not specify the cart id
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }
  let cart;
  if (!req.resource) {
    cart = await cartModel.getCartByEmail(req.user.email);
  } else {
    cart = req.resource;
  }
  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }
  const products = await cartModel.getCartProducts(cart.id);
  if (!products) {
    return res.status(200).json({ message: "Cart is empty" });
  }
  res.status(200).json({ cart, products });
};

exports.updateCart = (req, res) => {
  res.status(200).json({ message: "Update cart" });
};

exports.deleteCart = (req, res) => {
  res.status(200).json({ message: "Delete cart" });
};

exports.getUserCart = (req, res) => {
  //}
  // // check if resources exists for user
  // const resourceByEmail = await resourceModel.getResourceByEmail(
  //   req.user.email
  // );
  // if (resourceByEmail) {
  //   return res.status(403).json({ message: "Access denied" });
  // }
  // const createdResource = await resourceModel.createResource(
  //   req.user.email
  // );
  // req.resource = createdResource;
  // return next();
  res.status(200).json({ message: "User cart" });
};
