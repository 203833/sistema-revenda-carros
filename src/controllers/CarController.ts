import { Request, Response } from "express";
import { Car } from "../models/Car";

export class CarController {
  static async getAll(req: Request, res: Response) {
    try {
      const cars = await Car.find()
        .populate('sales')
        .sort({ brand: 1, model: 1 });
      res.status(200).json(cars);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error while fetching cars");
    }
  }

  static async create(req: Request, res: Response) {
    const { brand, carModel, year, color, price, mileage, fuelType, transmission } = req.body;

    if (!brand || !carModel || !year || !color || !price || !mileage || !fuelType || !transmission) {
      return res.status(400).send("All fields are required");
    }

    try {
      const car = new Car({
        brand, carModel, year, color, price, mileage, fuelType, transmission
      });
      await car.save();
      res.status(201).json({ message: "Car created!", car });
    } catch (error) {
      console.log(error);
      res.status(500).send("Error while creating new car");
    }
  }

  static async update(req: Request, res: Response) {
    const id = req.params.id;
    const { brand, carModel, year, color, price, mileage, fuelType, transmission, status } = req.body;

    if (!brand || !carModel || !year || !color || !price || !mileage || !fuelType || !transmission) {
      return res.status(400).send("All fields are required");
    }

    try {
      const car = await Car.findById(id);
      if (!car) {
        return res.status(404).send("Car not found");
      }

      car.brand = brand;
      car.carModel = carModel;
      car.year = year;
      car.color = color;
      car.price = price;
      car.mileage = mileage;
      car.fuelType = fuelType;
      car.transmission = transmission;
      if (status) car.status = status;
      
      await car.save();
      res.status(200).json({ message: "Car updated!", car });
    } catch (error) {
      console.log(error);
      res.status(500).send("Error updating car " + id);
    }
  }

  static async delete(req: Request, res: Response) {
    const id = req.params.id;

    try {
      const car = await Car.findById(id);
      if (!car) {
        return res.status(404).send("Car not found");
      }

      await Car.findByIdAndDelete(id);
      res.status(200).send("Car deleted successfully");
    } catch (error) {
      console.log(error);
      res.status(500).send("Error removing car " + id);
    }
  }

  static async getById(req: Request, res: Response) {
    const id = req.params.id;

    try {
      const car = await Car.findById(id)
        .populate('sales')
        .populate({
          path: 'sales',
          populate: {
            path: 'customer',
            model: 'Customer'
          }
        });
      
      if (!car) {
        return res.status(404).send("Car not found");
      }

      res.status(200).json(car);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error searching car " + id);
    }
  }

  static async getAvailable(req: Request, res: Response) {
    try {
      const cars = await Car.find({ status: 'Disponível' })
        .sort({ brand: 1, model: 1 });
      res.status(200).json(cars);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error while fetching available cars");
    }
  }

  static async searchByBrand(req: Request, res: Response) {
    const brand = req.params.brand;

    try {
      const cars = await Car.find({ brand: brand })
        .sort({ model: 1 });
      res.status(200).json(cars);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error while searching cars by brand");
    }
  }
}