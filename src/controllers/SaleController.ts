import { Request, Response } from "express";
import { AppDataSource } from "../config/datasource";
import { Sale } from "../entities/Sale";
import { Customer } from "../entities/Customer";
import { Car } from "../entities/Car";

export class SaleController {
  static async getAll(req: Request, res: Response) {
    try {
      const saleRepository = AppDataSource.getRepository(Sale);
      const sales = await saleRepository.find({
        relations: ["customer", "car"]
      });
      res.status(200).json(sales);
    } catch (error) {
      console.log(error);
      res.status(500).send("Erro ao buscar vendas");
    }
  }

  static async getById(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    try {
      const saleRepository = AppDataSource.getRepository(Sale);
      const sale = await saleRepository.findOne({
        where: { id },
        relations: ["customer", "car"]
      });
      
      if (!sale) {
        return res.status(404).send("Venda não encontrada");
      }
      
      res.status(200).json(sale);
    } catch (error) {
      console.log(error);
      res.status(500).send("Erro ao buscar venda");
    }
  }

  static async getByCustomer(req: Request, res: Response) {
    const customerId = parseInt(req.params.customerId);
    try {
      const saleRepository = AppDataSource.getRepository(Sale);
      const sales = await saleRepository.find({
        where: { customer: { id: customerId } },
        relations: ["customer", "car"]
      });
      res.status(200).json(sales);
    } catch (error) {
      console.log(error);
      res.status(500).send("Erro ao buscar vendas do cliente");
    }
  }

  static async getByStatus(req: Request, res: Response) {
    const status = parseInt(req.params.status);
    try {
      const saleRepository = AppDataSource.getRepository(Sale);
      const sales = await saleRepository.find({
        where: { status },
        relations: ["customer", "car"]
      });
      res.status(200).json(sales);
    } catch (error) {
      console.log(error);
      res.status(500).send("Erro ao buscar vendas por status");
    }
  }

  static async create(req: Request, res: Response) {
    const customerId = parseInt(req.params.customerId);
    const carId = parseInt(req.params.carId);
    const { precoVenda, metodoPagamento, status } = req.body;

    if (!precoVenda || !metodoPagamento || status === undefined) {
      return res.status(400).send("Todos os campos são obrigatórios");
    }

    try {
      const customerRepository = AppDataSource.getRepository(Customer);
      const carRepository = AppDataSource.getRepository(Car);
      const saleRepository = AppDataSource.getRepository(Sale);

      const customer = await customerRepository.findOne({
        where: { id: customerId }
      });
      const car = await carRepository.findOne({
        where: { id: carId }
      });

      if (!customer || !car) {
        return res.status(400).send("Cliente ou carro não encontrado");
      }

      if (car.status !== "Disponível") {
        return res.status(400).send("Carro não está disponível para venda");
      }

      const sale = saleRepository.create({
        dataVenda: new Date(),
        precoVenda: Number(precoVenda),
        metodoPagamento,
        status: Number(status),
        customer,
        car
      });

      await saleRepository.save(sale);

      if (Number(status) === 3) {
        car.status = "Vendido";
        await carRepository.save(car);
      }

      res.status(201).json({ mensagem: "Venda criada com sucesso", venda: sale });
    } catch (error) {
      console.log(error);
      res.status(500).send("Erro ao criar venda");
    }
  }

  static async update(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const { precoVenda, metodoPagamento, status } = req.body;

    if (!precoVenda || !metodoPagamento || status === undefined) {
      return res.status(400).send("Todos os campos são obrigatórios");
    }

    try {
      const saleRepository = AppDataSource.getRepository(Sale);
      const carRepository = AppDataSource.getRepository(Car);
      
      const sale = await saleRepository.findOne({
        where: { id },
        relations: ["car"]
      });

      if (!sale) {
        return res.status(404).send("Venda não encontrada");
      }

      const statusAnterior = sale.status;
      sale.precoVenda = Number(precoVenda);
      sale.metodoPagamento = metodoPagamento;
      sale.status = Number(status);

      await saleRepository.save(sale);

      const car = await carRepository.findOne({
        where: { id: sale.car.id }
      });

      if (car) {
        if (Number(status) === 3 && statusAnterior !== 3) {
          car.status = "Vendido";
        } else if (Number(status) !== 3 && statusAnterior === 3) {
          car.status = "Disponível";
        }
        await carRepository.save(car);
      }

      res.status(200).json({ mensagem: "Venda atualizada com sucesso", venda: sale });
    } catch (error) {
      console.log(error);
      res.status(500).send("Erro ao atualizar venda");
    }
  }

  static async delete(req: Request, res: Response) {
    const id = parseInt(req.params.id);

    try {
      const saleRepository = AppDataSource.getRepository(Sale);
      const carRepository = AppDataSource.getRepository(Car);
      
      const sale = await saleRepository.findOne({
        where: { id },
        relations: ["car"]
      });

      if (!sale) {
        return res.status(404).send("Venda não encontrada");
      }

      if (sale.status === 3) {
        const car = await carRepository.findOne({
          where: { id: sale.car.id }
        });
        if (car) {
          car.status = "Disponível";
          await carRepository.save(car);
        }
      }

      await saleRepository.remove(sale);
      res.status(200).send("Venda excluída com sucesso");
    } catch (error) {
      console.log(error);
      res.status(500).send("Erro ao excluir venda");
    }
  }
}