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
