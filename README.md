# Sistema de Revenda de Carros

API REST para gerenciamento de uma revenda de carros com autenticação JWT.

## Funcionalidades

- **Clientes**: CRUD completo para gerenciar clientes
- **Carros**: CRUD completo para gerenciar veículos
- **Vendas**: CRUD completo para gerenciar vendas
- **Autenticação**: Login com JWT para proteger endpoints sensíveis
- **Testes**: Testes automatizados com Jest e Supertest

## Tecnologias

- Node.js + Express.js
- TypeScript
- PostgreSQL + TypeORM
- JWT para autenticação
- Jest + Supertest para testes
- Bcrypt para hash de senhas

## Instalação

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

3. Configure o banco PostgreSQL:
   - Crie um banco chamado `car_dealership`
   - Copie `env.example` para `.env`
   - Configure suas credenciais do PostgreSQL

4. Execute as migrações:
```bash
npm run typeorm migration:run
```

## Execução

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm run build
npm start
```

### Testes
```bash
npm test
```

## Endpoints

### Autenticação (Públicos)
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/register` - Registro

### Clientes
- `GET /api/v1/customers` - Listar clientes
- `GET /api/v1/customers/:id` - Buscar cliente por ID
- `POST /api/v1/customers` - Criar cliente (Protegido)
- `PUT /api/v1/customers/:id` - Atualizar cliente (Protegido)
- `DELETE /api/v1/customers/:id` - Excluir cliente (Protegido)

### Carros
- `GET /api/v1/cars` - Listar carros
- `GET /api/v1/cars/:id` - Buscar carro por ID
- `GET /api/v1/cars/available` - Listar carros disponíveis
- `GET /api/v1/cars/brand/:brand` - Buscar por marca
- `POST /api/v1/cars` - Criar carro (Protegido)
- `PUT /api/v1/cars/:id` - Atualizar carro (Protegido)
- `DELETE /api/v1/cars/:id` - Excluir carro (Protegido)

### Vendas
- `GET /api/v1/sales` - Listar vendas
- `GET /api/v1/sales/:id` - Buscar venda por ID
- `GET /api/v1/sales/customer/:customerId` - Vendas por cliente
- `GET /api/v1/sales/status/:status` - Vendas por status
- `POST /api/v1/sales/customer/:customerId/car/:carId` - Criar venda (Protegido)
- `PUT /api/v1/sales/:id` - Atualizar venda (Protegido)
- `DELETE /api/v1/sales/:id` - Excluir venda (Protegido)

## Autenticação

Para acessar endpoints protegidos, inclua o token JWT no header:
```
Authorization: Bearer SEU_TOKEN_AQUI
```

## Status das Vendas

- `0` - Orçamento/Interesse
- `1` - Negociação
- `2` - Contrato assinado
- `3` - Venda concluída

## Banco de Dados

O sistema usa PostgreSQL com TypeORM. As entidades são:
- **Customer**: Clientes
- **Car**: Carros
- **Sale**: Vendas
- **User**: Usuários do sistema