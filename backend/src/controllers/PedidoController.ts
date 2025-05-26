import { Request, Response } from 'express';
import { prisma } from "../server";

// Definição de tipos para maior clareza, se necessário (opcional)
// interface UserDataToken {
//   id: number;
//   // outros campos do token se houver
// }

// Estendendo a interface Request do Express para incluir userId e userType
declare global {
  namespace Express {
    interface Request {
      userId?: number;
      userType?: 'cliente' | 'fornecedor' | 'admin';
    }
  }
}

// Status e transições permitidas para o fornecedor
const validStatusTransitionsFornecedor: Record<string, string[]> = {
  NOVO: ["EM_PREPARO", "AGUARDANDO_CLIENTE", "RECUSADO"],
  EM_PREPARO: ["FINALIZADO", "CANCELADO_FORNECEDOR", "AGUARDANDO_CLIENTE", "NOVO"],
  AGUARDANDO_CLIENTE: ["FINALIZADO", "CANCELADO_FORNECEDOR", "EM_PREPARO"],
  FINALIZADO: ["AGUARDANDO_CLIENTE", "EM_PREPARO", "NOVO"],
  RECUSADO: ["NOVO"],
  CANCELADO_FORNECEDOR: ["NOVO"],
  // PRONTO_PARA_RETIRADA, SAIU_PARA_ENTREGA (se usados como status discretos) seriam intermediários.
};

export class PedidoController {
  // ... (outros métodos como criarPedido podem existir) ...

  async getPedidosDoFornecedor(req: Request, res: Response) {
    const fornecedorId = req.userId;
    console.log("[Controller] Buscando pedidos para fornecedor ID:", fornecedorId);

    if (!fornecedorId) {
      console.error("[Controller] ID do fornecedor não encontrado na requisição em getPedidosDoFornecedor.");
      return res.status(401).json({ error: "Fornecedor não autenticado." });
    }

    try {
      const pedidos = await prisma.pedido.findMany({
        where: { id_fornecedor: Number(fornecedorId) },
        include: {
          prato: { 
            select: { nome: true, preco: true, imagem: true } 
          },
          cliente: { 
            select: { nome: true }
          }
        },
        orderBy: {
          time_do_pedido: 'desc',
        },
      });
      console.log("[Controller] Pedidos encontrados com sucesso:", pedidos.length);
      return res.json(pedidos);
    } catch (error) {
      console.error("[Controller] Erro CRÍTICO ao buscar pedidos do fornecedor:", error);
      let errorMessage = "Erro desconhecido ao processar sua solicitação.";
      let errorDetails: any = {};

      if (error instanceof Error) {
        errorMessage = error.message;
      }
      // Verificar se é um erro do Prisma e tentar extrair mais detalhes
      if (typeof error === 'object' && error !== null) {
        if ('code' in error) errorDetails.prismaCode = error.code;
        if ('meta' in error) errorDetails.prismaMeta = error.meta;
        if ('message' in error && typeof error.message === 'string') errorMessage = error.message;
      }
      
      console.error("[Controller] Detalhes do Erro Prisma:", JSON.stringify(errorDetails, null, 2));

      return res.status(500).json({ 
        error: "Erro interno ao buscar pedidos.", 
        details: errorMessage,
        prismaDetails: Object.keys(errorDetails).length > 0 ? errorDetails : undefined
      });
    }
  }

