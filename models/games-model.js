const db = require('../db/connection');

const readCategories = () => {
  return db.query(`SELECT * FROM categories;`).then((result) => {
    return result.rows;
  });
};

const readReviewObject = (id) => {
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

const readUsers = () => {
  return db.query(`SELECT * FROM users;`).then((result) => {
    return result.rows;
  });
};

const increaseVotes = (id, votes) => {
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

const readReviews = (category, sort_by = 'created_at', order = 'desc') => {
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

  return readCategories()
    .then((result) => {
      let validCategory = [];
      result.forEach((cat) => {
        validCategory.push(cat.slug);
      });

      if (!validColumns.includes(sort_by)) {
        return Promise.reject({ status: 400, msg: 'bad request' });
      }

      if (!validOrders.includes(order)) {
        return Promise.reject({ status: 400, msg: 'bad request' });
      }

      if (!validCategory.includes(category) && category) {
        return Promise.reject({ status: 400, msg: 'bad request' });
      }

      let queryStr = `SELECT reviews.review_id,  title, designer, review_body, review_img_url, reviews.votes, category, owner, reviews.created_at, COUNT(comment_id)::INT AS comment_count
    FROM reviews 
    LEFT JOIN comments on comments.review_id = reviews.review_id`;
      const sqlParams = [];
      if (category) {
        sqlParams.push(category);
        queryStr += ` WHERE reviews.category = $1`;
      }

      queryStr += ` GROUP BY reviews.review_id`;

      if (order === 'asc') {
        queryStr += ` ORDER BY ${sort_by} ASC`;
      } else {
        queryStr += ` ORDER BY ${sort_by} DESC`;
      }
      return db.query(queryStr, sqlParams);
    })
    .then((data) => {
      return data.rows;
    });
};

const readComments = (reviewId) => {
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

const postComment = (id, comment) => {
  return db
    .query(
      `INSERT INTO comments (review_id, author, body) VALUES ($1, $2, $3) RETURNING  *`,
      [id, comment.username, comment.body]
    )
    .then((result) => {
      return result.rows[0];
    });
};

const deleteCommentFromIDModel = (commentID) => {
  return db
    .query('SELECT * FROM comments WHERE comment_id=$1', [commentID])
    .then((data) => {
      data = data.rows;
      if (data.length > 0) {
        return db.query(`DELETE FROM comments WHERE comment_id=$1`, [
          commentID,
        ]);
      } else {
        return Promise.reject({
          status: 404,
          msg: 'Comment ID not found',
        });
      }
    });
};

module.exports = {
  readCategories,
  readReviewObject,
  readUsers,
  increaseVotes,
  readReviews,
  readComments,
  postComment,
  deleteCommentFromIDModel,
};
