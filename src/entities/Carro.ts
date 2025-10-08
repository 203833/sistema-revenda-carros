import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Venda } from "./Venda";

@Entity()
export class Carro {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    marca!: string

    @Column()
    modelo!: string

    @Column()
    ano!: number

    @Column()
    cor!: string

    @Column('decimal', { precision: 10, scale: 2 })
    preco!: number

    @Column()
    quilometragem!: number

    @Column()
    tipoCombustivel!: string

    @Column()
    transmissao!: string

    @Column({ default: 'Disponível' })
    status!: string

    @OneToMany(() => Venda, venda => venda.carro)
    public vendas: Venda[];
}