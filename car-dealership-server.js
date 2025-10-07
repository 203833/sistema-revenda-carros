const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(express.json());

let clientes = [
  {
    id: 1,
    nome: "João Silva",
    cpf: "12345678901",
    email: "joao@email.com",
    telefone: "11999999999",
    endereco: "Rua das Flores, 123",
    vendas: []
  },
  {
    id: 2,
    nome: "Maria Santos",
    cpf: "98765432109",
    email: "maria@email.com",
    telefone: "11888888888",
    endereco: "Av. Principal, 456",
    vendas: []
  }
];

let carros = [
  {
    id: 1,
    marca: "Toyota",
    modelo: "Corolla",
    ano: 2020,
    cor: "Prata",
    preco: 85000,
    quilometragem: 25000,
    tipoCombustivel: "Flex",
    transmissao: "Automático",
    status: "Disponível",
    vendas: []
  },
  {
    id: 2,
    marca: "Honda",
    modelo: "Civic",
    ano: 2019,
    cor: "Preto",
    preco: 75000,
    quilometragem: 30000,
    tipoCombustivel: "Flex",
    transmissao: "Manual",
    status: "Disponível",
    vendas: []
  },
  {
    id: 3,
    marca: "Volkswagen",
    modelo: "Golf",
    ano: 2021,
    cor: "Branco",
    preco: 95000,
    quilometragem: 15000,
    tipoCombustivel: "Flex",
    transmissao: "Automático",
    status: "Disponível",
    vendas: []
  }
];

let vendas = [
  {
    id: 1,
    dataVenda: "2024-01-15",
    precoVenda: 80000,
    metodoPagamento: "Financiamento",
    status: 3,
    cliente: {
      id: 1,
      nome: "João Silva"
    },
    carro: {
      id: 1,
      marca: "Toyota",
      modelo: "Corolla"
    }
  }
];

let usuarios = [
  {
    id: 1,
    nomeUsuario: "admin",
    senha: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
    papel: "admin"
  },
  {
    id: 2,
    nomeUsuario: "vendedor",
    senha: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
    papel: "vendedor"
  }
];

const autenticarToken = (req, res, next) => {
  const cabecalhoAuth = req.headers['authorization'];
  const token = cabecalhoAuth && cabecalhoAuth.split(' ')[1];

  if (!token) {
    return res.status(401).send("Token de acesso obrigatório");
  }

  jwt.verify(token, process.env.JWT_SECRET || 'chave-secreta-padrao', (err, usuario) => {
    if (err) {
      return res.status(403).send("Token inválido ou expirado");
    }
    req.usuario = usuario;
    next();
  });
};

app.get('/healthcheck', (req, res) => {
  res.status(200).send("Sistema de Revenda de Carros funcionando");
});

app.post('/api/v1/auth/login', async (req, res) => {
  const { nomeUsuario, senha } = req.body;

  if (!nomeUsuario || !senha) {
    return res.status(400).send("Nome de usuário e senha são obrigatórios");
  }

  try {
    const usuario = usuarios.find(u => u.nomeUsuario === nomeUsuario);
    if (!usuario) {
      return res.status(401).send("Credenciais inválidas");
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).send("Credenciais inválidas");
    }

    const token = jwt.sign(
      { id: usuario.id, nomeUsuario: usuario.nomeUsuario, papel: usuario.papel },
      process.env.JWT_SECRET || 'chave-secreta-padrao',
      { expiresIn: '24h' }
    );

    res.status(200).json({
      mensagem: "Login realizado com sucesso",
      token,
      usuario: {
        id: usuario.id,
        nomeUsuario: usuario.nomeUsuario,
        papel: usuario.papel
      }
    });
  } catch (erro) {
    res.status(500).send("Erro durante o login");
  }
});

app.post('/api/v1/auth/register', async (req, res) => {
  const { nomeUsuario, senha, papel = 'vendedor' } = req.body;

  if (!nomeUsuario || !senha) {
    return res.status(400).send("Nome de usuário e senha são obrigatórios");
  }

  try {
    const usuarioExistente = usuarios.find(u => u.nomeUsuario === nomeUsuario);
    if (usuarioExistente) {
      return res.status(400).send("Nome de usuário já existe");
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);
    const novoUsuario = {
      id: usuarios.length + 1,
      nomeUsuario,
      senha: senhaCriptografada,
      papel
    };

    usuarios.push(novoUsuario);
    res.status(201).json({ mensagem: "Usuário criado com sucesso" });
  } catch (erro) {
    res.status(500).send("Erro ao criar usuário");
  }
});

app.get('/api/v1/customers', (req, res) => {
  res.status(200).json(clientes);
});

