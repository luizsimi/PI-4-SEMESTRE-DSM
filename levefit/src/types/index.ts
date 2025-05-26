export interface Prato {
  id: number;
  nome: string;
  descricao?: string;
  preco: number;
  categoria?: string;
  disponivel?: boolean;
  fornecedorId?: number;
  imagem?: string; // Já existente
}

export interface Pedido {
  id: number;
  id_cliente?: number | null; // Permitir nulo se o cliente não estiver logado
  id_fornecedor: number;
  pratoId: number;
  quantidade: number;
  valor_unitario_snapshot: number;
  valor_total: number;
  status: string; // Ex: NOVO, EM_PREPARO, AGUARDANDO_CLIENTE, FINALIZADO, RECUSADO, CANCELADO_FORNECEDOR
  tipoEntrega: 'ENTREGA' | 'RETIRADA';
  nomeCliente: string;
  contatoCliente?: string | null;
  enderecoEntrega?: string | null;
  observacoes?: string | null;
  time_do_pedido: string; // ISO Date String
  updatedAt: string; // ISO Date String
  prato: {
    id: number;
    nome: string;
    imagem?: string | null;
    // Outros campos do prato que você possa querer mostrar, ex: preco original do prato
  };
  // Se houver mais informações do cliente que você queira trazer, pode adicionar um objeto cliente
  // cliente?: {
  //   nome: string;
  //   telefone: string;
  //   // ... outros dados do cliente
  // } | null;
}

// Outras interfaces que possam ser globais, como a de Fornecedor, Cliente, etc.
// podem ser adicionadas aqui no futuro. 