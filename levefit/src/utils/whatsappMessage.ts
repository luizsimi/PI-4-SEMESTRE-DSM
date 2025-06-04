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
  tipoEntrega: "ENTREGA" | "RETIRADA";
}

/**
 * Abre um link do WhatsApp de maneira segura, com fallback para a versão web
 * @param phoneNumber Número de telefone (com ou sem formatação)
 * @param message Mensagem já codificada com encodeURIComponent
 */
export const openWhatsAppLink = (phoneNumber: string, message: string) => {
  const cleanPhoneNumber = phoneNumber.replace(/\D/g, "");

  try {
    // Verifica se estamos em ambiente web ou mobile
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    // Em dispositivos móveis, é mais provável que o WhatsApp esteja instalado
    if (isMobile) {
      // Tenta abrir no app primeiro
      const whatsappAppLink = `whatsapp://send?phone=55${cleanPhoneNumber}&text=${message}`;

      // Abrindo em uma nova aba para evitar erros de navegação
      const appWindow = window.open(whatsappAppLink, "_blank");

      // Se falhar ao abrir o app, tenta abrir na versão web após um pequeno delay
      setTimeout(() => {
        if (!appWindow || appWindow.closed || appWindow.closed === undefined) {
          window.open(
            `https://api.whatsapp.com/send?phone=55${cleanPhoneNumber}&text=${message}`,
            "_blank"
          );
        }
      }, 300);
    } else {
      // Em desktops, é mais seguro ir direto para a versão web
      window.open(
        `https://api.whatsapp.com/send?phone=55${cleanPhoneNumber}&text=${message}`,
        "_blank"
      );
    }
  } catch (error) {
    console.error("Erro ao abrir o WhatsApp:", error);
    // Fallback garantido: sempre abre a versão web do WhatsApp em caso de erro
    window.open(
      `https://api.whatsapp.com/send?phone=55${cleanPhoneNumber}&text=${message}`,
      "_blank"
    );
  }
};

export const gerarMensagemWhatsApp = (pedido: Pedido): string => {
  const horaAtual = new Date().getHours();
  let saudacao = "Boa noite";

  if (horaAtual >= 6 && horaAtual < 12) {
    saudacao = "Bom dia";
  } else if (horaAtual >= 12 && horaAtual < 18) {
    saudacao = "Boa tarde";
  }

  // Formata cada item em uma linha separada
  const itensPedido = pedido.itens
    .map(
      (item) =>
        `${item.quantidade}x ${item.prato.nome} - R$ ${(
          item.prato.preco * item.quantidade
        )
          .toFixed(2)
          .replace(".", ",")}`
    )
    .join("\n");

  const enderecoOuRetirada =
    pedido.tipoEntrega === "ENTREGA"
      ? `*Endereço de entrega:*\n${pedido.enderecoEntrega}`
      : "*Pedido para retirada no local*";

  const mensagem = `${saudacao}, ${pedido.nomeCliente}!

Seu pedido #${pedido.id} foi *CONFIRMADO* e já está sendo preparado!

*ITENS DO PEDIDO:*
${itensPedido}

*Valor Total: R$ ${pedido.valor_total_pedido.toFixed(2).replace(".", ",")}*

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
  const numeroFormatado = telefone.replace(/\D/g, "");

  // Usa a função comum para abrir o WhatsApp
  openWhatsAppLink(numeroFormatado, mensagem);
};
