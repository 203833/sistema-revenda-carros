const { Customer } = require('../entities/Customer');
const { Car } = require('../entities/Car');
const { Sale } = require('../entities/Sale');
const { User } = require('../entities/User');

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
