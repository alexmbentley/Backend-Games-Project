const express = require('express');

const {
  getCategories,
  getReviews,
  getReviewObject,
  getUsers,
  addVotes,
  getComments,
  addComment,
} = require('./contollers/games-controller');

const app = express();
app.use(express.json());

app.get('/api/categories', getCategories);
app.get('/api/reviews', getReviews);
app.get('/api/reviews/:review_id', getReviewObject);
app.patch('/api/reviews/:review_id', addVotes);
app.get('/api/reviews/:review_id/comments', getComments);
app.get('/api/users', getUsers);
app.post('/api/reviews/:review_id/comments', addComment);

app.all('/*', (req, res, next) => {
  res.status(404).send({ msg: 'Path not found' });
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});
app.use((err, req, res, next) => {
  let errorPSQLCodes = ['22P02', '2203', '23502'];
  if (err.code === '22P02') {
    res.status(400).send({ msg: 'Bad request' });
  } else if (err.code === '22003') {
    res.status(400).send({ msg: 'Bad request' });
  } else if (err.code === '23502') {
    res.status(400).send({ msg: 'Bad request' });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: 'Internal error' });
});

module.exports = app;
