const { readCategories } = require('../models/games-model');

exports.getCategories = (req, res, next) => {
  readCategories().then((categories) => {
    res.status(200).send({ categories });
  });
};
