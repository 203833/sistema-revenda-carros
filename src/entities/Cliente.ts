import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Venda } from "./Venda";

@Entity()
export class Cliente {

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

  @OneToMany(() => Venda, venda => venda.cliente)
  public vendas: Venda[];
}
