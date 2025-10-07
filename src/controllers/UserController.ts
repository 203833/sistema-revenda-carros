
import { Request, Response } from "express";
import { AppDataSource } from "src/config/datasource";
import { Customer } from "src/entities/Customer";

const repo = () => AppDataSource.getRepository(Customer)

export class CustomerController {
  static async getAll(req: Request, res: Response) {
    try {
      const customers = await repo().find({ 
        order: { name: "ASC" },
        relations: ["sales"]
      })
      res.status(200).json(customers)
    } catch (error) {
      console.log(error)
      res.status(500).send("Error while fetching customers")
    }
  }

  static async create(req: Request, res: Response) {
    const { name, cpf, email, phone, address } = req.body

    if (!name || !cpf || !email || !phone || !address) {
      return res.status(400).send("All fields are required")
    }

    try {
      const existingCustomer = await repo().findOneBy({ cpf })
      if (existingCustomer) {
        return res.status(400).send("Customer with this CPF already exists")
      }

      const createdCustomer = repo().create({ name, cpf, email, phone, address })
      await repo().save(createdCustomer)
      res.status(201).json({ message: "Customer created!", customer: createdCustomer })
    } catch (error) {
      console.log(error)
      res.status(500).send("Error while creating new customer")
    }
  }

  static async update(req: Request, res: Response) {
    const id: number = Number(req.params.id)
    const { name, email, phone, address } = req.body

    if (!name || !email || !phone || !address) {
      return res.status(400).send("All fields are required")
    }

    try {
      const customer = await repo().findOneBy({ id })
      if (!customer) {
        return res.status(404).send("Customer not found")
      }

      customer.name = name
      customer.email = email
      customer.phone = phone
      customer.address = address
      
      await repo().save(customer)
      res.status(200).json({ message: "Customer updated!", customer })
    } catch (error) {
      console.log(error)
      res.status(500).send("Error updating customer " + id)
    }
  }

  static async delete(req: Request, res: Response) {
    const id: number = Number(req.params.id)

    try {
      const customer = await repo().findOneBy({ id })
      if (!customer) {
        return res.status(404).send("Customer not found")
      }

      await repo().delete(id)
      res.status(200).send("Customer deleted successfully")
    } catch (error) {
      console.log(error)
      res.status(500).send("Error removing customer " + id)
    }
  }

  static async getById(req: Request, res: Response) {
    const id: number = Number(req.params.id)

    try {
      const customer = await repo().findOne({ 
        where: { id },
        relations: ["sales", "sales.car"]
      })
      
      if (!customer) {
        return res.status(404).send("Customer not found")
      }

      res.status(200).json(customer)
    } catch (error) {
      console.log(error)
      res.status(500).send("Error searching customer " + id)
    }
  }
}

