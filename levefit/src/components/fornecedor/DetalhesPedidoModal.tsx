import React from 'react';
import { FaTimes, FaUserCircle, FaPhoneAlt, FaMapMarkerAlt, FaRegStickyNote, FaCalendarAlt, FaImage, FaTag, FaClipboardList, FaBoxOpen, FaHashtag, FaDollarSign, FaTruck, FaShoppingBag } from 'react-icons/fa';
import type { Pedido } from '../../types'; // Corrigido para type-only import

interface DetalhesPedidoModalProps {
  isOpen: boolean;
  onClose: () => void;
  pedido: Pedido | null;
}

const DetalhesPedidoModal: React.FC<DetalhesPedidoModalProps> = ({ isOpen, onClose, pedido }) => {
  if (!isOpen || !pedido) return null;

  const formatarDataHora = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const primeiroItem = pedido.itens && pedido.itens.length > 0 ? pedido.itens[0] : null;
  
  const valorTotalCalculadoPelosItens = pedido.itens.reduce((acc, item) => acc + (item.subtotal_item || 0), 0);
  const valorTotalParaExibicao = (pedido.valor_total && pedido.valor_total > 0) ? pedido.valor_total : valorTotalCalculadoPelosItens;

  let enderecoDetalhado = null;
  if (pedido.tipoEntrega === 'ENTREGA' && pedido.enderecoEntrega) {
    // Regex ajustada para tornar o CEP opcional e capturá-lo corretamente se presente no formato (CEP: XXXXX-XXX)
    const regexEndereco = /^Rua (.*?), (\d+[A-Za-z\s\-]*[A-Za-z]?) - (.*?), (.*?) - ([A-Z]{2})(?: \(CEP: ([\d\-]+)\))?$/i;
    const match = pedido.enderecoEntrega.match(regexEndereco);
    if (match) {
      enderecoDetalhado = {
        rua: match[1]?.trim() || '',
        numero: match[2]?.trim() || '',
        bairro: match[3]?.trim() || '',
        cidade: match[4]?.trim() || '',
        estado: match[5]?.toUpperCase() || '',
        cep: match[6]?.trim() || '' // Será string vazia se não houver match para o CEP
      };
    } else {
      // Fallback para tentar extrair pelo menos Rua e Número se a regex completa falhar e houver vírgula
      const partesSimples = pedido.enderecoEntrega.split(',');
      if (partesSimples.length >= 2) {
        enderecoDetalhado = {
            rua: partesSimples[0].replace(/^Rua /i, '').trim(),
            numero: partesSimples[1].trim(),
            bairro: partesSimples.slice(2).join(', ').trim(), // O resto como bairro/complemento
            cidade: '',
            estado: '',
            cep: ''
        }
      }
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-lg w-full overflow-hidden transform transition-all animate-slideUp">
        {/* Cabeçalho do Modal */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <FaClipboardList className="text-xl text-green-500 dark:text-green-400 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Detalhes do Pedido #{pedido.id}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Fechar modal"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Conteúdo do Modal */}
        <div className="p-4 sm:p-6 max-h-[calc(100vh-10rem)] overflow-y-auto space-y-4">
          {/* Cabeçalho simplificado do pedido */}
          <div className="text-center sm:text-left py-1">
            <h4 className="text-xl font-bold text-gray-800 dark:text-white">
              {pedido.itens && pedido.itens.length > 0 ? 
                `${pedido.itens.length} item${pedido.itens.length > 1 ? 's' : ''} no pedido` :
                'Pedido sem itens'
              }
            </h4>
            {/* Removido: Descrição do item principal e valor total desta seção */}
          </div>

          <hr className="dark:border-gray-700" />
          
          {/* Lista de todos os itens do pedido */}
          {pedido.itens && pedido.itens.length > 0 && (
            <div>
              <h5 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                <FaShoppingBag className="mr-2 text-gray-500 dark:text-gray-400"/> Itens do Pedido
              </h5>
              <ul className="space-y-3 pl-1 sm:pl-6">
                {pedido.itens.map((item, index) => (
                  <li key={index} className="flex items-start sm:items-center text-sm text-gray-600 dark:text-gray-300 border-b border-gray-100 dark:border-gray-700 pb-2 mb-2 last:border-b-0 last:pb-0 last:mb-0">
                    {item.prato.imagem ? (
                      <img 
                        src={item.prato.imagem} 
                        alt={item.prato.nome} 
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-md object-cover border border-gray-200 dark:border-gray-600 mr-3 shadow-sm flex-shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-md bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-gray-600 mr-3 shadow-sm flex-shrink-0">
                        <FaImage size={20} />
                      </div>
                    )}
                    <div className="flex-1 min-w-0"> {/* Adicionado min-w-0 para truncamento funcionar se necessário */}
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                        <span className="font-semibold text-gray-800 dark:text-white truncate" title={`${item.quantidade}x ${item.prato.nome}`}>{item.quantidade}x {item.prato.nome}</span>
                        <span className="text-gray-700 dark:text-gray-200 font-medium mt-0.5 sm:mt-0">R$ {(item.subtotal_item ?? 0).toFixed(2).replace('.', ',')}</span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        (Preço und.: R$ {(item.preco_unitario_no_momento_do_pedido ?? 0).toFixed(2).replace('.', ',')})
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              {/* Valor Total do Pedido - Movido para cá */}
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 text-right">
                <p className="text-lg font-bold text-gray-800 dark:text-white">
                  Valor Total: <span className="text-green-600 dark:text-green-400">R$ {valorTotalParaExibicao.toFixed(2).replace('.', ',')}</span>
                </p>
              </div>
            </div>
          )}
          
          <hr className="dark:border-gray-700" />

          {/* Detalhes do Cliente */}
          <div>
            <h5 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
              <FaUserCircle className="mr-2 text-gray-500 dark:text-gray-400"/> Cliente
            </h5>
            <div className="text-sm space-y-1 pl-6">
              <p className="text-gray-600 dark:text-gray-300"><span className="font-medium">Nome:</span> {pedido.nomeCliente}</p>
              {pedido.contatoCliente && (
                <p className="text-gray-600 dark:text-gray-300"><span className="font-medium">Contato:</span> {pedido.contatoCliente}</p>
              )}
            </div>
          </div>

          {/* Detalhes da Entrega/Retirada */}
          <div>
            <h5 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
              {pedido.tipoEntrega === 'ENTREGA' ? <FaTruck className="mr-2 text-gray-500 dark:text-gray-400"/> : <FaShoppingBag className="mr-2 text-gray-500 dark:text-gray-400"/>} 
              {pedido.tipoEntrega === 'ENTREGA' ? 'Detalhes da Entrega' : 'Detalhes da Retirada'}
            </h5>
            <div className="text-sm space-y-1 pl-6">
              <p className="text-gray-600 dark:text-gray-300"><span className="font-medium">Tipo:</span> <span className={pedido.tipoEntrega === 'ENTREGA' ? 'text-orange-500' : 'text-purple-500'}>{pedido.tipoEntrega}</span></p>
              {pedido.tipoEntrega === 'ENTREGA' && pedido.enderecoEntrega && (
                <>
                  {enderecoDetalhado && enderecoDetalhado.rua ? (
                    <>
                      <p className="text-gray-600 dark:text-gray-300 flex items-start">
                        <FaMapMarkerAlt className="mr-1.5 mt-0.5 text-gray-400 dark:text-gray-500 flex-shrink-0" /> 
                        <div><span className="font-medium mr-1">Rua:</span> <span className="break-all">{enderecoDetalhado.rua}</span></div>
                      </p>
                      <p className="text-gray-600 dark:text-gray-300 ml-5"><span className="font-medium mr-1">Número:</span> {enderecoDetalhado.numero}</p>
                      <p className="text-gray-600 dark:text-gray-300 ml-5"><span className="font-medium mr-1">Bairro:</span> {enderecoDetalhado.bairro}</p>
                      <p className="text-gray-600 dark:text-gray-300 ml-5"><span className="font-medium mr-1">Cidade:</span> {enderecoDetalhado.cidade}</p>
                      {enderecoDetalhado.estado && <p className="text-gray-600 dark:text-gray-300 ml-5"><span className="font-medium mr-1">Estado:</span> {enderecoDetalhado.estado}</p>}
                      {enderecoDetalhado.cep && <p className="text-gray-600 dark:text-gray-300 ml-5"><span className="font-medium mr-1">CEP:</span> {enderecoDetalhado.cep}</p>}
                    </>
                  ) : (
                    <p className="text-gray-600 dark:text-gray-300 flex items-start">
                      <FaMapMarkerAlt className="mr-1.5 mt-0.5 text-gray-400 dark:text-gray-500 flex-shrink-0" /> 
                      <div><span className="font-medium mr-1">Endereço:</span> <span className="break-all">{pedido.enderecoEntrega}</span></div>
                    </p>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Observações */}
          {pedido.observacoes && (
            <div>
              <h5 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                <FaRegStickyNote className="mr-2 text-gray-500 dark:text-gray-400"/> Observações
              </h5>
              <p className="text-sm text-gray-600 dark:text-gray-300 italic pl-6">{pedido.observacoes}</p>
            </div>
          )}

          {/* Informações Adicionais do Pedido */}
           <div>
            <h5 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                <FaBoxOpen className="mr-2 text-gray-500 dark:text-gray-400"/> Status e Data
            </h5>
            <div className="text-sm space-y-1 pl-6">
                <p className="text-gray-600 dark:text-gray-300"><span className="font-medium">Status Atual:</span> <span className="font-semibold">{pedido.status.replace('_', ' ')}</span></p>
                <p className="text-gray-600 dark:text-gray-300"><span className="font-medium">Data do Pedido:</span> {formatarDataHora(pedido.time_do_pedido)}</p>
            </div>
          </div>

        </div>

        {/* Rodapé do Modal (Botão de Fechar) */}
        <div className="p-4 sm:p-5 border-t border-gray-200 dark:border-gray-700 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-sm transition-colors text-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetalhesPedidoModal; 