app.get('/api/v1/customers/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const cliente = clientes.find(c => c.id === id);
  
  if (!cliente) {
    return res.status(404).send("Cliente não encontrado");
  }
  
  res.status(200).json(cliente);
});

app.post('/api/v1/customers', autenticarToken, (req, res) => {
  const { nome, cpf, email, telefone, endereco } = req.body;

  if (!nome || !cpf || !email || !telefone || !endereco) {
    return res.status(400).send("Todos os campos são obrigatórios");
  }

  const clienteExistente = clientes.find(c => c.cpf === cpf);
  if (clienteExistente) {
    return res.status(400).send("Já existe um cliente com este CPF");
  }

  const novoCliente = {
    id: clientes.length + 1,
    nome,
    cpf,
    email,
    telefone,
    endereco,
    vendas: []
  };

  clientes.push(novoCliente);
  res.status(201).json({ mensagem: "Cliente criado com sucesso", cliente: novoCliente });
});

app.put('/api/v1/customers/:id', autenticarToken, (req, res) => {
  const id = parseInt(req.params.id);
  const { nome, email, telefone, endereco } = req.body;

  if (!nome || !email || !telefone || !endereco) {
    return res.status(400).send("Todos os campos são obrigatórios");
  }

  const cliente = clientes.find(c => c.id === id);
  if (!cliente) {
    return res.status(404).send("Cliente não encontrado");
  }

  cliente.nome = nome;
  cliente.email = email;
  cliente.telefone = telefone;
  cliente.endereco = endereco;

  res.status(200).json({ mensagem: "Cliente atualizado com sucesso", cliente });
});

app.delete('/api/v1/customers/:id', autenticarToken, (req, res) => {
  const id = parseInt(req.params.id);
  const indiceCliente = clientes.findIndex(c => c.id === id);

  if (indiceCliente === -1) {
    return res.status(404).send("Cliente não encontrado");
  }

  clientes.splice(indiceCliente, 1);
  res.status(200).send("Cliente excluído com sucesso");
});

app.get('/api/v1/cars', (req, res) => {
  res.status(200).json(carros);
});

app.get('/api/v1/cars/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const carro = carros.find(c => c.id === id);
  
  if (!carro) {
    return res.status(404).send("Carro não encontrado");
  }
  
  res.status(200).json(carro);
});

app.get('/api/v1/cars/available', (req, res) => {
  const carrosDisponiveis = carros.filter(c => c.status === 'Disponível');
  res.status(200).json(carrosDisponiveis);
});

app.get('/api/v1/cars/brand/:marca', (req, res) => {
  const marca = req.params.marca;
  const carrosMarca = carros.filter(c => c.marca.toLowerCase() === marca.toLowerCase());
  res.status(200).json(carrosMarca);
});

app.post('/api/v1/cars', autenticarToken, (req, res) => {
  const { marca, modelo, ano, cor, preco, quilometragem, tipoCombustivel, transmissao } = req.body;

  if (!marca || !modelo || !ano || !cor || !preco || !quilometragem || !tipoCombustivel || !transmissao) {
    return res.status(400).send("Todos os campos são obrigatórios");
  }

  const novoCarro = {
    id: carros.length + 1,
    marca,
    modelo,
    ano,
    cor,
    preco,
    quilometragem,
    tipoCombustivel,
    transmissao,
    status: 'Disponível',
    vendas: []
  };

  carros.push(novoCarro);
  res.status(201).json({ mensagem: "Carro criado com sucesso", carro: novoCarro });
});

app.put('/api/v1/cars/:id', autenticarToken, (req, res) => {
  const id = parseInt(req.params.id);
  const { marca, modelo, ano, cor, preco, quilometragem, tipoCombustivel, transmissao, status } = req.body;

  if (!marca || !modelo || !ano || !cor || !preco || !quilometragem || !tipoCombustivel || !transmissao) {
    return res.status(400).send("Todos os campos são obrigatórios");
  }

  const carro = carros.find(c => c.id === id);
  if (!carro) {
    return res.status(404).send("Carro não encontrado");
  }

  carro.marca = marca;
  carro.modelo = modelo;
  carro.ano = ano;
  carro.cor = cor;
  carro.preco = preco;
  carro.quilometragem = quilometragem;
  carro.tipoCombustivel = tipoCombustivel;
  carro.transmissao = transmissao;
  if (status) carro.status = status;

  res.status(200).json({ mensagem: "Carro atualizado com sucesso", carro });
});

app.delete('/api/v1/cars/:id', autenticarToken, (req, res) => {
  const id = parseInt(req.params.id);
  const indiceCarro = carros.findIndex(c => c.id === id);

  if (indiceCarro === -1) {
    return res.status(404).send("Carro não encontrado");
  }

  carros.splice(indiceCarro, 1);
  res.status(200).send("Carro excluído com sucesso");
});

