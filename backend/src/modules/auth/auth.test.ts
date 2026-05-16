import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app';
import { User } from '../modules/users/user.model';

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/eventbooking_test');
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

afterEach(async () => {
  await User.deleteMany({});
});

describe('POST /api/auth/register', () => {
  it('should register a new user', async () => {
    const res = await request(app).post('/api/auth/register').send({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe('test@example.com');
    expect(res.body.data.accessToken).toBeDefined();
  });

  it('should reject duplicate email', async () => {
    await request(app).post('/api/auth/register').send({
      username: 'user1', email: 'test@example.com', password: 'password123',
    });
    const res = await request(app).post('/api/auth/register').send({
      username: 'user2', email: 'test@example.com', password: 'password123',
    });

    expect(res.status).toBe(409);
  });

  it('should reject invalid email', async () => {
    const res = await request(app).post('/api/auth/register').send({
      username: 'user', email: 'not-an-email', password: 'password123',
    });
    expect(res.status).toBe(400);
  });
});

describe('POST /api/auth/login', () => {
  beforeEach(async () => {
    await request(app).post('/api/auth/register').send({
      username: 'testuser', email: 'test@example.com', password: 'password123',
    });
  });

  it('should login with correct credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'test@example.com', password: 'password123',
    });
    expect(res.status).toBe(200);
    expect(res.body.data.accessToken).toBeDefined();
  });

  it('should reject wrong password', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'test@example.com', password: 'wrongpass',
    });
    expect(res.status).toBe(401);
  });

  it('should reject unknown email', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'nobody@example.com', password: 'password123',
    });
    expect(res.status).toBe(401);
  });
});

describe('GET /api/auth/me', () => {
  it('should return current user when authenticated', async () => {
    const loginRes = await request(app).post('/api/auth/register').send({
      username: 'testuser', email: 'test@example.com', password: 'password123',
    });
    const { accessToken } = loginRes.body.data;

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe('test@example.com');
  });

  it('should return 401 without token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });
});
