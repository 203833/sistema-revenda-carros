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
      username: 'testuser',
      password: hashedPassword,
      role: 'seller'
    });

    authToken = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: '24h' }
    );
  });

  describe('GET /api/v1/customers', () => {
    it('should get all customers (public endpoint)', async () => {

      await AppDataSource.getRepository(Customer).save([
        {
          name: 'John Doe',
          cpf: '12345678901',
          email: 'john@example.com',
          phone: '1234567890',
          address: '123 Main St'
        },
        {
          name: 'Jane Smith',
          cpf: '98765432109',
          email: 'jane@example.com',
          phone: '0987654321',
          address: '456 Oak Ave'
        }
      ]);

      const response = await request(app)
        .get('/api/v1/customers')
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0].name).toBe('John Doe');
      expect(response.body[1].name).toBe('Jane Smith');
    });

    it('should return empty array when no customers exist', async () => {
      const response = await request(app)
        .get('/api/v1/customers')
        .expect(200);

      expect(response.body).toEqual([]);
    });
  });

  describe('POST /api/v1/customers', () => {
    it('should create a new customer (protected endpoint)', async () => {
      const customerData = {
        name: 'John Doe',
        cpf: '12345678901',
        email: 'john@example.com',
        phone: '1234567890',
        address: '123 Main St'
      };

      const response = await request(app)
        .post('/api/v1/customers')
        .set('Authorization', `Bearer ${authToken}`)
        .send(customerData)
        .expect(201);

      expect(response.body.message).toBe('Customer created!');
      expect(response.body.customer.name).toBe('John Doe');
      expect(response.body.customer.cpf).toBe('12345678901');
    });

    it('should not create customer without authentication', async () => {
      const customerData = {
        name: 'John Doe',
        cpf: '12345678901',
        email: 'john@example.com',
        phone: '1234567890',
        address: '123 Main St'
      };

      const response = await request(app)
        .post('/api/v1/customers')
        .send(customerData)
        .expect(401);

      expect(response.text).toBe('Access token required');
    });

    it('should not create customer with duplicate CPF', async () => {

      await AppDataSource.getRepository(Customer).save({
        name: 'John Doe',
        cpf: '12345678901',
        email: 'john@example.com',
        phone: '1234567890',
        address: '123 Main St'
      });

      const customerData = {
        name: 'Jane Smith',
        cpf: '12345678901', // Same CPF
        email: 'jane@example.com',
        phone: '0987654321',
        address: '456 Oak Ave'
      };

      const response = await request(app)
        .post('/api/v1/customers')
        .set('Authorization', `Bearer ${authToken}`)
        .send(customerData)
        .expect(400);

      expect(response.text).toBe('Customer with this CPF already exists');
    });

    it('should require all fields', async () => {
      const customerData = {
        name: 'John Doe',

      };

      const response = await request(app)
        .post('/api/v1/customers')
        .set('Authorization', `Bearer ${authToken}`)
        .send(customerData)
        .expect(400);

      expect(response.text).toBe('All fields are required');
    });
  });

  describe('GET /api/v1/customers/:id', () => {
    it('should get customer by id (public endpoint)', async () => {
      const customer = await AppDataSource.getRepository(Customer).save({
        name: 'John Doe',
        cpf: '12345678901',
        email: 'john@example.com',
        phone: '1234567890',
        address: '123 Main St'
      });

      const response = await request(app)
        .get(`/api/v1/customers/${customer.id}`)
        .expect(200);

      expect(response.body.name).toBe('John Doe');
      expect(response.body.cpf).toBe('12345678901');
    });

    it('should return 404 for non-existent customer', async () => {
      const response = await request(app)
        .get('/api/v1/customers/999')
        .expect(404);

      expect(response.text).toBe('Customer not found');
    });
  });

  describe('PUT /api/v1/customers/:id', () => {
    it('should update customer (protected endpoint)', async () => {
      const customer = await AppDataSource.getRepository(Customer).save({
        name: 'John Doe',
        cpf: '12345678901',
        email: 'john@example.com',
        phone: '1234567890',
        address: '123 Main St'
      });

      const updateData = {
        name: 'John Updated',
        email: 'john.updated@example.com',
        phone: '1111111111',
        address: '789 New St'
      };

      const response = await request(app)
        .put(`/api/v1/customers/${customer.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.message).toBe('Customer updated!');
      expect(response.body.customer.name).toBe('John Updated');
    });

    it('should not update customer without authentication', async () => {
      const customer = await AppDataSource.getRepository(Customer).save({
        name: 'John Doe',
        cpf: '12345678901',
        email: 'john@example.com',
        phone: '1234567890',
        address: '123 Main St'
      });

      const response = await request(app)
        .put(`/api/v1/customers/${customer.id}`)
        .send({ name: 'Updated' })
        .expect(401);

      expect(response.text).toBe('Access token required');
    });
  });

  describe('DELETE /api/v1/customers/:id', () => {
    it('should delete customer (protected endpoint)', async () => {
      const customer = await AppDataSource.getRepository(Customer).save({
        name: 'John Doe',
        cpf: '12345678901',
        email: 'john@example.com',
        phone: '1234567890',
        address: '123 Main St'
      });

      const response = await request(app)
        .delete(`/api/v1/customers/${customer.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.text).toBe('Customer deleted successfully');


      const deletedCustomer = await AppDataSource.getRepository(Customer).findOneBy({ id: customer.id });
      expect(deletedCustomer).toBeNull();
    });

    it('should not delete customer without authentication', async () => {
      const customer = await AppDataSource.getRepository(Customer).save({
        name: 'John Doe',
        cpf: '12345678901',
        email: 'john@example.com',
        phone: '1234567890',
        address: '123 Main St'
      });

      const response = await request(app)
        .delete(`/api/v1/customers/${customer.id}`)
        .expect(401);

      expect(response.text).toBe('Access token required');
    });
  });
});
