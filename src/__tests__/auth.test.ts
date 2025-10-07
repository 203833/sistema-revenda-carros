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
    await AppDataSource.getRepository(User).clear();
  });

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user', async () => {
      const userData = {
        nomeUsuario: 'testuser',
        senha: 'password123',
        papel: 'vendedor'
      };

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.mensagem).toBe('Usuário criado com sucesso');

      const user = await AppDataSource.getRepository(User).findOneBy({ nomeUsuario: 'testuser' });
      expect(user).toBeTruthy();
      expect(user?.nomeUsuario).toBe('testuser');
      expect(user?.papel).toBe('vendedor');
    });

    it('should not register user with existing username', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      await AppDataSource.getRepository(User).save({
        nomeUsuario: 'testuser',
        senha: hashedPassword,
        papel: 'vendedor'
      });

      const userData = {
        nomeUsuario: 'testuser',
        senha: 'password123',
        papel: 'vendedor'
      };

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body).toBe('Nome de usuário já existe');
    });
  });

  describe('POST /api/v1/auth/login', () => {
    beforeEach(async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      await AppDataSource.getRepository(User).save({
        nomeUsuario: 'testuser',
        senha: hashedPassword,
        papel: 'vendedor'
      });
    });

    it('should login with valid credentials', async () => {
      const loginData = {
        nomeUsuario: 'testuser',
        senha: 'password123'
      };

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.mensagem).toBe('Login realizado com sucesso');
      expect(response.body.token).toBeDefined();
      expect(response.body.usuario).toBeDefined();
      expect(response.body.usuario.nomeUsuario).toBe('testuser');
    });

    it('should not login with invalid credentials', async () => {
      const loginData = {
        nomeUsuario: 'testuser',
        senha: 'wrongpassword'
      };

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body).toBe('Credenciais inválidas');
    });

    it('should not login with non-existent user', async () => {
      const loginData = {
        nomeUsuario: 'nonexistent',
        senha: 'password123'
      };

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body).toBe('Credenciais inválidas');
    });
  });
});