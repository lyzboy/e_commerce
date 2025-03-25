const herosModel = require("../models/heros-model");

exports.getHeros = async (req, res) => {
  try {
    const heros = await herosModel.getHeros();
    if (heros.length === 0) {
      return res.status(404).json({ message: "No heros found." });
    }
    res.status(200).json(heros);
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};
