const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/user');

describe('User API', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost/testdb', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await User.deleteMany();
  });

  describe('GET /users', () => {
    it('should return all users', async () => {
      await User.create({ username: 'user1', email: 'user1@example.com' });
      await User.create({ username: 'user2', email: 'user2@example.com' });

      const res = await request(app).get('/users');

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body[0].username).toBe('user1');
      expect(res.body[1].username).toBe('user2');
    });
  });

  describe('POST /users', () => {
    it('should create a new user', async () => {
      const res = await request(app)
        .post('/users')
        .send({ username: 'user1', email: 'user1@example.com' });

      expect(res.status).toBe(200);
      expect(res.body.username).toBe('user1');
      expect(res.body.email).toBe('user1@example.com');
    });
  });
});
