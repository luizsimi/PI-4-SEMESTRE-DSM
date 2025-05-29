import { Request, Response } from 'express';
import { prisma } from "../server";
const { toZonedTime } = require('date-fns-tz');

// Definição de tipos para maior clareza, se necessário (opcional)
// interface UserDataToken {
//   id: number;
//   // outros campos do token se houver
// }

// Estendendo a interface Request do Express para incluir userId e userType
// declare global {
//   namespace Express {
//     interface Request {
//       userId?: number;
//       userType?: 'cliente' | 'fornecedor' | 'admin';
//     }
//   }
// }

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
    const dataFiltro = req.query.data as string; // Exemplo: "2025-05-29"
  
    console.log("[Controller] Buscando pedidos para fornecedor ID:", fornecedorId, "com filtro de data:", dataFiltro);
  
    if (!fornecedorId) {
      return res.status(401).json({ error: "Fornecedor não autenticado." });
    }
  
    try {
      const whereClause: any = {
        id_fornecedor: Number(fornecedorId),
      };
  
      // ✅ Aqui aplica o filtro por data (baseado em milissegundos)
      if (dataFiltro) {
        const startOfDay = new Date(`${dataFiltro}T00:00:00-03:00`).getTime();
        const endOfDay = new Date(`${dataFiltro}T23:59:59-03:00`).getTime();
  
        whereClause.time_do_pedido = {
          gte: startOfDay,
          lte: endOfDay,
        };
      }
  
      const pedidos = await prisma.pedido.findMany({
        where: whereClause,
        include: {
          itens: {
            include: {
              prato: {
                select: { nome: true, preco: true, imagem: true }
              }
            }
          },
          cliente: {
            select: { nome: true }
          }
        },
        orderBy: {
          time_do_pedido: 'desc',
        },
      });
  
      return res.json(pedidos);
    } catch (error) {
      console.error("[Controller] Erro ao buscar pedidos do fornecedor:", error);
      return res.status(500).json({ error: "Erro ao buscar pedidos." });
    }
  }
  

  async updateStatusPedidoFornecedor(req: Request, res: Response) {
    const fornecedorIdAutenticado = req.userId;
    const { pedidoId } = req.params;
    const { novoStatus } = req.body;

    if (!fornecedorIdAutenticado) {
      return res.status(401).json({ error: "Fornecedor não autenticado." });
    }
    if (!pedidoId || !novoStatus) {
      return res.status(400).json({ error: "ID do pedido e novo status são obrigatórios." });
    }

    try {
      const pedidoOriginal = await prisma.pedido.findUnique({
        where: { id: parseInt(pedidoId, 10) },
        include: {
          itens: {
            include: {
              prato: { select: { nome: true } }
            }
          },
          cliente: { select: { nome: true, telefone: true } }
        }
      });

      if (!pedidoOriginal) {
        return res.status(404).json({ error: "Pedido não encontrado." });
      }

      if (pedidoOriginal.id_fornecedor !== Number(fornecedorIdAutenticado)) {
        return res.status(403).json({ error: "Você não tem permissão para atualizar este pedido." });
      }
      
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
          itens: {
            include: {
              prato: { select: { nome: true, preco: true, imagem: true } }
            }
          },
          cliente: { select: { nome: true } }
        }
      });

      // Lógica de Notificação WhatsApp (ajustada para múltiplos itens)
      let mensagemWhatsApp = "";
      const nomeClienteOriginal = pedidoOriginal.cliente?.nome || pedidoOriginal.nomeCliente || "Cliente";
      const contatoClienteOriginal = pedidoOriginal.cliente?.telefone || pedidoOriginal.contatoCliente;
      const valorTotalPedido = pedidoOriginal.valor_total_pedido?.toFixed(2) || "N/A";
      
      // Para a mensagem, podemos listar alguns pratos ou ser genérico
      const nomesPratos = pedidoOriginal.itens.map(item => `${item.quantidade}x ${item.prato.nome}`).join(', ');

      if (novoStatus === "EM_PREPARO") {
        mensagemWhatsApp = `Olá ${nomeClienteOriginal}! Seu pedido #${pedidoOriginal.id} (${nomesPratos} - Total: R$${valorTotalPedido}) foi confirmado e está EM PREPARO. Informaremos quando sair para entrega!`;
      } else if (novoStatus === "AGUARDANDO_CLIENTE") {
        // Este status pode precisar de mais contexto, ex: se é para retirada ou se é uma atualização de entrega.
        // Assumindo que é para retirada, se não, a mensagem deve ser diferente.
        mensagemWhatsApp = `Olá ${nomeClienteOriginal}! Seu pedido #${pedidoOriginal.id} (${nomesPratos} - Total: R$${valorTotalPedido}) está PRONTO PARA RETIRADA. Aguardamos você!`;
      }
      // Adicionar outras mensagens conforme necessário
      if (mensagemWhatsApp && contatoClienteOriginal) {
        const telefoneLimpo = contatoClienteOriginal.replace(/\D/g, '');
        const mensagemCodificada = encodeURIComponent(mensagemWhatsApp);
        const urlWhatsApp = `https://wa.me/55${telefoneLimpo}?text=${mensagemCodificada}`;
      
        console.log("--------------------------------------------------");
        console.log("ABRIR WHATSAPP:");
        console.log("URL:", urlWhatsApp);
        console.log("--------------------------------------------------");
      }
      return res.json(pedidoAtualizado);
    } catch (error: any) {
      console.error("[Controller] Erro ao atualizar status do pedido:", error);
      if (error.code === 'P2025') {
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
        fornecedorId,
        nomeCliente: nomeClienteReq,
        contatoCliente: contatoClienteReq,
        tipoEntrega,
        enderecoEntrega,
        observacoes,
        pratos,
    } = req.body;

    if (!fornecedorId || !tipoEntrega) {
        return res.status(400).json({ error: "ID do Fornecedor e Tipo de Entrega são obrigatórios." });
    }
    if (!pratos || !Array.isArray(pratos) || pratos.length === 0) {
        return res.status(400).json({ error: "A lista de pratos não pode estar vazia." });
    }
    if (!pratos.every(p => p.pratoId && typeof p.quantidade === 'number' && p.quantidade > 0)) {
        return res.status(400).json({ error: "Cada prato na lista deve ter pratoId e quantidade válida (maior que 0)." });
    }

    let nomeClienteFinal = nomeClienteReq;
    let contatoClienteFinal = contatoClienteReq;

    try {
        if (clienteIdAutenticado) {
            const clienteDB = await prisma.cliente.findUnique({ where: { id: Number(clienteIdAutenticado) } });
            if (clienteDB) {
                nomeClienteFinal = nomeClienteFinal || clienteDB.nome;
                contatoClienteFinal = contatoClienteFinal || clienteDB.telefone;
            } else {
                console.warn(`[criarPedido] Cliente ID ${clienteIdAutenticado} do token não encontrado no banco.`);
            }
        }

        if (!nomeClienteFinal) {
            return res.status(400).json({ error: "Nome do cliente é obrigatório." });
        }
        // Contato do cliente pode ser opcional se já estiver no cadastro do cliente autenticado
        // if (!contatoClienteFinal && !clienteIdAutenticado) { // Exigir apenas se não autenticado E não fornecido
        //     return res.status(400).json({ error: "Contato (WhatsApp) do cliente é obrigatório." });
        // }

        if (tipoEntrega === "ENTREGA" && !enderecoEntrega) {
            return res.status(400).json({ error: "Endereço de entrega é obrigatório para o tipo ENTREGA." });
        }

        const dataPedido = toZonedTime(new Date(), 'America/Sao_Paulo');
        const resultadoPedido = await prisma.$transaction(async (tx) => {
            let valorTotalCalculadoPedido = 0;

            const novoPedidoPrincipal = await tx.pedido.create({
                data: {
                    cliente: clienteIdAutenticado ? { connect: { id: Number(clienteIdAutenticado) } } : undefined,
                    fornecedor: { connect: { id: Number(fornecedorId) } },
                    nomeCliente: nomeClienteFinal,
                    contatoCliente: contatoClienteFinal,
                    tipoEntrega,
                    enderecoEntrega: tipoEntrega === "ENTREGA" ? enderecoEntrega : null,
                    observacoes,
                    status: "NOVO",
                    valor_total_pedido: 0,
                    time_do_pedido: dataPedido,
                },
            });

            const itensPedidoCriados = [];
            for (const item of pratos) {
                const pratoDB = await tx.prato.findUnique({ where: { id: Number(item.pratoId) } });

                if (!pratoDB) {
                    throw new Error(`Prato com ID ${item.pratoId} não encontrado.`);
                }
                if (pratoDB.fornecedorId !== Number(fornecedorId)) {
                    throw new Error(`Prato '${pratoDB.nome}' (ID ${item.pratoId}) não pertence ao fornecedor ID ${fornecedorId}.`);
                }
                if (!pratoDB.disponivel) {
                    throw new Error(`O prato '${pratoDB.nome}' (ID ${item.pratoId}) não está disponível no momento.`);
                }

                const precoUnitarioSnapshot = pratoDB.preco;
                const subtotalItem = precoUnitarioSnapshot * Number(item.quantidade);
                valorTotalCalculadoPedido += subtotalItem;

                const novoItemPedido = await tx.itemPedido.create({
                    data: {
                        pedido: { connect: { id: novoPedidoPrincipal.id } },
                        prato: { connect: { id: Number(item.pratoId) } },
                        quantidade: Number(item.quantidade),
                        preco_unitario_no_momento_do_pedido: precoUnitarioSnapshot,
                        subtotal_item: subtotalItem,
                    },
                });
                itensPedidoCriados.push(novoItemPedido); // Embora não usado diretamente, pode ser útil para logs
            }

            const pedidoFinalAtualizado = await tx.pedido.update({
                where: { id: novoPedidoPrincipal.id },
                data: { valor_total_pedido: valorTotalCalculadoPedido },
                include: {
                    itens: {
                        include: {
                            prato: { select: { nome: true, imagem: true, preco: true } }
                        }
                    },
                    cliente: { select: { nome: true, email: true } }, 
                    fornecedor: { select: { nome: true } }
                }
            });
            return pedidoFinalAtualizado;
        });

        console.log("[Controller] Pedido consolidado criado com sucesso:", resultadoPedido.id);
        return res.status(201).json(resultadoPedido);

    } catch (error: any) {
        console.error("[Controller] Erro CRÍTICO ao criar pedido consolidado:", error);
        if (typeof error.message === 'string' && (error.message.includes("não encontrado") || error.message.includes("não pertence") || error.message.includes("não está disponível"))) {
            return res.status(400).json({ error: error.message });
        }
        let errorMessage = "Erro desconhecido ao processar sua solicitação.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return res.status(500).json({ 
            error: "Erro interno ao criar pedido.", 
            details: errorMessage 
        });
    }
  }

  async getMeusPedidos(req: Request, res: Response) {
    const clienteId = req.userId;
    console.log("[Controller] Buscando pedidos para cliente ID:", clienteId);

    if (!clienteId) {
      console.error("[Controller] ID do cliente não encontrado na requisição.");
      return res.status(401).json({ error: "Cliente não autenticado." });
    }

    try {
      const pedidos = await prisma.pedido.findMany({
        where: { id_cliente: Number(clienteId) },
        include: {
          itens: {
            include: {
              prato: {
                select: { nome: true, preco: true, imagem: true }
              }
            }
          },
          fornecedor: {
            select: { nome: true, logo: true }
          }
        },
        orderBy: {
          time_do_pedido: 'desc',
        },
      });
      console.log("[Controller] Meus Pedidos encontrados:", pedidos.length);
      return res.json(pedidos);
    } catch (error) {
      console.error("[Controller] Erro ao buscar os pedidos do cliente:", error);
      // ... (tratamento de erro pode ser aprimorado)
      return res.status(500).json({ error: "Erro interno ao buscar seus pedidos." });
    }
  }
} 