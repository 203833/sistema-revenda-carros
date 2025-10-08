import { DataSource } from "typeorm"
import dotenv from "dotenv"
import { Cliente } from "../entities/Cliente";
import { Carro } from "../entities/Carro";
import { Venda } from "../entities/Venda";
import { Usuario } from "../entities/Usuario";

dotenv.config()

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: ':memory:',
  synchronize: true,
  logging: false,
  entities: [Cliente, Carro, Venda, Usuario],
  migrations: ['src/migrations/*.ts'],
});