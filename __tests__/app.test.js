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
  it('200: Returns correct object when passed with specified id', () => {
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
  it('200: Returns an array', () => {
    return request(app)
      .get('/api/users')
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users).toBeInstanceOf(Array);
      });
  });
  it('200: Returns an array with data', () => {
    return request(app)
      .get('/api/users')
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users.length).not.toBe(0);
      });
  });
  it('200: Returns an array of objects with specified keys and value types', () => {
    return request(app)
      .get('/api/users')
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
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
