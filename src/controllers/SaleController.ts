import { Request, Response } from "express";
import { Sale } from "../models/Sale";
import { Car } from "../models/Car";
import { Customer } from "../models/Customer";

export class SaleController {
  static async getAll(req: Request, res: Response) {
    try {
      const sales = await Sale.find()
        .populate('customer')
        .populate('car')
        .sort({ saleDate: -1 });
      res.status(200).json(sales);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error while fetching sales");
    }
  }

  static async create(req: Request, res: Response) {
    const { salePrice, paymentMethod, status } = req.body;
    const { customerId, carId } = req.params;

    if (!salePrice || !paymentMethod || status === undefined) {
      return res.status(400).send("All fields are required");
    }

    try {
      const customer = await Customer.findById(customerId);
      const car = await Car.findById(carId);
      
      if (!customer || !car) {
        return res.status(400).send("Customer or car not found");
      }

      if (car.status !== 'Disponível') {
        return res.status(400).send("Car is not available for sale");
      }

      const sale = new Sale({
        customer: customerId,
        car: carId,
        salePrice: Number(salePrice),
        paymentMethod: paymentMethod,
        status: Number(status),
        saleDate: new Date()
      });

      await sale.save();

      // Update car status if sale is completed
      if (Number(status) === 3) {
        car.status = 'Vendido';
        await car.save();
      }

      res.status(201).json({ message: "Sale created!", sale });
    } catch (error) {
      console.log(error);
      res.status(500).send("Error while creating sale");
    }
  }

  static async update(req: Request, res: Response) {
    const id = req.params.id;
    const { salePrice, paymentMethod, status } = req.body;

    if (!salePrice || !paymentMethod || status === undefined) {
      return res.status(400).send("All fields are required");
    }

    try {
      const sale = await Sale.findById(id).populate('car');
      
      if (!sale) {
        return res.status(404).send("Sale not found");
      }

      const oldStatus = sale.status;
      sale.salePrice = Number(salePrice);
      sale.paymentMethod = paymentMethod;
      sale.status = Number(status);
      
      await sale.save();

      // Update car status based on sale status
      if (Number(status) === 3 && oldStatus !== 3) {
        const car = await Car.findById(sale.car);
        if (car) {
          car.status = 'Vendido';
          await car.save();
        }
      } else if (Number(status) !== 3 && oldStatus === 3) {
        const car = await Car.findById(sale.car);
        if (car) {
          car.status = 'Disponível';
          await car.save();
        }
      }

      res.status(200).json({ message: "Sale updated!", sale });
    } catch (error) {
      console.log(error);
      res.status(500).send("Error updating sale " + id);
    }
  }

  static async delete(req: Request, res: Response) {
    const id = req.params.id;

    try {
      const sale = await Sale.findById(id).populate('car');
      
      if (!sale) {
        return res.status(404).send("Sale not found");
      }

      // If sale was completed, make car available again
      if (sale.status === 3) {
        const car = await Car.findById(sale.car);
        if (car) {
          car.status = 'Disponível';
          await car.save();
        }
      }

      await Sale.findByIdAndDelete(id);
      res.status(200).send("Sale deleted successfully");
    } catch (error) {
      console.log(error);
      res.status(500).send("Error removing sale " + id);
    }
  }

  static async getById(req: Request, res: Response) {
    const id = req.params.id;

    try {
      const sale = await Sale.findById(id)
        .populate('customer')
        .populate('car');
      
      if (!sale) {
        return res.status(404).send("Sale not found");
      }

      res.status(200).json(sale);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error searching sale " + id);
    }
  }

  static async getByCustomer(req: Request, res: Response) {
    const customerId = req.params.customerId;

    try {
      const sales = await Sale.find({ customer: customerId })
        .populate('car')
        .sort({ saleDate: -1 });
      res.status(200).json(sales);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error while fetching customer sales");
    }
  }

  static async getByStatus(req: Request, res: Response) {
    const status = Number(req.params.status);

    try {
      const sales = await Sale.find({ status: status })
        .populate('customer')
        .populate('car')
        .sort({ saleDate: -1 });
      res.status(200).json(sales);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error while fetching sales by status");
    }
  }
}