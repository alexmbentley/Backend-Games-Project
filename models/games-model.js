const db = require('../db/connection');

exports.readCategories = () => {
  return db.query(`SELECT * FROM categories;`).then((result) => {
    return result.rows;
  });
};

exports.readReviewObject = (id) => {
  return db
    .query(
      `SELECT reviews.review_id,  title, designer, review_body, review_img_url, reviews.votes, category, owner, reviews.created_at, COUNT(comment_id)::INT AS comment_count
        FROM reviews 
        LEFT JOIN comments on comments.review_id = reviews.review_id
        GROUP BY reviews.review_id`
    )
    .then((data) => {
      newData = data.rows;
      let result = newData.find((item) => item.review_id == id);
      if (result !== undefined) {
        return result;
      } else {
        return Promise.reject({ status: 404, msg: `Review id doesn't exist` });
      }
    });
};

exports.readUsers = () => {
  return db.query(`SELECT * FROM users;`).then((result) => {
    return result.rows;
  });
};

exports.increaseVotes = (id, votes) => {
  return db
    .query(
      `UPDATE reviews SET votes = $1 + votes WHERE review_id = $2 RETURNING *`,
      [votes, id]
    )
    .then(({ rows }) => {
      if (rows.length > 0) {
        return rows[0];
      } else {
        return Promise.reject({ status: 404, msg: `Review id doesn't exist` });
      }
    });
};

exports.readReviews = (category, sort_by = 'created_at', order = 'desc') => {
  const validCategory = [
    'euro game',
    'dexterity',
    `social-deduction`,
    `childrens-games`,
    undefined,
  ];
  const validOrders = ['asc', 'desc'];
  const validColumns = [
    'review_id',
    'title',
    'designer',
    'review_body',
    'review_img_url',
    'votes',
    'category',
    'owner',
    'created_at',
  ];
  if (!validColumns.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: 'bad request' });
  }

  if (!validOrders.includes(order)) {
    return Promise.reject({ status: 400, msg: 'bad request' });
  }

  if (!validCategory.includes(category)) {
    return Promise.reject({ status: 400, msg: 'bad request' });
  }

  if (category === `childrens-games`) {
    category = `children''s games`;
  }
  if (category === `social-deduction`) {
    category = `social deduction`;
  }

  let queryStr = `SELECT reviews.review_id,  title, designer, review_body, review_img_url, reviews.votes, category, owner, reviews.created_at, COUNT(comment_id)::INT AS comment_count
  FROM reviews 
  LEFT JOIN comments on comments.review_id = reviews.review_id`;

  if (category) {
    queryStr += ` WHERE reviews.category = '${category}'`;
  }

  queryStr += ` GROUP BY reviews.review_id`;

  if (order === 'asc') {
    queryStr += ` ORDER BY ${sort_by} ASC`;
  } else {
    queryStr += ` ORDER BY ${sort_by} DESC`;
  }
  console.log(order, '<<model order');
  return db.query(queryStr).then((data) => {
    return data.rows;
  });
};

exports.readComments = (reviewId) => {
  let inputId = [];
  inputId.push(reviewId);
  return db
    .query(`SELECT * FROM comments WHERE review_id = $1;`, inputId)
    .then((result) => {
      if (result.rows.length === 0) {
        return db
          .query(`SELECT * FROM reviews WHERE review_id = $1`, [reviewId])
          .then(({ rows }) => {
            if (rows.length === 0) {
              return Promise.reject({
                status: 404,
                msg: `review_id doesn't exist`,
              });
            } else {
              return Promise.reject({
                status: 200,
                msg: `review_id exists but has no comments`,
              });
            }
          });
      } else {
        return result.rows;
      }
    });
};

exports.postComment = (id, comment) => {
  return db
    .query(
      `INSERT INTO comments (review_id, author, body) VALUES ($1, $2, $3) RETURNING  *`,
      [id, comment.username, comment.body]
    )
    .then((result) => {
      return result.rows[0];
    });
};
