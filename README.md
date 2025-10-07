# 🚗 Sistema de Revenda de Carros - API REST

## 📋 Visão Geral

Sistema completo de gerenciamento para uma revenda de carros desenvolvido como API REST com autenticação JWT, testes automatizados e persistência em banco de dados PostgreSQL. O projeto atende aos requisitos acadêmicos de implementação de features, testes, persistência e autenticação.

## 🎯 Objetivos do Projeto

Este projeto foi desenvolvido para demonstrar competências em:
- **Desenvolvimento de API REST** com Node.js e Express
- **Autenticação e Autorização** com JWT
- **Persistência de Dados** com PostgreSQL e TypeORM
- **Testes Automatizados** com Jest e Supertest
- **Arquitetura de Software** seguindo padrões MVC
- **Documentação e Boas Práticas** de desenvolvimento

## 🏗️ Arquitetura do Sistema

### Padrão Arquitetural
- **MVC (Model-View-Controller)**: Separação clara de responsabilidades
- **Repository Pattern**: Abstração da camada de dados com TypeORM
- **Middleware Pattern**: Interceptação de requisições para autenticação
- **RESTful API**: Endpoints seguindo convenções REST

### Estrutura do Projeto
```
src/
├── config/           # Configurações do banco de dados
├── controllers/      # Lógica de negócio e controle das requisições
├── entities/         # Modelos de dados (TypeORM)
├── middleware/       # Middlewares de autenticação
├── routes/          # Definição das rotas da API
├── __tests__/       # Testes automatizados
└── server.ts        # Ponto de entrada da aplicação
```

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** (v18+) - Runtime JavaScript
- **Express.js** - Framework web
- **TypeScript** - Linguagem tipada
- **PostgreSQL** - Banco de dados relacional
- **TypeORM** - ORM para TypeScript/JavaScript

### Autenticação e Segurança
- **JWT (JSON Web Tokens)** - Autenticação stateless
- **Bcrypt** - Hash de senhas
- **CORS** - Controle de acesso cross-origin

### Testes
- **Jest** - Framework de testes
- **Supertest** - Testes de integração HTTP
- **ts-jest** - Suporte TypeScript para Jest

### Desenvolvimento
- **Nodemon** - Hot reload em desenvolvimento
- **ts-node** - Execução TypeScript direta
- **dotenv** - Gerenciamento de variáveis de ambiente

## 📊 Modelo de Dados

### Entidades Principais

#### 👤 Customer (Cliente)
```typescript
- id: number (PK)
- nome: string
- cpf: string (único)
- email: string
- telefone: string
- endereco: string
- sales: Sale[] (relacionamento 1:N)
```

#### 🚗 Car (Carro)
```typescript
- id: number (PK)
- marca: string
- modelo: string
- ano: number
- cor: string
- preco: decimal(10,2)
- quilometragem: number
- tipoCombustivel: string
- transmissao: string
- status: string (Disponível/Vendido)
- sales: Sale[] (relacionamento 1:N)
```

#### 💰 Sale (Venda)
```typescript
- id: number (PK)
- dataVenda: Date
- precoVenda: decimal(10,2)
- metodoPagamento: string
- status: number (0-3)
- customer: Customer (relacionamento N:1)
- car: Car (relacionamento N:1)
```

#### 👨‍💼 User (Usuário)
```typescript
- id: number (PK)
- nomeUsuario: string (único)
- senha: string (hash)
- papel: string (admin/vendedor)
```

### Relacionamentos
- **Customer** ↔ **Sale**: 1:N (Um cliente pode ter várias vendas)
- **Car** ↔ **Sale**: 1:N (Um carro pode ter várias vendas)
- **Sale**: Tabela de junção com informações específicas da venda

## 🔐 Sistema de Autenticação

### Fluxo de Autenticação
1. **Login**: Usuário envia credenciais (`nomeUsuario`, `senha`)
2. **Validação**: Sistema verifica credenciais no banco
3. **Token**: Gera JWT com informações do usuário
4. **Autorização**: Token é enviado em requisições protegidas

