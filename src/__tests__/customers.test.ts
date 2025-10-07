import request from 'supertest';
import app from '../app';
import { AppDataSource } from '../config/datasource';
import { Customer } from '../entities/Customer';
import { User } from '../entities/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

describe('Customers API', () => {
  let authToken: string;

  beforeAll(async () => {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
  });

  beforeEach(async () => {
    await AppDataSource.getRepository(Customer).clear();
    await AppDataSource.getRepository(User).clear();

    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = await AppDataSource.getRepository(User).save({
      nomeUsuario: 'testuser',
      senha: hashedPassword,
      papel: 'vendedor'
    });

    authToken = jwt.sign(
      { id: user.id, nomeUsuario: user.nomeUsuario, papel: user.papel },
      process.env.JWT_SECRET || 'chave-secreta-padrao',
      { expiresIn: '24h' }
    );
  });

  describe('GET /api/v1/customers', () => {
    it('should get all customers (public endpoint)', async () => {
      await AppDataSource.getRepository(Customer).save([
        {
          nome: 'João Silva',
          cpf: '12345678901',
          email: 'joao@email.com',
          telefone: '11999999999',
          endereco: 'Rua das Flores, 123'
        },
        {
          nome: 'Maria Santos',
          cpf: '98765432100',
          email: 'maria@email.com',
          telefone: '11888888888',
          endereco: 'Avenida Brasil, 456'
        }
      ]);

      const response = await request(app)
        .get('/api/v1/customers')
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0].nome).toBe('João Silva');
      expect(response.body[1].nome).toBe('Maria Santos');
    });

    it('should return empty array when no customers exist', async () => {
      const response = await request(app)
        .get('/api/v1/customers')
        .expect(200);

      expect(response.body).toHaveLength(0);
    });
  });

  describe('GET /api/v1/customers/:id', () => {
    it('should get customer by id (public endpoint)', async () => {
      const customer = await AppDataSource.getRepository(Customer).save({
        nome: 'João Silva',
        cpf: '12345678901',
        email: 'joao@email.com',
        telefone: '11999999999',
        endereco: 'Rua das Flores, 123'
      });

      const response = await request(app)
        .get(`/api/v1/customers/${customer.id}`)
        .expect(200);

      expect(response.body.nome).toBe('João Silva');
      expect(response.body.cpf).toBe('12345678901');
    });

    it('should return 404 for non-existent customer', async () => {
      const response = await request(app)
        .get('/api/v1/customers/999')
        .expect(404);

      expect(response.body).toBe('Cliente não encontrado');
    });
  });

  describe('POST /api/v1/customers', () => {
    it('should create a new customer (protected endpoint)', async () => {
      const customerData = {
        nome: 'João Silva',
        cpf: '12345678901',
        email: 'joao@email.com',
        telefone: '11999999999',
        endereco: 'Rua das Flores, 123'
      };

      const response = await request(app)
        .post('/api/v1/customers')
        .set('Authorization', `Bearer ${authToken}`)
        .send(customerData)
        .expect(201);

      expect(response.body.mensagem).toBe('Cliente criado com sucesso');
      expect(response.body.cliente.nome).toBe('João Silva');
    });

    it('should not create customer without authentication', async () => {
      const customerData = {
        nome: 'João Silva',
        cpf: '12345678901',
        email: 'joao@email.com',
        telefone: '11999999999',
        endereco: 'Rua das Flores, 123'
      };

      const response = await request(app)
        .post('/api/v1/customers')
        .send(customerData)
        .expect(401);

      expect(response.body).toBe('Token de acesso obrigatório');
    });

    it('should not create customer with missing fields', async () => {
      const customerData = {
        nome: 'João Silva',
        cpf: '12345678901'
      };

      const response = await request(app)
        .post('/api/v1/customers')
        .set('Authorization', `Bearer ${authToken}`)
        .send(customerData)
        .expect(400);

      expect(response.body).toBe('Todos os campos são obrigatórios');
    });

    it('should not create customer with duplicate CPF', async () => {
      await AppDataSource.getRepository(Customer).save({
        nome: 'João Silva',
        cpf: '12345678901',
        email: 'joao@email.com',
        telefone: '11999999999',
        endereco: 'Rua das Flores, 123'
      });

      const customerData = {
        nome: 'Maria Santos',
        cpf: '12345678901',
        email: 'maria@email.com',
        telefone: '11888888888',
        endereco: 'Avenida Brasil, 456'
      };

      const response = await request(app)
        .post('/api/v1/customers')
        .set('Authorization', `Bearer ${authToken}`)
        .send(customerData)
        .expect(400);

      expect(response.body).toBe('Já existe um cliente com este CPF');
    });
  });

  describe('PUT /api/v1/customers/:id', () => {
    it('should update customer (protected endpoint)', async () => {
      const customer = await AppDataSource.getRepository(Customer).save({
        nome: 'João Silva',
        cpf: '12345678901',
        email: 'joao@email.com',
        telefone: '11999999999',
        endereco: 'Rua das Flores, 123'
      });

      const updateData = {
        nome: 'João Silva Santos',
        email: 'joao.santos@email.com',
        telefone: '11999999999',
        endereco: 'Rua das Flores, 123'
      };

      const response = await request(app)
        .put(`/api/v1/customers/${customer.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.mensagem).toBe('Cliente atualizado com sucesso');
      expect(response.body.cliente.nome).toBe('João Silva Santos');
    });

    it('should not update customer without authentication', async () => {
      const customer = await AppDataSource.getRepository(Customer).save({
        nome: 'João Silva',
        cpf: '12345678901',
        email: 'joao@email.com',
        telefone: '11999999999',
        endereco: 'Rua das Flores, 123'
      });

      const updateData = {
        nome: 'João Silva Santos',
        email: 'joao.santos@email.com',
        telefone: '11999999999',
        endereco: 'Rua das Flores, 123'
      };

      const response = await request(app)
        .put(`/api/v1/customers/${customer.id}`)
        .send(updateData)
        .expect(401);

      expect(response.body).toBe('Token de acesso obrigatório');
    });
  });

  describe('DELETE /api/v1/customers/:id', () => {
    it('should delete customer (protected endpoint)', async () => {
      const customer = await AppDataSource.getRepository(Customer).save({
        nome: 'João Silva',
        cpf: '12345678901',
        email: 'joao@email.com',
        telefone: '11999999999',
        endereco: 'Rua das Flores, 123'
      });

      const response = await request(app)
        .delete(`/api/v1/customers/${customer.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toBe('Cliente excluído com sucesso');
    });

    it('should not delete customer without authentication', async () => {
      const customer = await AppDataSource.getRepository(Customer).save({
        nome: 'João Silva',
        cpf: '12345678901',
        email: 'joao@email.com',
        telefone: '11999999999',
        endereco: 'Rua das Flores, 123'
      });

      const response = await request(app)
        .delete(`/api/v1/customers/${customer.id}`)
        .expect(401);

      expect(response.body).toBe('Token de acesso obrigatório');
    });
  });
});