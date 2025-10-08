import { Request, Response } from "express";
import { AppDataSource } from "../config/datasource";
import { Carro } from "../entities/Carro";

export class CarroController {
  static async getAll(req: Request, res: Response) {
    try {
      const carRepository = AppDataSource.getRepository(Carro);
      const cars = await carRepository.find({
        relations: ["vendas"]
      });
      res.status(200).json(cars);
    } catch (error) {
      console.log(error);
      res.status(500).send("Erro ao buscar carros");
    }
  }

  static async getById(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    try {
      const carRepository = AppDataSource.getRepository(Carro);
      const car = await carRepository.findOne({
        where: { id },
        relations: ["vendas"]
      });
      
      if (!car) {
        return res.status(404).send("Carro não encontrado");
      }
      
      res.status(200).json(car);
    } catch (error) {
      console.log(error);
      res.status(500).send("Erro ao buscar carro");
    }
  }

  static async getAvailable(req: Request, res: Response) {
    try {
      const carRepository = AppDataSource.getRepository(Carro);
      const cars = await carRepository.find({
        where: { status: "Disponível" },
        relations: ["vendas"]
      });
      res.status(200).json(cars);
    } catch (error) {
      console.log(error);
      res.status(500).send("Erro ao buscar carros disponíveis");
    }
  }

  static async searchByBrand(req: Request, res: Response) {
    const brand = req.params.brand;
    try {
      const carRepository = AppDataSource.getRepository(Carro);
      const cars = await carRepository.find({
        where: { marca: brand },
        relations: ["vendas"]
      });
      res.status(200).json(cars);
    } catch (error) {
      console.log(error);
      res.status(500).send("Erro ao buscar carros por marca");
    }
  }

  static async create(req: Request, res: Response) {
    const { marca, modelo, ano, cor, preco, quilometragem, tipoCombustivel, transmissao } = req.body;

    if (!marca || !modelo || !ano || !cor || !preco || !quilometragem || !tipoCombustivel || !transmissao) {
      return res.status(400).send("Todos os campos são obrigatórios");
    }

    try {
      const carRepository = AppDataSource.getRepository(Carro);
      const car = carRepository.create({
        marca,
        modelo,
        ano,
        cor,
        preco,
        quilometragem,
        tipoCombustivel,
        transmissao,
        status: "Disponível"
      });

      await carRepository.save(car);
      res.status(201).json({ mensagem: "Carro criado com sucesso", carro: car });
    } catch (error) {
      console.log(error);
      res.status(500).send("Erro ao criar carro");
    }
  }

  static async update(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const { marca, modelo, ano, cor, preco, quilometragem, tipoCombustivel, transmissao, status } = req.body;

    if (!marca || !modelo || !ano || !cor || !preco || !quilometragem || !tipoCombustivel || !transmissao) {
      return res.status(400).send("Todos os campos são obrigatórios");
    }

    try {
      const carRepository = AppDataSource.getRepository(Carro);
      const car = await carRepository.findOne({
        where: { id }
      });

      if (!car) {
        return res.status(404).send("Carro não encontrado");
      }

      car.marca = marca;
      car.modelo = modelo;
      car.ano = ano;
      car.cor = cor;
      car.preco = preco;
      car.quilometragem = quilometragem;
      car.tipoCombustivel = tipoCombustivel;
      car.transmissao = transmissao;
      if (status) car.status = status;

      await carRepository.save(car);
      res.status(200).json({ mensagem: "Carro atualizado com sucesso", carro: car });
    } catch (error) {
      console.log(error);
      res.status(500).send("Erro ao atualizar carro");
    }
  }

  static async delete(req: Request, res: Response) {
    const id = parseInt(req.params.id);

    try {
      const carRepository = AppDataSource.getRepository(Carro);
      const car = await carRepository.findOne({
        where: { id }
      });

      if (!car) {
        return res.status(404).send("Carro não encontrado");
      }

      await carRepository.remove(car);
      res.status(200).send("Carro excluído com sucesso");
    } catch (error) {
      console.log(error);
      res.status(500).send("Erro ao excluir carro");
    }
  }
}