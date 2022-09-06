const {
  readCategories,
  readReviewObject,
  readUsers,
} = require('../models/games-model');

exports.getCategories = (req, res, next) => {
  readCategories()
    .then((categories) => {
      res.status(200).send({ categories });
    })
    .catch(next);
};

exports.getReviewObject = (req, res, next) => {
  const id = req.params.review_id;
  readReviewObject(id)
    .then((reviewObj) => {
      res.status(200).send({ Review: reviewObj });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUsers = (req, res, next) => {
  readUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};