app.get('/api/v1/sales', (req, res) => {
  res.status(200).json(vendas);
});

app.get('/api/v1/sales/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const venda = vendas.find(s => s.id === id);
  
  if (!venda) {
    return res.status(404).send("Venda não encontrada");
  }
  
  res.status(200).json(venda);
});

app.get('/api/v1/sales/customer/:clienteId', (req, res) => {
  const clienteId = parseInt(req.params.clienteId);
  const vendasCliente = vendas.filter(s => s.cliente.id === clienteId);
  res.status(200).json(vendasCliente);
});

app.get('/api/v1/sales/status/:status', (req, res) => {
  const status = parseInt(req.params.status);
  const vendasStatus = vendas.filter(s => s.status === status);
  res.status(200).json(vendasStatus);
});

app.post('/api/v1/sales/:clienteId/:carroId', autenticarToken, (req, res) => {
  const clienteId = parseInt(req.params.clienteId);
  const carroId = parseInt(req.params.carroId);
  const { precoVenda, metodoPagamento, status } = req.body;

  if (!precoVenda || !metodoPagamento || status === undefined) {
    return res.status(400).send("Todos os campos são obrigatórios");
  }

  const cliente = clientes.find(c => c.id === clienteId);
  const carro = carros.find(c => c.id === carroId);

  if (!cliente || !carro) {
    return res.status(400).send("Cliente ou carro não encontrado");
  }

  if (carro.status !== 'Disponível') {
    return res.status(400).send("Carro não está disponível para venda");
  }

  const novaVenda = {
    id: vendas.length + 1,
    dataVenda: new Date().toISOString().split('T')[0],
    precoVenda: Number(precoVenda),
    metodoPagamento,
    status: Number(status),
    cliente: {
      id: cliente.id,
      nome: cliente.nome
    },
    carro: {
      id: carro.id,
      marca: carro.marca,
      modelo: carro.modelo
    }
  };

  vendas.push(novaVenda);

  if (Number(status) === 3) {
    carro.status = 'Vendido';
  }

  res.status(201).json({ mensagem: "Venda criada com sucesso", venda: novaVenda });
});

app.put('/api/v1/sales/:id', autenticarToken, (req, res) => {
  const id = parseInt(req.params.id);
  const { precoVenda, metodoPagamento, status } = req.body;

  if (!precoVenda || !metodoPagamento || status === undefined) {
    return res.status(400).send("Todos os campos são obrigatórios");
  }

  const venda = vendas.find(s => s.id === id);
  if (!venda) {
    return res.status(404).send("Venda não encontrada");
  }

  const statusAnterior = venda.status;
  venda.precoVenda = Number(precoVenda);
  venda.metodoPagamento = metodoPagamento;
  venda.status = Number(status);

  const carro = carros.find(c => c.id === venda.carro.id);
  if (carro) {
    if (Number(status) === 3 && statusAnterior !== 3) {
      carro.status = 'Vendido';
    } else if (Number(status) !== 3 && statusAnterior === 3) {
      carro.status = 'Disponível';
    }
  }

  res.status(200).json({ mensagem: "Venda atualizada com sucesso", venda });
});

app.delete('/api/v1/sales/:id', autenticarToken, (req, res) => {
  const id = parseInt(req.params.id);
  const indiceVenda = vendas.findIndex(s => s.id === id);

  if (indiceVenda === -1) {
    return res.status(404).send("Venda não encontrada");
  }

  const venda = vendas[indiceVenda];
  
  if (venda.status === 3) {
    const carro = carros.find(c => c.id === venda.carro.id);
    if (carro) {
      carro.status = 'Disponível';
    }
  }

  vendas.splice(indiceVenda, 1);
  res.status(200).send("Venda excluída com sucesso");
});

const PORTA = process.env.PORT || 3001;

app.listen(PORTA, () => {
  console.log(`Sistema de Revenda de Carros rodando em http://localhost:${PORTA}`);
  console.log(`Health check: http://localhost:${PORTA}/healthcheck`);
  console.log(`Clientes: http://localhost:${PORTA}/api/v1/customers`);
  console.log(`Carros: http://localhost:${PORTA}/api/v1/cars`);
  console.log(`Vendas: http://localhost:${PORTA}/api/v1/sales`);
  console.log(`Login: http://localhost:${PORTA}/api/v1/auth/login`);
  console.log(`Credenciais de teste:`);
  console.log(`Admin: nomeUsuario="admin", senha="password"`);
  console.log(`Vendedor: nomeUsuario="vendedor", senha="password"`);
});