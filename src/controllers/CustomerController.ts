import { Request, Response } from "express";
import { AppDataSource } from "../config/datasource";
import { Customer } from "../entities/Customer";

export class CustomerController {
  static async getAll(req: Request, res: Response) {
    try {
      const customerRepository = AppDataSource.getRepository(Customer);
      const customers = await customerRepository.find({
        relations: ["sales"]
      });
      res.status(200).json(customers);
    } catch (error) {
      console.log(error);
      res.status(500).send("Erro ao buscar clientes");
    }
  }

  static async getById(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    try {
      const customerRepository = AppDataSource.getRepository(Customer);
      const customer = await customerRepository.findOne({
        where: { id },
        relations: ["sales", "sales.car"]
      });
      
      if (!customer) {
        return res.status(404).send("Cliente não encontrado");
      }
      
      res.status(200).json(customer);
    } catch (error) {
      console.log(error);
      res.status(500).send("Erro ao buscar cliente");
    }
  }

  static async create(req: Request, res: Response) {
    const { nome, cpf, email, telefone, endereco } = req.body;

    if (!nome || !cpf || !email || !telefone || !endereco) {
      return res.status(400).send("Todos os campos são obrigatórios");
    }

    try {
      const customerRepository = AppDataSource.getRepository(Customer);
      
      const existingCustomer = await customerRepository.findOne({
        where: { cpf }
      });
      
      if (existingCustomer) {
        return res.status(400).send("Já existe um cliente com este CPF");
      }

      const customer = customerRepository.create({
        nome,
        cpf,
        email,
        telefone,
        endereco
      });

      await customerRepository.save(customer);
      res.status(201).json({ mensagem: "Cliente criado com sucesso", cliente: customer });
    } catch (error) {
      console.log(error);
      res.status(500).send("Erro ao criar cliente");
    }
  }

  static async update(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const { nome, email, telefone, endereco } = req.body;

    if (!nome || !email || !telefone || !endereco) {
      return res.status(400).send("Todos os campos são obrigatórios");
    }

    try {
      const customerRepository = AppDataSource.getRepository(Customer);
      const customer = await customerRepository.findOne({
        where: { id }
      });

      if (!customer) {
        return res.status(404).send("Cliente não encontrado");
      }

      customer.nome = nome;
      customer.email = email;
      customer.telefone = telefone;
      customer.endereco = endereco;

      await customerRepository.save(customer);
      res.status(200).json({ mensagem: "Cliente atualizado com sucesso", cliente: customer });
    } catch (error) {
      console.log(error);
      res.status(500).send("Erro ao atualizar cliente");
    }
  }

  static async delete(req: Request, res: Response) {
    const id = parseInt(req.params.id);

    try {
      const customerRepository = AppDataSource.getRepository(Customer);
      const customer = await customerRepository.findOne({
        where: { id }
      });

      if (!customer) {
        return res.status(404).send("Cliente não encontrado");
      }

      await customerRepository.remove(customer);
      res.status(200).send("Cliente excluído com sucesso");
    } catch (error) {
      console.log(error);
      res.status(500).send("Erro ao excluir cliente");
    }
  }
}