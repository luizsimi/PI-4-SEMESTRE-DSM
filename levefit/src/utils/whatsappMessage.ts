interface PedidoItem {
  prato: {
    nome: string;
    preco: number;
  };
  quantidade: number;
}

interface Pedido {
  id: number;
  nomeCliente: string;
  itens: PedidoItem[];
  valor_total_pedido: number;
  enderecoEntrega?: string;
  tipoEntrega: 'ENTREGA' | 'RETIRADA';
}

export const gerarMensagemWhatsApp = (pedido: Pedido): string => {
  const horaAtual = new Date().getHours();
  let saudacao = 'Boa noite';
  
  if (horaAtual >= 6 && horaAtual < 12) {
    saudacao = 'Bom dia';
  } else if (horaAtual >= 12 && horaAtual < 18) {
    saudacao = 'Boa tarde';
  }

  // Formata cada item em uma linha separada
  const itensPedido = pedido.itens
    .map(item => `${item.quantidade}x ${item.prato.nome} - R$ ${(item.prato.preco * item.quantidade).toFixed(2).replace('.', ',')}`)
    .join('\n');

  const enderecoOuRetirada = pedido.tipoEntrega === "ENTREGA" 
    ? `*Endereço de entrega:*\n${pedido.enderecoEntrega}` 
    : '*Pedido para retirada no local*';

  const mensagem = `${saudacao}, ${pedido.nomeCliente}!

Seu pedido #${pedido.id} foi *CONFIRMADO* e já está sendo preparado!

*ITENS DO PEDIDO:*
${itensPedido}

*Valor Total: R$ ${pedido.valor_total_pedido.toFixed(2).replace('.', ',')}*

${enderecoOuRetirada}

*Formas de Pagamento Disponíveis:*
- Cartão de Crédito/Débito
- Dinheiro
- PIX

Por favor, nos informe sua forma de pagamento preferida.

Agradecemos a preferência!
Qualquer dúvida estamos à disposição.`;

  // Primeiro faz o encode da mensagem inteira
  return encodeURIComponent(mensagem);
};

export const enviarMensagemWhatsApp = (telefone: string, pedido: Pedido) => {
  const mensagem = gerarMensagemWhatsApp(pedido);
  const numeroFormatado = telefone.replace(/\D/g, '');
  
  // Tenta abrir no app primeiro
  window.location.href = `whatsapp://send?phone=55${numeroFormatado}&text=${mensagem}`;
  
  // Fallback para web
  setTimeout(() => {
    window.open(`https://api.whatsapp.com/send?phone=55${numeroFormatado}&text=${mensagem}`, '_blank');
  }, 500);
}; 