import { DataSource } from "typeorm"
import dotenv from "dotenv"
import { Customer } from "../entities/Customer";
import { Car } from "../entities/Car";
import { Sale } from "../entities/Sale";
import { User } from "../entities/User";

dotenv.config()

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [Customer, Car, Sale, User],
  migrations: ['src/migrations/*.ts'],
});