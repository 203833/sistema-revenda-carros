import { Request, Response } from "express";
import { Customer } from "../models/Customer";

export class CustomerController {
  static async getAll(req: Request, res: Response) {
    try {
      const customers = await Customer.find()
        .populate('sales')
        .sort({ name: 1 });
      res.status(200).json(customers);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error while fetching customers");
    }
  }

  static async create(req: Request, res: Response) {
    const { name, cpf, email, phone, address } = req.body;

    if (!name || !cpf || !email || !phone || !address) {
      return res.status(400).send("All fields are required");
    }

    try {
      const existingCustomer = await Customer.findOne({ cpf });
      if (existingCustomer) {
        return res.status(400).send("Customer with this CPF already exists");
      }

      const customer = new Customer({ name, cpf, email, phone, address });
      await customer.save();
      res.status(201).json({ message: "Customer created!", customer });
    } catch (error) {
      console.log(error);
      res.status(500).send("Error while creating new customer");
    }
  }

  static async update(req: Request, res: Response) {
    const id = req.params.id;
    const { name, email, phone, address } = req.body;

    if (!name || !email || !phone || !address) {
      return res.status(400).send("All fields are required");
    }

    try {
      const customer = await Customer.findById(id);
      if (!customer) {
        return res.status(404).send("Customer not found");
      }

      customer.name = name;
      customer.email = email;
      customer.phone = phone;
      customer.address = address;
      
      await customer.save();
      res.status(200).json({ message: "Customer updated!", customer });
    } catch (error) {
      console.log(error);
      res.status(500).send("Error updating customer " + id);
    }
  }

  static async delete(req: Request, res: Response) {
    const id = req.params.id;

    try {
      const customer = await Customer.findById(id);
      if (!customer) {
        return res.status(404).send("Customer not found");
      }

      await Customer.findByIdAndDelete(id);
      res.status(200).send("Customer deleted successfully");
    } catch (error) {
      console.log(error);
      res.status(500).send("Error removing customer " + id);
    }
  }

  static async getById(req: Request, res: Response) {
    const id = req.params.id;

    try {
      const customer = await Customer.findById(id)
        .populate('sales')
        .populate({
          path: 'sales',
          populate: {
            path: 'car',
            model: 'Car'
          }
        });
      
      if (!customer) {
        return res.status(404).send("Customer not found");
      }

      res.status(200).json(customer);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error searching customer " + id);
    }
  }
}