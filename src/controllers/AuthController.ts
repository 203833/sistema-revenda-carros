import { Request, Response } from "express";
import { AppDataSource } from "../config/datasource";
import { Usuario } from "../entities/Usuario";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class AuthController {
  static async login(req: Request, res: Response) {
    const { nomeUsuario, senha } = req.body;

    if (!nomeUsuario || !senha) {
      return res.status(400).send("Nome de usuário e senha são obrigatórios");
    }

    try {
      const userRepository = AppDataSource.getRepository(Usuario);
      const usuario = await userRepository.findOne({
        where: { nomeUsuario }
      });

      if (!usuario) {
        return res.status(401).send("Credenciais inválidas");
      }

      const senhaValida = await bcrypt.compare(senha, usuario.senha);
      if (!senhaValida) {
        return res.status(401).send("Credenciais inválidas");
      }

      const token = jwt.sign(
        { id: usuario.id, nomeUsuario: usuario.nomeUsuario, papel: usuario.papel },
        process.env.JWT_SECRET || "chave-secreta-padrao",
        { expiresIn: "24h" }
      );

      res.status(200).json({
        mensagem: "Login realizado com sucesso",
        token,
        usuario: {
          id: usuario.id,
          nomeUsuario: usuario.nomeUsuario,
          papel: usuario.papel
        }
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("Erro durante o login");
    }
  }

  static async register(req: Request, res: Response) {
    const { nomeUsuario, senha, papel = "vendedor" } = req.body;

    if (!nomeUsuario || !senha) {
      return res.status(400).send("Nome de usuário e senha são obrigatórios");
    }

    try {
      const userRepository = AppDataSource.getRepository(Usuario);
      
      const usuarioExistente = await userRepository.findOne({
        where: { nomeUsuario }
      });

      if (usuarioExistente) {
        return res.status(400).send("Nome de usuário já existe");
      }

      const senhaCriptografada = await bcrypt.hash(senha, 10);
      const novoUsuario = userRepository.create({
        nomeUsuario,
        senha: senhaCriptografada,
        papel
      });

      await userRepository.save(novoUsuario);
      res.status(201).json({ mensagem: "Usuário criado com sucesso" });
    } catch (error) {
      console.log(error);
      res.status(500).send("Erro ao criar usuário");
    }
  }
}