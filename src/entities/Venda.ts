import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Cliente } from "./Cliente";
import { Carro } from "./Carro";

@Entity()
export class Venda {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    dataVenda!: Date

    @Column('decimal', { precision: 10, scale: 2 })
    precoVenda!: number

    @Column()
    metodoPagamento!: string

    @Column()
    status!: number

    @ManyToOne(() => Cliente, (cliente) => cliente.vendas)
    public cliente: Cliente

    @ManyToOne(() => Carro, (carro) => carro.vendas)
    public carro: Carro
}