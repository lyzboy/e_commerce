const herosModel = require("../models/heros-model");
const { query } = require("../config/db");

const HeroServerError = (message) => {
  return { message: "Server Error: " + message };
};

exports.getHeros = async (req, res) => {
  try {
    const heros = await herosModel.getAllHeros();
    if (heros.length === 0) {
      return res.status(404).json({ message: "No heros found." });
    }
    res.status(200).json(heros);
  } catch (error) {
    res.status(500).json(HeroServerError(error.message));
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
    res.status(500).json(HeroServerError(error.message));
  }
};

exports.updateHero = async (req, res) => {
  try {
    const heroId = req.params.id;
    const hero = req.body;
    const heroExists = await herosModel.getHeroById(heroId);
    if (!heroExists) {
      return res.status(404).json({ message: "Hero not found." });
    }
    const updatedHero = await herosModel.updateHero(heroId, hero);
    res.status(200).json(updatedHero);
  } catch (error) {
    res.status(500).json(HeroServerError(error.message));
  }
};

exports.deleteHero = async (req, res) => {
  try {
    const heroId = req.params.id;
    const results = await herosModel.deleteHero(heroId);
    if (results != 1) {
      return res.status(404).json({ message: "Hero not found." });
    }
    res.status(200).json({ message: "Hero deleted successfully." });
  } catch (error) {
    res.status(500).json(HeroServerError(error.message));
  }
};
