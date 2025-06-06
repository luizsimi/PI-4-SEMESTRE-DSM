import { Request, Response } from "express";
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
          createdAt: "desc", // ou nome, etc.
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
        return res
          .status(400)
          .json({ error: "ID do fornecedor é obrigatório" });
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
              OR: [{ status: "confirmado" }, { status: "entregue" }],
            },
            select: {
              id: true, // Apenas para contagem
            },
          },
        },
      });

      if (!pratosDoFornecedor) {
        return res
          .status(404)
          .json({ error: "Fornecedor ou pratos não encontrados" });
      }

      const vendasPorPrato = pratosDoFornecedor
        .map((prato) => ({
          nomePrato: prato.nome,
          quantidadeVendida: prato.pedidos.length,
          valorTotalVendido: prato.pedidos.length * prato.preco,
        }))
        .filter((p) => p.quantidadeVendida > 0); // Apenas pratos com vendas

      return res.json(vendasPorPrato);
    } catch (error) {
      console.error("Erro ao buscar vendas por prato do fornecedor:", error);
      return res
        .status(500)
        .json({ error: "Erro interno do servidor ao buscar vendas" });
    }
  }

  async getDashboardStats(req: Request, res: Response) {
    try {
      // Obtém o período a partir dos parâmetros da query
      const periodo = (req.query.periodo as string) || "mes";

      // Define a data de início baseada no período selecionado
      let dataInicio = new Date();
      switch (periodo) {
        case "hoje":
          dataInicio.setHours(0, 0, 0, 0); // Início do dia atual
          break;
        case "semana":
          dataInicio.setDate(dataInicio.getDate() - 7); // 7 dias atrás
          break;
        case "mes":
          dataInicio.setMonth(dataInicio.getMonth() - 1); // 1 mês atrás
          break;
        case "ano":
          dataInicio.setFullYear(dataInicio.getFullYear() - 1); // 1 ano atrás
          break;
        default:
          dataInicio.setMonth(dataInicio.getMonth() - 1); // Default: 1 mês
      }

      // Conta as assinaturas ativas
      const totalAssinaturasAtivas = await prisma.fornecedor.count({
        where: { assinaturaAtiva: true },
      });

      // Total de clientes cadastrados
      const totalClientes = await prisma.cliente.count();

      // Novos clientes no período
      const novosClientesPeriodo = await prisma.cliente.count({
        where: {
          createdAt: { gte: dataInicio },
        },
      });

      // Cálculo de variação de novos clientes (%)
      let variacaoClientes = 0;
      if (novosClientesPeriodo > 0 && totalClientes > 0) {
        variacaoClientes = Math.round(
          (novosClientesPeriodo / totalClientes) * 100
        );
      }

      // Conta assinaturas ativas do período anterior para cálculo de variação
      const dataInicioAnterior = new Date(dataInicio);
      if (periodo === "mes") {
        dataInicioAnterior.setMonth(dataInicioAnterior.getMonth() - 1);
      } else if (periodo === "ano") {
        dataInicioAnterior.setFullYear(dataInicioAnterior.getFullYear() - 1);
      } else if (periodo === "semana") {
        dataInicioAnterior.setDate(dataInicioAnterior.getDate() - 7);
      } else {
        dataInicioAnterior.setDate(dataInicioAnterior.getDate() - 1);
      }

      // Fornecedores que se tornaram ativos no período atual
      const assinaturasAtivasNoPeriodo = await prisma.fornecedor.count({
        where: {
          assinaturaAtiva: true,
          updatedAt: { gte: dataInicio },
        },
      });

      // Cálculo de variação (simplificado)
      let variacaoAssinaturas = 0;
      if (assinaturasAtivasNoPeriodo > 0) {
        variacaoAssinaturas = Math.round(
          (assinaturasAtivasNoPeriodo / totalAssinaturasAtivas) * 100
        );
      }

      // Contagem total de fornecedores
      const totalFornecedores = await prisma.fornecedor.count();

      // Novos fornecedores na semana
      const dataInicioSemana = new Date();
      dataInicioSemana.setDate(dataInicioSemana.getDate() - 7);

      const novosFornecedoresSemana = await prisma.fornecedor.count({
        where: {
          createdAt: { gte: dataInicioSemana },
        },
      });

      // Total de pratos ativos
      const totalPratosAtivos = await prisma.prato.count({
        where: { disponivel: true },
      });

      // Pedidos recentes (hoje)
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);

      // Pedidos do dia
      const totalPedidosHoje = await prisma.pedido.count({
        where: {
          time_do_pedido: { gte: hoje },
        },
      });

      // Pedidos recentes com dados do cliente
      const pedidosRecentes = await prisma.pedido.findMany({
        take: 5,
        orderBy: {
          time_do_pedido: "desc",
        },
        include: {
          cliente: {
            select: {
              nome: true,
            },
          },
        },
      });

      // Fornecedores recentes
      const fornecedoresRecentes = await prisma.fornecedor.findMany({
        take: 3,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          nome: true,
          logo: true,
          assinaturaAtiva: true,
          createdAt: true,
        },
      });

      // Formata os dados dos pedidos
      const pedidosFormatados = pedidosRecentes.map((pedido) => ({
        id: pedido.id,
        cliente: pedido.cliente?.nome || pedido.nomeCliente,
        valorTotal: pedido.valor_total_pedido || 0,
        data: pedido.time_do_pedido.toISOString(),
        status: pedido.status,
      }));

      // Formata os dados dos fornecedores
      const fornecedoresFormatados = fornecedoresRecentes.map((fornecedor) => ({
        id: fornecedor.id,
        nome: fornecedor.nome,
        logo: fornecedor.logo,
        assinaturaAtiva: fornecedor.assinaturaAtiva,
        dataCadastro: fornecedor.createdAt.toISOString(),
      }));

      // Retorna todas as estatísticas em um único objeto
      return res.json({
        totalAssinaturasAtivas,
        totalPedidosHoje,
        totalPratosAtivos,
        totalFornecedores,
        totalClientes,
        novosClientesPeriodo,
        variacaoClientes,
        variacaoAssinaturas,
        novosFornecedoresSemana,
        pedidosRecentes: pedidosFormatados,
        fornecedoresRecentes: fornecedoresFormatados,
      });
    } catch (error) {
      console.error("Erro ao buscar estatísticas do dashboard:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  async ativarFornecedor(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id || isNaN(Number(id))) {
        return res.status(400).json({ error: "ID do fornecedor inválido" });
      }

      const fornecedor = await prisma.fornecedor.findUnique({
        where: { id: Number(id) },
      });

      if (!fornecedor) {
        return res.status(404).json({ error: "Fornecedor não encontrado" });
      }

      const fornecedorAtualizado = await prisma.fornecedor.update({
        where: { id: Number(id) },
        data: { status: true },
        select: {
          id: true,
          nome: true,
          email: true,
          status: true,
          assinaturaAtiva: true,
        },
      });

      return res.json({
        message: "Fornecedor ativado com sucesso",
        fornecedor: fornecedorAtualizado,
      });
    } catch (error) {
      console.error("Erro ao ativar fornecedor:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  async desativarFornecedor(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id || isNaN(Number(id))) {
        return res.status(400).json({ error: "ID do fornecedor inválido" });
      }

      const fornecedor = await prisma.fornecedor.findUnique({
        where: { id: Number(id) },
      });

      if (!fornecedor) {
        return res.status(404).json({ error: "Fornecedor não encontrado" });
      }

      const fornecedorAtualizado = await prisma.fornecedor.update({
        where: { id: Number(id) },
        data: { status: false },
        select: {
          id: true,
          nome: true,
          email: true,
          status: true,
          assinaturaAtiva: true,
        },
      });

      return res.json({
        message: "Fornecedor desativado com sucesso",
        fornecedor: fornecedorAtualizado,
      });
    } catch (error) {
      console.error("Erro ao desativar fornecedor:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  async ativarAssinaturaFornecedor(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id || isNaN(Number(id))) {
        return res.status(400).json({ error: "ID do fornecedor inválido" });
      }

      const fornecedor = await prisma.fornecedor.findUnique({
        where: { id: Number(id) },
      });

      if (!fornecedor) {
        return res.status(404).json({ error: "Fornecedor não encontrado" });
      }

      const fornecedorAtualizado = await prisma.fornecedor.update({
        where: { id: Number(id) },
        data: { assinaturaAtiva: true },
        select: {
          id: true,
          nome: true,
          email: true,
          status: true,
          assinaturaAtiva: true,
        },
      });

      return res.json({
        message: "Assinatura do fornecedor ativada com sucesso",
        fornecedor: fornecedorAtualizado,
      });
    } catch (error) {
      console.error("Erro ao ativar assinatura do fornecedor:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  async desativarAssinaturaFornecedor(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id || isNaN(Number(id))) {
        return res.status(400).json({ error: "ID do fornecedor inválido" });
      }

      const fornecedor = await prisma.fornecedor.findUnique({
        where: { id: Number(id) },
      });

      if (!fornecedor) {
        return res.status(404).json({ error: "Fornecedor não encontrado" });
      }

      const fornecedorAtualizado = await prisma.fornecedor.update({
        where: { id: Number(id) },
        data: { assinaturaAtiva: false },
        select: {
          id: true,
          nome: true,
          email: true,
          status: true,
          assinaturaAtiva: true,
        },
      });

      return res.json({
        message: "Assinatura do fornecedor desativada com sucesso",
        fornecedor: fornecedorAtualizado,
      });
    } catch (error) {
      console.error("Erro ao desativar assinatura do fornecedor:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  async getAllClientes(req: Request, res: Response) {
    try {
      // TODO: Adicionar autenticação de admin aqui em um cenário real

      const clientes = await prisma.cliente.findMany({
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          nome: true,
          email: true,
          telefone: true,
          createdAt: true,
          updatedAt: true,
          // Não selecionamos a senha por segurança
          pedidos: {
            select: {
              id: true,
              valor_total_pedido: true,
              status: true,
              time_do_pedido: true,
            },
            orderBy: {
              time_do_pedido: "desc",
            },
            take: 3, // Apenas os 3 pedidos mais recentes
          },
        },
      });

      // Calcular estatísticas para cada cliente
      const clientesComEstatisticas = clientes.map((cliente) => {
        const totalGasto = cliente.pedidos.reduce(
          (sum, pedido) => sum + (pedido.valor_total_pedido || 0),
          0
        );
        const pedidosFinalizados = cliente.pedidos.filter(
          (pedido) =>
            pedido.status === "entregue" || pedido.status === "finalizado"
        ).length;

        return {
          ...cliente,
          estatisticas: {
            totalGasto,
            totalPedidos: cliente.pedidos.length,
            pedidosFinalizados,
          },
        };
      });

      return res.json(clientesComEstatisticas);
    } catch (error) {
      console.error("Erro ao buscar todos os clientes:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
}