  async updateStatusPedidoFornecedor(req: Request, res: Response) {
    const fornecedorId = req.userId;
    const { pedidoId } = req.params;
    const { novoStatus } = req.body;

    if (!fornecedorId) {
      return res.status(401).json({ error: "Fornecedor não autenticado." });
    }
    if (!pedidoId || !novoStatus) {
      return res.status(400).json({ error: "ID do pedido e novo status são obrigatórios." });
    }

    try {
      const pedidoOriginal = await prisma.pedido.findUnique({
        where: { id: parseInt(pedidoId, 10) },
        select: { 
          id: true,
          id_fornecedor: true,
          status: true,
          contatoCliente: true,
          quantidade: true,
          valor_total: true,
          nomeCliente: true,
          prato: { 
            select: { 
              nome: true 
            }
          }
        }
      });

      if (!pedidoOriginal) {
        return res.status(404).json({ error: "Pedido não encontrado." });
      }

      if (pedidoOriginal.id_fornecedor !== Number(fornecedorId)) {
        return res.status(403).json({ error: "Você não tem permissão para atualizar este pedido." });
      }
      
      // Usar a nova lista de transições
      const transicoesPermitidas = validStatusTransitionsFornecedor[pedidoOriginal.status];
      if (!transicoesPermitidas || !transicoesPermitidas.includes(novoStatus)) {
        return res.status(400).json({
          error: `Não é possível mudar o status de ${pedidoOriginal.status} para ${novoStatus}.`
        });
      }

      const pedidoAtualizado = await prisma.pedido.update({
        where: { id: parseInt(pedidoId, 10) },
        data: { status: novoStatus },
        include: {
          prato: { select: { nome: true, preco: true, imagem: true } },
          cliente: { select: { nome: true }}
        }
      });

      // Simulação de envio de mensagem via WhatsApp
      let mensagemWhatsApp = "";
      const nomePrato = pedidoOriginal.prato?.nome || "Prato não especificado";
      const quantidadePedido = pedidoOriginal.quantidade;
      const valorTotalPedido = pedidoOriginal.valor_total?.toFixed(2) || "N/A";
      const nomeClienteOriginal = pedidoOriginal.nomeCliente || "Cliente";

      if (novoStatus === "EM_PREPARO") {
        mensagemWhatsApp = `Olá ${nomeClienteOriginal}! Seu pedido #${pedidoOriginal.id} (${quantidadePedido}x ${nomePrato} - Total: R$${valorTotalPedido}) foi confirmado e está EM PREPARO. Informaremos quando sair para entrega!`;
      } else if (novoStatus === "AGUARDANDO_CLIENTE") {
        mensagemWhatsApp = `Olá ${nomeClienteOriginal}! Seu pedido #${pedidoOriginal.id} (${quantidadePedido}x ${nomePrato} - Total: R$${valorTotalPedido}) está PRONTO PARA RETIRADA. Aguardamos você!`;
      }
      // Adicionar outras mensagens para outros status se necessário, ex: SAIU_PARA_ENTREGA, FINALIZADO (para retirada)
      // Por enquanto, as principais são "EM_PREPARO" e "AGUARDANDO_CLIENTE"

      if (mensagemWhatsApp && pedidoOriginal.contatoCliente) {
        console.log("--------------------------------------------------");
        console.log("SIMULAÇÃO DE ENVIO DE MENSAGEM VIA WHATSAPP:");
        console.log(`Para: ${pedidoOriginal.contatoCliente}`);
        console.log(`Mensagem: ${mensagemWhatsApp}`);
        console.log("// TODO: Implementar integração real com API de WhatsApp aqui.");
        console.log("--------------------------------------------------");
      }

      return res.json(pedidoAtualizado);
    } catch (error: any) {
      console.error("[Controller] Erro ao atualizar status do pedido:", error);
      if (error.code === 'P2025') { // Erro do Prisma para "Record to update not found"
        return res.status(404).json({ error: "Registro do pedido para atualizar não encontrado." });
      }
      return res.status(500).json({ error: "Erro interno ao atualizar status do pedido." });
    }
  }
  
