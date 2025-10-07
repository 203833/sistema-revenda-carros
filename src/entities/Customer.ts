import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Sale } from "./Sale";

@Entity()
export class Customer {

  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  name!: string

  @Column({ unique: true })
  cpf!: string

  @Column()
  email!: string

  @Column()
  phone!: string

  @Column()
  address!: string

  @OneToMany(() => Sale, sale => sale.customer)
  public sales: Sale[];
}
