import { Router, Request, Response, NextFunction } from 'express';
import { PedidoController } from '../controllers/PedidoController';
import { authMiddleware, isFornecedor, isCliente, authOptionalMiddleware } from '../middlewares/auth'; // Adicionar isCliente se criarPedido for protegido para cliente

const pedidoRouter = Router();
const pedidoController = new PedidoController();

// Rota para fornecedor buscar seus pedidos
pedidoRouter.get(
  "/fornecedor", 
  authMiddleware, 
  isFornecedor, 
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await pedidoController.getPedidosDoFornecedor(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// Rota para fornecedor atualizar status de um pedido
pedidoRouter.put(
  "/fornecedor/:pedidoId/status", 
  authMiddleware, 
  isFornecedor, 
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await pedidoController.updateStatusPedidoFornecedor(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// Rota para criar um novo pedido (pode ser pública ou protegida por cliente)
// Se protegida por cliente:
// pedidoRouter.post("/", authMiddleware, isCliente, async (req: Request, res: Response, next: NextFunction) => {
// Se pública (ou autenticação opcional dentro do controller):
pedidoRouter.post("/", authOptionalMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Se o authMiddleware for usado globalmente antes, req.userId pode estar disponível
    // Se não, o controller precisa lidar com req.userId opcional se vier de um cliente logado.
    await pedidoController.criarPedido(req, res);
  } catch (error) {
    next(error);
  }
});

// Nova rota para cliente buscar seus pedidos
pedidoRouter.get(
  "/meus",
  authMiddleware, // Requer autenticação
  isCliente,      // Requer que o usuário seja um cliente
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await pedidoController.getMeusPedidos(req, res);
    } catch (error) {
      next(error);
    }
  }
);

export default pedidoRouter; 