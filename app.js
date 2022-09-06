const express = require('express');

const {
  getCategories,
  getReviewObject,
} = require('./contollers/games-controller');

const app = express();
app.use(express.json());

app.get('/api/categories', getCategories);
app.get('/api/reviews/:review_id', getReviewObject);

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    console.log(err, '<<< app');
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }

  let errorPSQLCodes = ['22P02'];
  if (errorPSQLCodes.includes(err.code)) {
    res.status(400).send({ msg: 'Bad request' });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: 'Internal error' });
});

module.exports = app;
