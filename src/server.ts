import 'reflect-metadata';
import app from './app';
import connectDB from './config/database';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;

async function start() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚗 Sistema de Revenda de Carros rodando em http://localhost:${PORT}`);
      console.log(`✅ Health check: http://localhost:${PORT}/healthcheck`);
      console.log(`👥 Clientes: http://localhost:${PORT}/api/v1/customers`);
      console.log(`🚙 Carros: http://localhost:${PORT}/api/v1/cars`);
      console.log(`💰 Vendas: http://localhost:${PORT}/api/v1/sales`);
      console.log(`🔐 Auth: http://localhost:${PORT}/api/v1/auth/login`);
    });
  } catch (err) {
    console.error('Falha ao iniciar a aplicação:', err);
    process.exit(1);
  }
}

start();