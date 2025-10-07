const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Conectar ao MongoDB
const connectDB = async () => {
  try {
    // Tentar sem autenticação primeiro
    const mongoURI = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
    console.log('🔗 Conectando ao MongoDB:', mongoURI);
    
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB conectado com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao conectar com MongoDB:', error.message);
    process.exit(1);
  }
};

// Health check
app.get('/healthcheck', (req, res) => {
  res.status(200).send("API funcionando com MongoDB!");
});

// Teste de conexão
app.get('/test', async (req, res) => {
  try {
    const collections = await mongoose.connection.db.listCollections().toArray();
    res.json({
      message: "MongoDB funcionando!",
      database: mongoose.connection.db.databaseName,
      collections: collections.map(c => c.name)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;

async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚗 Sistema de Revenda de Carros (MongoDB) rodando em http://localhost:${PORT}`);
    console.log(`✅ Health check: http://localhost:3001/healthcheck`);
    console.log(`🧪 Teste MongoDB: http://localhost:3001/test`);
  });
}

start();