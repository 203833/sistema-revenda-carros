import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ unique: true })
  nomeUsuario!: string

  @Column()
  senha!: string

  @Column()
  papel!: string
}