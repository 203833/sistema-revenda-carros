import { Customer } from '../models/Customer';
import { Car } from '../models/Car';
import { Sale } from '../models/Sale';
import { User } from '../models/User';
jest.mock('../config/datasource', () => ({
  AppDataSource: {
    isInitialized: true,
    getRepository: jest.fn(() => ({
      find: jest.fn(() => Promise.resolve([])),
      findOne: jest.fn(() => Promise.resolve(null)),
      findOneBy: jest.fn(() => Promise.resolve(null)),
      create: jest.fn((data) => ({ id: 1, ...data })),
      save: jest.fn((data) => Promise.resolve(data)),
      delete: jest.fn(() => Promise.resolve()),
      clear: jest.fn(() => Promise.resolve())
    })),
    initialize: jest.fn(() => Promise.resolve()),
    destroy: jest.fn(() => Promise.resolve())
  }
}));
