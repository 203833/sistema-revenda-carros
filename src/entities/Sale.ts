import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Customer } from "./Customer";
import { Car } from "./Car";

@Entity()
export class Sale {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    saleDate!: Date

    @Column('decimal', { precision: 10, scale: 2 })
    salePrice!: number

    @Column()
    paymentMethod!: string

    @Column()
    status!: number

    @ManyToOne(() => Customer, (customer) => customer.sales)
    public customer: Customer

    @ManyToOne(() => Car, (car) => car.sales)
    public car: Car

    /*
    Status da Venda:
    0 - Orçamento/Interesse
    1 - Negociação
    2 - Contrato assinado
    3 - Venda concluída
    */
}