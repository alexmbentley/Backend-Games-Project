const {
  readCategories,
  readReviewObject,
  readUsers,
  increaseVotes,
  readReviews,
  readComments,
  postComment,
  deleteCommentFromIDModel,
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

exports.addVotes = (req, res, next) => {
  const id = req.params.review_id;
  const voteObj = req.body;
  const votes = voteObj.inc_votes;
  increaseVotes(id, votes)
    .then((votesAdded) => {
      res.status(200).send({ Review: votesAdded });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getReviews = (req, res, next) => {
  const { category } = req.query;
  const { order } = req.query;
  const { sort_by } = req.query;
  readReviews(category, sort_by, order)
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getComments = (req, res, next) => {
  const reviewId = req.params.review_id;
  readComments(reviewId)
    .then((comments) => {
      res.status(200).send(comments);
    })
    .catch((err) => {
      next(err);
    });
};

exports.addComment = (req, res, next) => {
  const id = req.params.review_id;
  const newComment = req.body;
  postComment(id, newComment)
    .then((addedComment) => {
      res.status(201).send({ comment: addedComment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteCommentByID = (req, res, next) => {
  let commentID = req.params.comment_id;
  return deleteCommentFromIDModel(commentID)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

exports.getAPI = (req, res, next) => {
  return fs.readFile('./endpoints.json', 'utf-8').then((data) => {
    data = JSON.parse(data);
    res.status(200).send({ data });
    console.log(data, '<< data');
  });
};
