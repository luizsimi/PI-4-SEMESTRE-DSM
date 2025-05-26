import "express";

declare global {
  namespace Express {
    interface Request {
      userId?: number;
      userType?: 'cliente' | 'fornecedor' | 'admin';
    }
  }
}

// É importante exportar algo para que o TypeScript trate este arquivo como um módulo
// e aplique a declaração global. Um export vazio é suficiente.
export {};
