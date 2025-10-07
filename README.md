# 🚗 Sistema de Revenda de Carros

API REST desenvolvida em Node.js com TypeScript para gerenciamento de revenda de carros, incluindo clientes, veículos e vendas.

## 🛠️ Tecnologias Utilizadas

- **Node.js** + **Express.js**
- **TypeScript**
- **PostgreSQL** + **TypeORM**
- **JWT** para autenticação
- **bcrypt** para hash de senhas
- **Jest** + **Supertest** para testes

## 📋 Funcionalidades

### 🔐 Autenticação
- Login com JWT
- Registro de usuários (vendedores/administradores)
- Proteção de endpoints sensíveis

### 👥 Clientes
- CRUD completo de clientes
- Validação de CPF único
- Busca por ID com histórico de compras

### 🚙 Carros
- CRUD completo de veículos
- Busca por marca
- Filtro de carros disponíveis
- Controle de status (Disponível/Vendido/Reservado)

### 💰 Vendas
- CRUD completo de vendas
- Relacionamento cliente-carro
- Controle de status da venda
- Atualização automática do status do carro

## 🚀 Como Executar

### Pré-requisitos
- Node.js (v18+)
- PostgreSQL
- npm ou yarn

### Instalação
```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas configurações de banco
```

### Executar
```bash
# Desenvolvimento
npm run dev

# Produção
npm run build
npm start

# Testes
npm test
npm run test:watch
npm run test:coverage
```

## 📚 Endpoints da API

### Autenticação
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/register` - Registro

### Clientes (Públicos: GET, Protegidos: POST/PUT/DELETE)
- `GET /api/v1/customers` - Listar clientes
- `GET /api/v1/customers/:id` - Buscar cliente por ID
- `POST /api/v1/customers` - Criar cliente
- `PUT /api/v1/customers/:id` - Atualizar cliente
- `DELETE /api/v1/customers/:id` - Deletar cliente

### Carros (Públicos: GET, Protegidos: POST/PUT/DELETE)
- `GET /api/v1/cars` - Listar carros
- `GET /api/v1/cars/:id` - Buscar carro por ID
- `GET /api/v1/cars/available` - Carros disponíveis
- `GET /api/v1/cars/brand/:brand` - Buscar por marca
- `POST /api/v1/cars` - Criar carro
- `PUT /api/v1/cars/:id` - Atualizar carro
- `DELETE /api/v1/cars/:id` - Deletar carro

### Vendas (Públicos: GET, Protegidos: POST/PUT/DELETE)
- `GET /api/v1/sales` - Listar vendas
- `GET /api/v1/sales/:id` - Buscar venda por ID
- `GET /api/v1/sales/customer/:customerId` - Vendas por cliente
- `GET /api/v1/sales/status/:status` - Vendas por status
- `POST /api/v1/sales/:customerId/:carId` - Criar venda
- `PUT /api/v1/sales/:id` - Atualizar venda
- `DELETE /api/v1/sales/:id` - Deletar venda

## 🔒 Autenticação

Para acessar endpoints protegidos, inclua o token JWT no header:
```
Authorization: Bearer <seu_token_jwt>
```

## 📊 Status das Vendas
- **0**: Orçamento/Interesse
- **1**: Negociação
- **2**: Contrato assinado
- **3**: Venda concluída

## 🧪 Testes

O projeto inclui testes automatizados com Jest e Supertest:
- Testes de autenticação
- Testes de CRUD para clientes
- Testes de proteção de endpoints
- Cobertura de código

## 📝 Estrutura do Projeto

```
src/
├── __tests__/          # Testes automatizados
├── config/            # Configurações (banco de dados)
├── controllers/       # Lógica de negócio
├── entities/          # Modelos do banco de dados
├── middleware/        # Middlewares (autenticação)
├── routes/           # Definição de rotas
├── app.ts           # Configuração do Express
└── server.ts        # Servidor principal
```

## 🎯 Requisitos Atendidos

✅ **Persistência**: 3 recursos com relacionamentos (Customer, Car, Sale)  
✅ **Autenticação**: JWT com login e proteção de endpoints  
✅ **Testes**: Jest + Supertest implementados  
✅ **Código**: Estrutura MVC bem organizada  
✅ **Endpoints**: GET públicos, POST/PUT/DELETE protegidos  

## 👨‍💻 Desenvolvido por

Sistema desenvolvido como trabalho acadêmico, transformando uma API base de delivery em um sistema completo de revenda de carros.
