import { Request, Response } from 'express';
import { prisma } from "../server";

export class AdminController {
  async getStatsAssinaturasAtivas(req: Request, res: Response) {
    try {
      // TODO: Adicionar autenticação de admin aqui em um cenário real

      const totalAssinaturasAtivas = await prisma.fornecedor.count({
        where: { assinaturaAtiva: true },
      });

      return res.json({ totalAssinaturasAtivas });
    } catch (error) {
      console.error("Erro ao buscar total de assinaturas ativas:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  async getAllFornecedores(req: Request, res: Response) {
    try {
      // TODO: Adicionar autenticação de admin aqui em um cenário real

      const fornecedores = await prisma.fornecedor.findMany({
        orderBy: {
          createdAt: 'desc', // ou nome, etc.
        },
      });

      return res.json(fornecedores);
    } catch (error) {
      console.error("Erro ao buscar todos os fornecedores:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  async getVendasPorPratoFornecedor(req: Request, res: Response) {
    try {
      const { id: fornecedorId } = req.params;
      // TODO: Adicionar autenticação de admin aqui em um cenário real

      if (!fornecedorId) {
        return res.status(400).json({ error: "ID do fornecedor é obrigatório" });
      }

      const pratosDoFornecedor = await prisma.prato.findMany({
        where: {
          fornecedorId: parseInt(fornecedorId, 10),
        },
        include: {
          // Contar pedidos confirmados/entregues para cada prato
          // Esta é uma forma simplificada. Uma contagem direta no DB seria mais eficiente.
          // No Prisma, isso geralmente requer queries mais complexas ou raw queries para agregações condicionais diretas.
          // Por simplicidade, vamos buscar os pedidos e processar no backend.
          // NOTA: Isso pode ser INEFICIENTE para muitos pedidos. Idealmente, faríamos agregações no banco.
          pedidos: {
            where: {
              OR: [
                { status: "confirmado" }, 
                { status: "entregue" }
              ]
            },
            select: {
              id: true // Apenas para contagem
            }
          }
        }
      });

      if (!pratosDoFornecedor) {
        return res.status(404).json({ error: "Fornecedor ou pratos não encontrados" });
      }

      const vendasPorPrato = pratosDoFornecedor.map(prato => ({
        nomePrato: prato.nome,
        quantidadeVendida: prato.pedidos.length,
        valorTotalVendido: prato.pedidos.length * prato.preco,
      })).filter(p => p.quantidadeVendida > 0); // Apenas pratos com vendas
      
      return res.json(vendasPorPrato);

    } catch (error) {
      console.error("Erro ao buscar vendas por prato do fornecedor:", error);
      return res.status(500).json({ error: "Erro interno do servidor ao buscar vendas" });
    }
  }
} 