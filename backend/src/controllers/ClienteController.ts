import { Request, Response } from "express";
import { prisma } from "../server";
import bcrypt from "bcrypt";

export class ClienteController {
  async create(req: Request, res: Response) {
    try {
      const { nome, email, senha, telefone, cep, rua, numero, bairro, cidade, estado } = req.body;

      // Validação de campos obrigatórios
      const camposObrigatorios = { nome, email, senha, telefone, cep, rua, numero, bairro, cidade, estado };
      for (const [campo, valor] of Object.entries(camposObrigatorios)) {
        if (!valor) {
          return res
            .status(400)
            .json({ error: `O campo '${campo}' é obrigatório` });
        }
      }

      const clienteExistente = await prisma.cliente.findUnique({
        where: { email },
      });

      if (clienteExistente) {
        return res.status(400).json({ error: "Este email já está em uso" });
      }

      const hashSenha = await bcrypt.hash(senha, 10);

      const cliente = await prisma.cliente.create({
        data: {
          nome,
          email,
          senha: hashSenha,
          telefone,
          cep,
          rua,
          numero,
          bairro,
          cidade,
          estado,
        },
        // Selecionar campos para retorno, incluindo os novos
        select: {
          id: true,
          nome: true,
          email: true,
          telefone: true,
          cep: true,
          rua: true,
          numero: true,
          bairro: true,
          cidade: true,
          estado: true,
          createdAt: true,
        }
      });

      // Retornar o cliente criado com os campos selecionados
      return res.status(201).json(cliente);

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro interno do servidor ao criar cliente" });
    }
  }

  async getProfile(req: Request, res: Response) {
    try {
      const { userId } = req;

      if (!userId) {
        return res.status(401).json({ error: "Não autorizado" });
      }

      const cliente = await prisma.cliente.findUnique({
        where: { id: userId },
        select: {
          id: true,
          nome: true,
          email: true,
          telefone: true, // Adicionado
          cep: true,      // Adicionado
          rua: true,      // Adicionado
          numero: true,   // Adicionado
          bairro: true,   // Adicionado
          cidade: true,   // Adicionado
          estado: true,   // Adicionado
          // Mantenha 'avaliacoes' se necessário, mas remova 'endereco' antigo se existia
          createdAt: true,
          updatedAt: true,
          avaliacoes: {
            select: {
              id: true,
              nota: true,
              comentario: true,
              prato: {
                select: {
                  id: true,
                  nome: true,
                  fornecedor: {
                    select: {
                      id: true,
                      nome: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!cliente) {
        return res.status(404).json({ error: "Cliente não encontrado" });
      }

      return res.json(cliente);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro interno do servidor ao buscar perfil" });
    }
  }

  async updateProfile(req: Request, res: Response) {
    try {
      const { userId } = req;
      // Incluir todos os novos campos que podem ser atualizados
      const { nome, senha, telefone, cep, rua, numero, bairro, cidade, estado } = req.body;

      if (!userId) {
        return res.status(401).json({ error: "Não autorizado" });
      }

      const clienteExistente = await prisma.cliente.findUnique({
        where: { id: userId },
      });

      if (!clienteExistente) {
        return res.status(404).json({ error: "Cliente não encontrado" });
      }

      const dadosAtualizados: any = {};

      if (nome) dadosAtualizados.nome = nome;
      if (telefone) dadosAtualizados.telefone = telefone;
      if (cep) dadosAtualizados.cep = cep;
      if (rua) dadosAtualizados.rua = rua;
      if (numero) dadosAtualizados.numero = numero;
      if (bairro) dadosAtualizados.bairro = bairro;
      if (cidade) dadosAtualizados.cidade = cidade;
      if (estado) dadosAtualizados.estado = estado;
      
      // Manter lógica de atualização de senha apenas se fornecida
      if (senha) {
        if (typeof senha === 'string' && senha.trim() !== '') {
            dadosAtualizados.senha = await bcrypt.hash(senha, 10);
        } else if (senha !== undefined) { 
            // Se 'senha' foi passada mas está vazia ou não é string, pode ser um erro ou intenção de não alterar.
            // Optando por não atualizar a senha se for string vazia.
            // Se quiser retornar um erro para senha vazia, adicione aqui.
        }
      }


      const clienteAtualizado = await prisma.cliente.update({
        where: { id: userId },
        data: dadosAtualizados,
        select: { // Selecionar todos os campos relevantes para o retorno
          id: true,
          nome: true,
          email: true, 
          telefone: true,
          cep: true,
          rua: true,
          numero: true,
          bairro: true,
          cidade: true,
          estado: true,
          updatedAt: true,
        },
      });

      return res.json(clienteAtualizado);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro interno do servidor ao atualizar perfil" });
    }
  }
}
