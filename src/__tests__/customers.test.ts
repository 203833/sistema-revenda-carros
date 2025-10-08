import request from 'supertest';
import app from '../app';
import { AppDataSource } from '../config/datasource';
import { Cliente } from '../entities/Cliente';
import { Usuario } from '../entities/Usuario';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

describe('API de Clientes', () => {
  let tokenAuth: string;

  beforeAll(async () => {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
  });

  beforeEach(async () => {
    await AppDataSource.getRepository(Cliente).clear();
    await AppDataSource.getRepository(Usuario).clear();

    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = await AppDataSource.getRepository(Usuario).save({
      nomeUsuario: 'testuser',
      senha: hashedPassword,
      papel: 'vendedor'
    });

    tokenAuth = jwt.sign(
      { id: user.id, nomeUsuario: user.nomeUsuario, papel: user.papel },
      process.env.JWT_SECRET || 'chave-secreta-padrao',
      { expiresIn: '24h' }
    );
  });

  describe('GET /api/v1/clientes', () => {
    it('deve listar todos os clientes (endpoint público)', async () => {
      await AppDataSource.getRepository(Cliente).save([
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
        .get('/api/v1/clientes')
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0].nome).toBe('João Silva');
      expect(response.body[1].nome).toBe('Maria Santos');
    });

    it('deve retornar array vazio quando não há clientes', async () => {
      const response = await request(app)
        .get('/api/v1/clientes')
        .expect(200);

      expect(response.body).toHaveLength(0);
    });
  });

  describe('GET /api/v1/clientes/:id', () => {
    it('deve buscar cliente por ID (endpoint público)', async () => {
      const customer = await AppDataSource.getRepository(Cliente).save({
        nome: 'João Silva',
        cpf: '12345678901',
        email: 'joao@email.com',
        telefone: '11999999999',
        endereco: 'Rua das Flores, 123'
      });

      const response = await request(app)
        .get(`/api/v1/clientes/${customer.id}`)
        .expect(200);

      expect(response.body.nome).toBe('João Silva');
      expect(response.body.cpf).toBe('12345678901');
    });

    it('deve retornar 404 para cliente inexistente', async () => {
      const response = await request(app)
        .get('/api/v1/clientes/999')
        .expect(404);

      expect(response.text).toBe('Cliente não encontrado');
    });
  });

  describe('POST /api/v1/clientes', () => {
    it('should create a new customer (protected endpoint)', async () => {
      const customerData = {
        nome: 'João Silva',
        cpf: '12345678901',
        email: 'joao@email.com',
        telefone: '11999999999',
        endereco: 'Rua das Flores, 123'
      };

      const response = await request(app)
        .post('/api/v1/clientes')
        .set('Authorization', `Bearer ${tokenAuth}`)
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
        .post('/api/v1/clientes')
        .send(customerData)
        .expect(401);

      expect(response.text).toBe('Token de acesso obrigatório');
    });

    it('should not create customer with missing fields', async () => {
      const customerData = {
        nome: 'João Silva',
        cpf: '12345678901'
      };

      const response = await request(app)
        .post('/api/v1/clientes')
        .set('Authorization', `Bearer ${tokenAuth}`)
        .send(customerData)
        .expect(400);

      expect(response.text).toBe('Todos os campos são obrigatórios');
    });

    it('should not create customer with duplicate CPF', async () => {
      await AppDataSource.getRepository(Cliente).save({
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
        .post('/api/v1/clientes')
        .set('Authorization', `Bearer ${tokenAuth}`)
        .send(customerData)
        .expect(400);

      expect(response.text).toBe('Já existe um cliente com este CPF');
    });
  });

  describe('PUT /api/v1/clientes/:id', () => {
    it('should update customer (protected endpoint)', async () => {
      const customer = await AppDataSource.getRepository(Cliente).save({
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
        .put(`/api/v1/clientes/${customer.id}`)
        .set('Authorization', `Bearer ${tokenAuth}`)
        .send(updateData)
        .expect(200);

      expect(response.body.mensagem).toBe('Cliente atualizado com sucesso');
      expect(response.body.cliente.nome).toBe('João Silva Santos');
    });

    it('should not update customer without authentication', async () => {
      const customer = await AppDataSource.getRepository(Cliente).save({
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
        .put(`/api/v1/clientes/${customer.id}`)
        .send(updateData)
        .expect(401);

      expect(response.text).toBe('Token de acesso obrigatório');
    });
  });

  describe('DELETE /api/v1/clientes/:id', () => {
    it('should delete customer (protected endpoint)', async () => {
      const customer = await AppDataSource.getRepository(Cliente).save({
        nome: 'João Silva',
        cpf: '12345678901',
        email: 'joao@email.com',
        telefone: '11999999999',
        endereco: 'Rua das Flores, 123'
      });

      const response = await request(app)
        .delete(`/api/v1/clientes/${customer.id}`)
        .set('Authorization', `Bearer ${tokenAuth}`)
        .expect(200);

      expect(response.text).toBe('Cliente excluído com sucesso');
    });

    it('should not delete customer without authentication', async () => {
      const customer = await AppDataSource.getRepository(Cliente).save({
        nome: 'João Silva',
        cpf: '12345678901',
        email: 'joao@email.com',
        telefone: '11999999999',
        endereco: 'Rua das Flores, 123'
      });

      const response = await request(app)
        .delete(`/api/v1/clientes/${customer.id}`)
        .expect(401);

      expect(response.text).toBe('Token de acesso obrigatório');
    });
  });
});