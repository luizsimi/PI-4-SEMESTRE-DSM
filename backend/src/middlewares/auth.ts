import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

interface TokenPayload {
  id: number;
  tipo: "cliente" | "fornecedor";
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  const [, token] = authorization.split(" ");

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "levefit-default-secret"
    ) as TokenPayload;

    req.userId = decoded.id;
    req.userType = decoded.tipo;

    return next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido" });
  }
}

// Middleware para verificar se o usuário é um fornecedor
export function isFornecedor(req: Request, res: Response, next: NextFunction) {
  if (req.userType !== "fornecedor") {
    return res
      .status(403)
      .json({ error: "Acesso permitido apenas para fornecedores" });
  }

  return next();
}

// Middleware para verificar se o usuário é um cliente
export function isCliente(req: Request, res: Response, next: NextFunction) {
  if (req.userType !== "cliente") {
    return res
      .status(403)
      .json({ error: "Acesso permitido apenas para clientes" });
  }

  return next();
}

// Middleware para autenticação opcional (tenta autenticar, mas não falha se não houver token)
export function authOptionalMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { authorization } = req.headers;

  if (authorization) {
    const parts = authorization.split(" ");
    if (parts.length === 2 && parts[0] === "Bearer") {
      const token = parts[1];
      try {
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET || "levefit-default-secret"
        ) as TokenPayload;

        req.userId = decoded.id;
        req.userType = decoded.tipo;
      } catch (error) {
        // Token inválido, mas não bloqueamos a requisição
        // req.userId e req.userType permanecerão undefined
        console.warn("Tentativa de autenticação opcional falhou: Token inválido ou expirado.");
      }
    }
  }
  return next(); // Sempre chama next(), mesmo se a autenticação falhar ou não houver token
}
