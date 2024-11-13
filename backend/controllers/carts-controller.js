exports.getCart = (req, res) => {
  res.status(200).json({ message: "Get cart" });
};

exports.updateCart = (req, res) => {
  res.status(200).json({ message: "Update cart" });
};
exports.createCart = (req, res) => {
  res.status(200).json({ message: "Create cart" });
};

exports.deleteCart = (req, res) => {
  res.status(200).json({ message: "Delete cart" });
};