### Níveis de Acesso
- **Endpoints Públicos**: GET (listagem) e POST `/auth/login`
- **Endpoints Protegidos**: POST, PUT, DELETE (requer token JWT)

### Estrutura do Token JWT
```json
{
  "id": 1,
  "nomeUsuario": "admin",
  "papel": "admin",
  "iat": 1234567890,
  "exp": 1234654290
}
```

## 📡 Endpoints da API

### 🔓 Autenticação (Públicos)
```
POST /api/v1/auth/login
POST /api/v1/auth/register
```

### 👥 Clientes
```
GET    /api/v1/customers              # Listar todos
GET    /api/v1/customers/:id          # Buscar por ID
POST   /api/v1/customers              # Criar (🔒 Protegido)
PUT    /api/v1/customers/:id          # Atualizar (🔒 Protegido)
DELETE /api/v1/customers/:id          # Excluir (🔒 Protegido)
```

### 🚗 Carros
```
GET    /api/v1/cars                   # Listar todos
GET    /api/v1/cars/:id               # Buscar por ID
GET    /api/v1/cars/available         # Listar disponíveis
GET    /api/v1/cars/brand/:brand      # Buscar por marca
POST   /api/v1/cars                   # Criar (🔒 Protegido)
PUT    /api/v1/cars/:id               # Atualizar (🔒 Protegido)
DELETE /api/v1/cars/:id               # Excluir (🔒 Protegido)
```

### 💰 Vendas
```
GET    /api/v1/sales                  # Listar todas
GET    /api/v1/sales/:id              # Buscar por ID
GET    /api/v1/sales/customer/:id     # Vendas por cliente
GET    /api/v1/sales/status/:status   # Vendas por status
POST   /api/v1/sales/customer/:customerId/car/:carId  # Criar (🔒 Protegido)
PUT    /api/v1/sales/:id              # Atualizar (🔒 Protegido)
DELETE /api/v1/sales/:id              # Excluir (🔒 Protegido)
```

### 🏥 Health Check
```
GET    /healthcheck                   # Status da aplicação
```

## 🧪 Testes Automatizados

### Cobertura de Testes
- **Testes de Integração**: Endpoints da API
- **Testes de Autenticação**: Login e autorização
- **Testes de CRUD**: Operações básicas de cada entidade
- **Testes de Validação**: Campos obrigatórios e regras de negócio

### Execução dos Testes
```bash
npm test              # Executar todos os testes
npm run test:watch    # Modo watch
npm run test:coverage # Com relatório de cobertura
```

### Estrutura dos Testes
```
src/__tests__/
├── auth.test.ts      # Testes de autenticação
├── customers.test.ts  # Testes de clientes
├── cars.test.ts      # Testes de carros
├── sales.test.ts     # Testes de vendas
├── setup.ts          # Configuração dos testes
└── mocks.ts          # Dados mock para testes
```

## 🚀 Instalação e Execução

### Pré-requisitos
- Node.js (v18 ou superior)
- PostgreSQL (v12 ou superior)
- npm ou yarn

### 1. Clone o Repositório
```bash
git clone https://github.com/203833/sistema-revenda-carros.git
cd sistema-revenda-carros
```

### 2. Instalar Dependências
```bash
npm install
```

### 3. Configurar Banco de Dados
```bash
# Criar banco PostgreSQL
createdb car_dealership

# Configurar variáveis de ambiente
cp env.example .env
# Editar .env com suas credenciais do PostgreSQL
```

### 4. Executar Migrações
```bash
npm run typeorm migration:run
```

### 5. Executar a Aplicação

#### Desenvolvimento
```bash
npm run dev
```

#### Produção
```bash
npm run build
npm start
```

### 6. Verificar Funcionamento
```bash
# Health check
curl http://localhost:3001/healthcheck

# Listar carros
curl http://localhost:3001/api/v1/cars
```

## 📝 Exemplos de Uso

