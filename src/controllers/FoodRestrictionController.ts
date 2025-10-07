
import { Request, Response } from "express";
import { AppDataSource } from "src/config/datasource";
import { Sale } from "src/entities/Sale";
import { Car } from "src/entities/Car";
import { Customer } from "src/entities/Customer";

const repo = () => AppDataSource.getRepository(Sale)
const customerRepo = () => AppDataSource.getRepository(Customer)
const carRepo = () => AppDataSource.getRepository(Car)

export class SaleController {
  static async getAll(req: Request, res: Response) {
    try {
      const sales = await repo().find({ 
        order: { saleDate: "DESC" },
        relations: ["customer", "car"]
      })
      res.status(200).json(sales)
    } catch (error) {
      console.log(error)
      res.status(500).send("Error while fetching sales")
    }
  }

  static async create(req: Request, res: Response) {
    const { salePrice, paymentMethod, status } = req.body
    const { customerId, carId } = req.params

    if (!salePrice || !paymentMethod || status === undefined) {
      return res.status(400).send("All fields are required")
    }

    try {
      const customer = await customerRepo().findOneBy({ id: Number(customerId) })
      const car = await carRepo().findOneBy({ id: Number(carId) })
      
      if (!customer || !car) {
        return res.status(400).send("Customer or car not found")
      }

      if (car.status !== 'Disponível') {
        return res.status(400).send("Car is not available for sale")
      }

      const sale = repo().create({
        customer: customer,
        car: car,
        salePrice: Number(salePrice),
        paymentMethod: paymentMethod,
        status: Number(status),
        saleDate: new Date()
      })

      await repo().save(sale)


      if (Number(status) === 3) {
        car.status = 'Vendido'
        await carRepo().save(car)
      }

      res.status(201).json({ message: "Sale created!", sale })
    } catch (error) {
      console.log(error)
      res.status(500).send("Error while creating sale")
    }
  }

  static async update(req: Request, res: Response) {
    const id: number = Number(req.params.id)
    const { salePrice, paymentMethod, status } = req.body

    if (!salePrice || !paymentMethod || status === undefined) {
      return res.status(400).send("All fields are required")
    }

    try {
      const sale = await repo().findOne({ 
        where: { id },
        relations: ["car"]
      })
      
      if (!sale) {
        return res.status(404).send("Sale not found")
      }

      const oldStatus = sale.status
      sale.salePrice = Number(salePrice)
      sale.paymentMethod = paymentMethod
      sale.status = Number(status)
      
      await repo().save(sale)


      if (Number(status) === 3 && oldStatus !== 3) {
        sale.car.status = 'Vendido'
        await carRepo().save(sale.car)
      } else if (Number(status) !== 3 && oldStatus === 3) {
        sale.car.status = 'Disponível'
        await carRepo().save(sale.car)
      }

      res.status(200).json({ message: "Sale updated!", sale })
    } catch (error) {
      console.log(error)
      res.status(500).send("Error updating sale " + id)
    }
  }

  static async delete(req: Request, res: Response) {
    const id: number = Number(req.params.id)

    try {
      const sale = await repo().findOne({ 
        where: { id },
        relations: ["car"]
      })
      
      if (!sale) {
        return res.status(404).send("Sale not found")
      }


      if (sale.status === 3) {
        sale.car.status = 'Disponível'
        await carRepo().save(sale.car)
      }

      await repo().delete(id)
      res.status(200).send("Sale deleted successfully")
    } catch (error) {
      console.log(error)
      res.status(500).send("Error removing sale " + id)
    }
  }

  static async getById(req: Request, res: Response) {
    const id: number = Number(req.params.id)

    try {
      const sale = await repo().findOne({ 
        where: { id },
        relations: ["customer", "car"]
      })
      
      if (!sale) {
        return res.status(404).send("Sale not found")
      }

      res.status(200).json(sale)
    } catch (error) {
      console.log(error)
      res.status(500).send("Error searching sale " + id)
    }
  }

  static async getByCustomer(req: Request, res: Response) {
    const customerId = Number(req.params.customerId)

    try {
      const sales = await repo().find({ 
        where: { customer: { id: customerId } },
        relations: ["car"],
        order: { saleDate: "DESC" }
      })
      res.status(200).json(sales)
    } catch (error) {
      console.log(error)
      res.status(500).send("Error while fetching customer sales")
    }
  }

  static async getByStatus(req: Request, res: Response) {
    const status = Number(req.params.status)

    try {
      const sales = await repo().find({ 
        where: { status: status },
        relations: ["customer", "car"],
        order: { saleDate: "DESC" }
      })
      res.status(200).json(sales)
    } catch (error) {
      console.log(error)
      res.status(500).send("Error while fetching sales by status")
    }
  }
}

