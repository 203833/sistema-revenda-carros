import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Sale } from "./Sale";

@Entity()
export class Car {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    brand!: string

    @Column()
    model!: string

    @Column()
    year!: number

    @Column()
    color!: string

    @Column('decimal', { precision: 10, scale: 2 })
    price!: number

    @Column()
    mileage!: number

    @Column()
    fuelType!: string

    @Column()
    transmission!: string

    @Column({ default: 'Disponível' })
    status!: string

    @OneToMany(() => Sale, sale => sale.car)
    public sales: Sale[];
}