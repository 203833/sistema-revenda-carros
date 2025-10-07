import request from 'supertest';
import app from '../app';
import { AppDataSource } from '../config/datasource';
import { User } from '../entities/User';
import bcrypt from 'bcrypt';

describe('Authentication', () => {
  beforeAll(async () => {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
  });

  beforeEach(async () => {
    // Clean users table
    await AppDataSource.getRepository(User).clear();
  });

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user', async () => {
      const userData = {
        username: 'testuser',
        password: 'password123',
        role: 'seller'
      };

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.message).toBe('User created successfully');

      // Verify user was created in database
      const user = await AppDataSource.getRepository(User).findOneBy({ username: 'testuser' });
      expect(user).toBeTruthy();
      expect(user?.username).toBe('testuser');
      expect(user?.role).toBe('seller');
    });

    it('should not register user with existing username', async () => {
      // Create user first
      const hashedPassword = await bcrypt.hash('password123', 10);
      await AppDataSource.getRepository(User).save({
        username: 'testuser',
        password: hashedPassword,
        role: 'seller'
      });

      const userData = {
        username: 'testuser',
        password: 'password123',
        role: 'seller'
      };

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(400);

      expect(response.text).toBe('Username already exists');
    });

    it('should require username and password', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({})
        .expect(400);

      expect(response.text).toBe('Username and password are required');
    });
  });

  describe('POST /api/v1/auth/login', () => {
    beforeEach(async () => {
      // Create test user
      const hashedPassword = await bcrypt.hash('password123', 10);
      await AppDataSource.getRepository(User).save({
        username: 'testuser',
        password: hashedPassword,
        role: 'seller'
      });
    });

    it('should login with valid credentials', async () => {
      const loginData = {
        username: 'testuser',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.message).toBe('Login successful');
      expect(response.body.token).toBeTruthy();
      expect(response.body.user.username).toBe('testuser');
      expect(response.body.user.role).toBe('seller');
    });

    it('should not login with invalid credentials', async () => {
      const loginData = {
        username: 'testuser',
        password: 'wrongpassword'
      };

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.text).toBe('Invalid credentials');
    });

    it('should require username and password', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({})
        .expect(400);

      expect(response.text).toBe('Username and password are required');
    });
  });
});
