import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Customer } from "./Customer";
import { Car } from "./Car";

@Entity()
export class Sale {
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

    @ManyToOne(() => Customer, (customer) => customer.sales)
    public customer: Customer

    @ManyToOne(() => Car, (car) => car.sales)
    public car: Car
}