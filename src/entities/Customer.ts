import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Sale } from "./Sale";

@Entity()
export class Customer {

  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  nome!: string

  @Column({ unique: true })
  cpf!: string

  @Column()
  email!: string

  @Column()
  telefone!: string

  @Column()
  endereco!: string

  @OneToMany(() => Sale, sale => sale.customer)
  public sales: Sale[];
}
