const herosModel = require("../models/heros-model");

exports.getHeros = async (req, res) => {
  try {
    const heros = await herosModel.getAllHeros();
    if (heros.length === 0) {
      return res.status(404).json({ message: "No heros found." });
    }
    res.status(200).json(heros);
  } catch (error) {
    res.status(500).json({ message: "Server Error: " + error.message });
  }
};

exports.createHero = async (req, res) => {
  try {
    const hero = req.body;
    if (Object.keys(hero).length === 0) {
      return res.status(400).json({ message: "Bad Request: Invalid data." });
    }
    if (!hero.categoryId || !hero.productId) {
      return res.status(400).json({ message: "Bad Request: Invalid data." });
    }
    const newHero = await herosModel.createHero(hero);
    res.status(201).json(newHero);
  } catch (error) {
    res.status(500).json({ message: "Server Error: " + error.message });
  }
};