### 1. Login
```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "nomeUsuario": "admin",
    "senha": "123456"
  }'
```

### 2. Criar Cliente (com autenticação)
```bash
curl -X POST http://localhost:3001/api/v1/customers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "nome": "João Silva",
    "cpf": "12345678901",
    "email": "joao@email.com",
    "telefone": "11999999999",
    "endereco": "Rua das Flores, 123"
  }'
```

### 3. Listar Carros Disponíveis
```bash
curl http://localhost:3001/api/v1/cars/available
```

### 4. Criar Venda
```bash
curl -X POST http://localhost:3001/api/v1/sales/customer/1/car/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "precoVenda": 85000,
    "metodoPagamento": "Financiamento",
    "status": 3
  }'
```

## 🔧 Configuração de Ambiente

### Variáveis de Ambiente (.env)
```env
# PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=sua_senha
DB_NAME=car_dealership

# JWT
JWT_SECRET=seu_jwt_secret_super_seguro

# Servidor
PORT=3001
```

### Scripts Disponíveis
```json
{
  "dev": "Desenvolvimento com hot reload",
  "build": "Compilar TypeScript",
  "start": "Executar versão compilada",
  "test": "Executar testes",
  "test:watch": "Testes em modo watch",
  "test:coverage": "Testes com cobertura",
  "typeorm": "Comandos do TypeORM"
}
```

## 📈 Status das Vendas

O sistema utiliza um sistema de status numérico para acompanhar o progresso das vendas:

- **0** - Orçamento/Interesse inicial
- **1** - Negociação em andamento
- **2** - Contrato assinado
- **3** - Venda concluída

## 🛡️ Segurança

### Medidas Implementadas
- **Hash de Senhas**: Bcrypt com salt rounds
- **JWT Expiration**: Tokens com tempo de expiração
- **Validação de Entrada**: Campos obrigatórios e tipos
- **CORS**: Configurado para domínios específicos
- **SQL Injection**: Protegido pelo TypeORM

### Boas Práticas
- Variáveis sensíveis em arquivo `.env`
- Logs de erro sem exposição de dados sensíveis
- Validação de dados em todas as entradas
- Middleware de autenticação em endpoints sensíveis

## 🎓 Requisitos Acadêmicos Atendidos

### ✅ Features Implementadas
- **API REST** completa com CRUD para todas as entidades
- **Relacionamentos** entre entidades (Customer ↔ Sale ↔ Car)
- **Endpoints específicos** (carros disponíveis, vendas por status)

### ✅ Testes
- **Jest + Supertest** para testes automatizados
- **Cobertura** de endpoints principais
- **Testes de integração** com banco de dados

### ✅ Persistência
- **PostgreSQL** como banco principal
- **TypeORM** para mapeamento objeto-relacional
- **Migrações** para versionamento do schema

### ✅ Autenticação
- **JWT** para autenticação stateless
- **Proteção** de endpoints POST, PUT, DELETE
- **Endpoints públicos** para GET e login

## 🔮 Melhorias Futuras

### Funcionalidades Adicionais
- [ ] Upload de imagens dos carros
- [ ] Relatórios de vendas
- [ ] Sistema de notificações
- [ ] API de pagamentos
- [ ] Dashboard administrativo

### Melhorias Técnicas
- [ ] Cache com Redis
- [ ] Rate limiting
- [ ] Logs estruturados
- [ ] Monitoramento com Prometheus
- [ ] CI/CD com GitHub Actions

## 📞 Suporte

Para dúvidas ou problemas:
- **Issues**: Abra uma issue no GitHub
- **Documentação**: Consulte este README
- **Testes**: Execute `npm test` para verificar funcionamento

## 📄 Licença

Este projeto foi desenvolvido para fins acadêmicos e demonstração de competências técnicas em desenvolvimento de APIs REST com Node.js, TypeScript e PostgreSQL.

---

**Desenvolvido com ❤️ para demonstração de competências em desenvolvimento de software**