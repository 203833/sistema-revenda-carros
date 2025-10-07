const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/healthcheck', (req, res) => res.status(200).send("API funcionando"));

app.get('/api/v1/customers', (req, res) => {
  res.status(200).json([
    {
      id: 1,
      name: "João Silva",
      cpf: "12345678901",
      email: "joao@email.com",
      phone: "11999999999",
      address: "Rua das Flores, 123"
    },
    {
      id: 2,
      name: "Maria Santos",
      cpf: "98765432109",
      email: "maria@email.com",
      phone: "11888888888",
      address: "Av. Principal, 456"
    }
  ]);
});

app.get('/api/v1/cars', (req, res) => {
  res.status(200).json([
    {
      id: 1,
      brand: "Toyota",
      model: "Corolla",
      year: 2020,
      color: "Prata",
      price: 85000.00,
      mileage: 25000,
      fuelType: "Flex",
      transmission: "Automático",
      status: "Disponível"
    },
    {
      id: 2,
      brand: "Honda",
      model: "Civic",
      year: 2019,
      color: "Preto",
      price: 75000.00,
      mileage: 30000,
      fuelType: "Flex",
      transmission: "Manual",
      status: "Disponível"
    }
  ]);
});

app.get('/api/v1/sales', (req, res) => {
  res.status(200).json([
    {
      id: 1,
      saleDate: "2024-01-15",
      salePrice: 80000.00,
      paymentMethod: "Financiamento",
      status: 3,
      customer: {
        id: 1,
        name: "João Silva"
      },
      car: {
        id: 1,
        brand: "Toyota",
        model: "Corolla"
      }
    }
  ]);
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚗 Sistema de Revenda de Carros rodando em http://localhost:${PORT}`);
  console.log(`✅ Health check: http://localhost:${PORT}/healthcheck`);
  console.log(`👥 Clientes: http://localhost:${PORT}/api/v1/customers`);
  console.log(`🚙 Carros: http://localhost:${PORT}/api/v1/cars`);
  console.log(`💰 Vendas: http://localhost:${PORT}/api/v1/sales`);
});
