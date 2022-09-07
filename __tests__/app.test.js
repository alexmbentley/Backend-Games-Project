const request = require('supertest');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data');
const app = require('../app');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('Error for wrongly spelled endpoints', () => {
  it('400: Returns error when given invalid path', () => {
    return request(app)
      .get(`/api/us3r`)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe(`Path not found`);
      });
  });
});

describe('GET /api/categories', () => {
  it('200: Returns an array', () => {
    return request(app)
      .get('/api/categories')
      .expect(200)
      .then(({ body }) => {
        const { categories } = body;
        expect(categories).toBeInstanceOf(Array);
      });
  });
  it('200: Returns an array with data', () => {
    return request(app)
      .get('/api/categories')
      .expect(200)
      .then(({ body }) => {
        const { categories } = body;
        expect(categories.length).not.toBe(0);
      });
  });
  it('200: Returns an array of category products with the slug and description', () => {
    return request(app)
      .get('/api/categories')
      .expect(200)
      .then(({ body }) => {
        const { categories } = body;
        categories.forEach((category) => {
          expect(category).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
});

describe('GET /api/reviews/:review_id', () => {
  it('200: Returns correct object when passed with specified id and comment_count where there are 0 comments', () => {
    const reviewId = 5;
    return request(app)
      .get(`/api/reviews/${reviewId}`)
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual({
          Review: {
            review_id: 5,
            title: 'Proident tempor et.',
            category: 'social deduction',
            comment_count: 0,
            designer: 'Seymour Buttz',
            owner: 'mallionaire',
            review_body:
              'Labore occaecat sunt qui commodo anim anim aliqua adipisicing aliquip fugiat. Ad in ipsum incididunt esse amet deserunt aliqua exercitation occaecat nostrud irure labore ipsum. Culpa tempor non voluptate reprehenderit deserunt pariatur cupidatat aliqua adipisicing. Nostrud labore dolor fugiat sint consequat excepteur dolore irure eu. Anim ex adipisicing magna deserunt enim fugiat do nulla officia sint. Ex tempor ut aliquip exercitation eiusmod. Excepteur deserunt officia voluptate sunt aliqua esse deserunt velit. In id non proident veniam ipsum id in consequat duis ipsum et incididunt. Qui cupidatat ea deserunt magna proident nisi nulla eiusmod aliquip magna deserunt fugiat fugiat incididunt. Laboris nisi velit mollit ullamco deserunt eiusmod deserunt ea dolore veniam.',
            review_img_url:
              'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg',
            created_at: '2021-01-07T09:06:08.077Z',
            votes: 5,
          },
        });
      });
  });
  it('200: Returns correct object when passed with specified id, also has comment_count added', () => {
    const reviewId = 2;
    return request(app)
      .get(`/api/reviews/${reviewId}`)
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual({
          Review: {
            review_id: 2,
            title: 'Jenga',
            designer: 'Leslie Scott',
            owner: 'philippaclaire9',
            review_img_url:
              'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
            review_body: 'Fiddly fun for all the family',
            category: 'dexterity',
            created_at: '2021-01-18T10:01:41.251Z',
            votes: 5,
            comment_count: 3,
          },
        });
      });
  });
  it('404: Returns error when user inputs ids that do not exist', () => {
    const reviewId = 999;
    return request(app)
      .get(`/api/reviews/${reviewId}`)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe(`Review id doesn't exist`);
      });
  });
});

describe('GET /api/users', () => {
  it('200: Returns an array of objects with specified keys and value types', () => {
    return request(app)
      .get('/api/users')
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users).toBeInstanceOf(Array);
        expect(users.length).not.toBe(0);
        users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
});

describe('PATCH /api/reviews/:review_id', () => {
  it('200: Responds with an updated review object ', () => {
    const reviewId = 3;
    const votesObj = { inc_votes: 2 };
    return request(app)
      .patch(`/api/reviews/${reviewId}`)
      .send(votesObj)
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Object);
        expect(body.Review).toEqual({
          review_id: 3,
          title: 'Ultimate Werewolf',
          designer: 'Akihisa Okui',
          owner: 'bainesface',
          review_img_url:
            'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
          review_body: "We couldn't find the werewolf!",
          category: 'social deduction',
          created_at: '2021-01-18T10:01:41.251Z',
          votes: 7,
        });
      });
  });
  it('404: Returns message if review_id does not exist', () => {
    const reviewId = 999;
    return request(app)
      .patch(`/api/reviews/${reviewId}`)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe(`Review id doesn't exist`);
      });
  });
  it('400: Returns bad request if input object value is not a number', () => {
    const reviewId = 5;
    const votesObj = { inc_votes: 'notanumber' };
    return request(app)
      .patch(`/api/reviews/${reviewId}`)
      .send(votesObj)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(`Bad request`);
      });
  });
  it('400: Returns bad request if key of object is not correct', () => {
    const reviewId = 5;
    const votesObj = { not_votes: 2 };
    return request(app)
      .patch(`/api/reviews/${reviewId}`)
      .send(votesObj)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(`Bad request`);
      });
  });
});
