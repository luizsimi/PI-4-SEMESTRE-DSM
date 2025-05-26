import { Router, Request, Response, NextFunction } from "express";
import { FornecedorController } from "../controllers/FornecedorController";
import { authMiddleware, isFornecedor } from "../middlewares/auth";

const fornecedorRouter = Router();
const fornecedorController = new FornecedorController();

// ROTAS PÚBLICAS ESPECÍFICAS
fornecedorRouter.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await fornecedorController.create(req, res);
  } catch (error) {
    next(error);
  }
});

fornecedorRouter.get("/ativos", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await fornecedorController.listarFornecedoresAtivos(req, res);
  } catch (error) {
    next(error);
  }
});

// ROTAS PROTEGIDAS ESPECÍFICAS (requerem autenticação e tipo de usuário)
fornecedorRouter.get("/perfil", authMiddleware, isFornecedor, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await fornecedorController.getProfile(req, res);
  } catch (error) {
    next(error);
  }
});

fornecedorRouter.put("/perfil", authMiddleware, isFornecedor, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await fornecedorController.updateProfile(req, res);
  } catch (error) {
    next(error);
  }
});


// ROTAS PÚBLICAS PARAMETRIZADAS (devem vir depois das específicas para evitar conflitos)
fornecedorRouter.get("/:id", async (req: Request, res: Response, next: NextFunction) => { 
  try {
    await fornecedorController.getFornecedorByIdPublic(req, res);
  } catch (error) {
    next(error);
  }
});

// Considerar proteger esta rota também
fornecedorRouter.post("/:id/ativar-assinatura", async (req: Request, res: Response, next: NextFunction) => { 
  try {
    await fornecedorController.ativarAssinatura(req, res);
  } catch (error) {
    next(error);
  }
});


export { fornecedorRouter };
