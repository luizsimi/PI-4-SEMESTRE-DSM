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

export default adminRouter;
