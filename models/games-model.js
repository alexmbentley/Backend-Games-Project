const db = require('../db/connection');

exports.readCategories = () => {
  return db.query(`SELECT * FROM categories;`).then((result) => {
    return result.rows;
  });
};

exports.readReviewObject = (id) => {
  let votes = 0;
  return db
    .query(
      `SELECT reviews.review_id, review_body, title, designer, review_img_url, reviews.votes, category, owner, reviews.created_at FROM reviews 
    LEFT JOIN comments 
    ON comments.review_id=reviews.review_id 
    WHERE reviews.review_id=$1`,
      [id]
    )
    .then(({ rows }) => {
      if (rows.length > 0) {
        for (num of rows) {
          if (rows.length === 1) {
            return rows[0];
          } else if (rows.length > 1) {
            num.comment_count = rows.length;
          }
          return rows[0];
        }
      } else {
        return Promise.reject({ status: 404, msg: `Review id doesn't exist` });
      }
    });
};
//     .query(`SELECT * FROM reviews WHERE review_id = $1;`, [id])
//     .then(({ rows }) => {
//       if (rows.length > 0) {
//         return rows[0];
//       } else {
//         return Promise.reject({ status: 404, msg: `Review id doesn't exist` });
//       }
//     });
// };

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
