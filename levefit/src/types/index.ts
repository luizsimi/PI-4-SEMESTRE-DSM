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

export interface ItemDoPedido {
  quantidade: number;
  preco_unitario_no_momento_do_pedido: number; // Preço do prato no momento do pedido
  subtotal_item: number; // quantidade * preco_unitario_no_momento_do_pedido
  prato: {
    id: number;
    nome: string;
    imagem?: string | null;
    // Você pode adicionar mais detalhes do prato aqui se precisar
    // Por exemplo, o preço atual do prato, se for útil para alguma lógica
    // preco_atual?: number; 
  };
  // pratoId: number; // Se você ainda quiser manter o ID do prato aqui por alguma razão, mas geralmente já está em prato.id
}

export interface Pedido {
  id: number;
  id_cliente?: number | null; // Permitir nulo se o cliente não estiver logado
  id_fornecedor: number;
  // pratoId: number; // Removido
  // quantidade: number; // Removido - agora está em cada item
  valor_unitario_snapshot: number; // Este campo pode ser reavaliado. Se o pedido tem itens, o valor_total já deve ser a soma dos subtotais.
  valor_total: number; // Este deve ser o valor total do pedido (soma dos subtotal_item de todos os itens)
  status: string; // Ex: NOVO, EM_PREPARO, AGUARDANDO_CLIENTE, FINALIZADO, RECUSADO, CANCELADO_FORNECEDOR
  tipoEntrega: 'ENTREGA' | 'RETIRADA';
  nomeCliente: string;
  contatoCliente?: string | null;
  enderecoEntrega?: string | null;
  observacoes?: string | null;
  time_do_pedido: string; // ISO Date String
  updatedAt: string; // ISO Date String
  // prato: { // Removido
  //   id: number;
  //   nome: string;
  //   imagem?: string | null;
  //   // Outros campos do prato que você possa querer mostrar, ex: preco original do prato
  // };
  itens: ItemDoPedido[]; // Adicionado para suportar múltiplos itens
  // Se houver mais informações do cliente que você queira trazer, pode adicionar um objeto cliente
  // cliente?: {
  //   nome: string;
  //   telefone: string;
  //   // ... outros dados do cliente
  // } | null;
}

// Outras interfaces que possam ser globais, como a de Fornecedor, Cliente, etc.
// podem ser adicionadas aqui no futuro. 