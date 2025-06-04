import { Router, Request, Response, NextFunction } from "express";
import { AdminController } from "../controllers/AdminController";

// TODO: Adicionar middleware de autenticação de admin aqui em um cenário real
// import { isAdminAuthMiddleware } from '../middlewares/adminAuth';

const adminRouter = Router();
const adminController = new AdminController();

// Middleware de autenticação para todas as rotas de admin (a ser implementado)
// adminRouter.use(isAdminAuthMiddleware);

adminRouter.get(
  "/stats/assinaturas-ativas",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await adminController.getStatsAssinaturasAtivas(req, res);
    } catch (error) {
      next(error);
    }
  }
);

adminRouter.get(
  "/fornecedores",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await adminController.getAllFornecedores(req, res);
    } catch (error) {
      next(error);
    }
  }
);

adminRouter.get(
  "/fornecedores/:id/vendas-pratos",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await adminController.getVendasPorPratoFornecedor(req, res);
    } catch (error) {
      next(error);
    }
  }
);

adminRouter.get(
  "/dashboard/stats",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await adminController.getDashboardStats(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// Novas rotas para gerenciamento de fornecedores
adminRouter.put(
  "/fornecedores/:id/ativar",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await adminController.ativarFornecedor(req, res);
    } catch (error) {
      next(error);
    }
  }
);

adminRouter.put(
  "/fornecedores/:id/desativar",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await adminController.desativarFornecedor(req, res);
    } catch (error) {
      next(error);
    }
  }
);

adminRouter.put(
  "/fornecedores/:id/ativar-assinatura",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await adminController.ativarAssinaturaFornecedor(req, res);
    } catch (error) {
      next(error);
    }
  }
);

adminRouter.put(
  "/fornecedores/:id/desativar-assinatura",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await adminController.desativarAssinaturaFornecedor(req, res);
    } catch (error) {
      next(error);
    }
  }
);

adminRouter.get(
  "/clientes",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await adminController.getAllClientes(req, res);
    } catch (error) {
      next(error);
    }
  }
);

export default adminRouter;
