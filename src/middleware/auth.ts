import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  usuario?: {
    id: number;
    nomeUsuario: string;
    papel: string;
  };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const cabecalhoAuth = req.headers['authorization'];
  const token = cabecalhoAuth && cabecalhoAuth.split(' ')[1];

  if (!token) {
    return res.status(401).send("Token de acesso obrigatório");
  }

  jwt.verify(token, process.env.JWT_SECRET || 'chave-secreta-padrao', (err, usuario) => {
    if (err) {
      return res.status(403).send("Token inválido ou expirado");
    }
    
    req.usuario = usuario as { id: number; nomeUsuario: string; papel: string };
    next();
  });
};

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.usuario) {
      return res.status(401).send("Autenticação obrigatória");
    }

    if (!roles.includes(req.usuario.papel)) {
      return res.status(403).send("Permissões insuficientes");
    }

    next();
  };
};