  // Adicionar um método para o cliente criar um pedido (exemplo básico)
  // Este método não simula o WhatsApp, mas permite criar pedidos via API.
  async criarPedido(req: Request, res: Response) {
    const clienteIdAutenticado = req.userId;
    
    const { 
        pratoId, fornecedorId, nomeCliente: nomeClienteReq, contatoCliente: contatoClienteReq, 
        tipoEntrega, enderecoEntrega, observacoes, quantidade: quantidadeReq 
    } = req.body;

    const quantidade = quantidadeReq === undefined ? 1 : Number(quantidadeReq);
    let nomeCliente = nomeClienteReq;
    let contatoCliente = contatoClienteReq;

    if (!pratoId || !fornecedorId || !tipoEntrega) {
        return res.status(400).json({ error: "Prato, Fornecedor e Tipo de Entrega são obrigatórios." });
    }
    
    if (!clienteIdAutenticado && !nomeCliente) { // Se não autenticado, nome do cliente da requisição é obrigatório
        return res.status(400).json({ error: "Nome do cliente é obrigatório para pedidos não autenticados." });
    }
    if (!clienteIdAutenticado && !contatoCliente) { // Se não autenticado, contato do cliente da requisição é obrigatório
        return res.status(400).json({ error: "Contato (WhatsApp) do cliente é obrigatório para pedidos não autenticados." });
    }

    if (tipoEntrega === "ENTREGA" && !enderecoEntrega) {
        return res.status(400).json({ error: "Endereço de entrega é obrigatório para o tipo ENTREGA." });
    }

    try {
        const prato = await prisma.prato.findUnique({ where: { id: Number(pratoId) } });
        if (!prato) {
            return res.status(404).json({ error: "Prato não encontrado." });
        }
        if (prato.fornecedorId !== Number(fornecedorId)) {
            return res.status(400).json({ error: "Este prato não pertence ao fornecedor especificado." });
        }
        if (!prato.disponivel) {
            return res.status(400).json({ error: `O prato '${prato.nome}' não está disponível no momento.` });
        }

        const precoUnitarioSnapshot = prato.preco;
        const valorTotalCalculado = precoUnitarioSnapshot * Number(quantidade);
        
        if (clienteIdAutenticado) {
            const clienteDB = await prisma.cliente.findUnique({where: {id: Number(clienteIdAutenticado)}});
            if (clienteDB) {
                nomeCliente = nomeCliente || clienteDB.nome; // Prioriza nome da req, senão do DB
                if (contatoCliente === undefined && clienteDB.telefone) { // Se contato não veio na req e tem no DB
                    contatoCliente = clienteDB.telefone;
                }
            }
        }
        
        nomeCliente = nomeCliente || "Cliente LeveFit"; // Garante um nome
        contatoCliente = contatoCliente || ""; // Garante que seja string

        const novoPedido = await prisma.pedido.create({
            data: {
                id_cliente: clienteIdAutenticado ? Number(clienteIdAutenticado) : undefined,
                pratoId: Number(pratoId),
                id_fornecedor: Number(fornecedorId),
                nomeCliente: nomeCliente,
                contatoCliente: contatoCliente,
                tipoEntrega,
                enderecoEntrega,
                observacoes,
                quantidade: Number(quantidade),
                preco_unitario_snapshot: precoUnitarioSnapshot,
                valor_total: valorTotalCalculado,
                status: "NOVO",
            },
            include: { 
                prato: { select: { nome: true, preco: true, imagem: true } },
                cliente: { select: { nome: true, email: true } }, 
                fornecedor: { select: { nome: true } }
            }
        });
        return res.status(201).json(novoPedido);
    } catch (error: any) {
        console.error("[Controller] Erro ao criar pedido:", error);
        // Adicionar mais detalhes do erro do Prisma se disponível
        if (error.code) {
             console.error("[Controller] Prisma Error Code:", error.code);
        }
        if (error.meta) {
            console.error("[Controller] Prisma Error Meta:", error.meta);
        }
        return res.status(500).json({ error: "Erro interno ao criar pedido.", details: error.message });
    }
  }

  async getMeusPedidos(req: Request, res: Response) {
    const clienteId = req.userId;
    console.log("[Controller] Buscando pedidos para cliente ID:", clienteId);

    if (!clienteId) {
      console.error("[Controller] ID do cliente não encontrado na requisição em getMeusPedidos.");
      return res.status(401).json({ error: "Cliente não autenticado." });
    }

    try {
      const pedidos = await prisma.pedido.findMany({
        where: { id_cliente: Number(clienteId) },
        include: {
          prato: { select: { nome: true, imagem: true, preco: true } }, 
          fornecedor: { select: { nome: true, logo: true } }
        },
        orderBy: {
          time_do_pedido: 'desc',
        },
      });
      console.log("[Controller] Meus Pedidos encontrados com sucesso:", pedidos.length);
      return res.json(pedidos);
    } catch (error) {
      console.error("[Controller] Erro CRÍTICO ao buscar \"meus pedidos\":", error);
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido.";
      return res.status(500).json({ error: "Erro interno ao buscar seus pedidos.", details: errorMessage });
    }
  }
} 