import React, { useState } from 'react';
// Importar IconType como um tipo
import type { IconType } from 'react-icons';
import { FaBoxOpen, FaShippingFast, FaTasks, FaCheckDouble, FaBan, FaRedo, FaInfoCircle, FaUserCircle, FaPhoneAlt, FaMapMarkerAlt, FaRegStickyNote, FaShoppingBag, FaSpinner, FaExclamationTriangle, FaPencilAlt } from 'react-icons/fa';
// Importar a interface Pedido do local correto (assumindo que foi movida para src/types)
import type { Pedido } from '../../types'; // Corrigido para type-only import de src/types/index.ts
import DetalhesPedidoModal from './DetalhesPedidoModal'; // Importar o novo modal

interface PedidosKanbanProps {
  pedidosAgrupados: Record<string, Pedido[]>;
  loading: boolean;
  error: string | null;
  onMudarStatus: (pedidoId: number, novoStatus: string) => void;
}

const statusColunas: { titulo: string; statusBackend: string[]; icone: IconType; corIcone: string }[] = [
  { titulo: 'Novos Pedidos', statusBackend: ['NOVO'], icone: FaBoxOpen, corIcone: 'text-blue-500' },
  { titulo: 'Em Preparo', statusBackend: ['EM_PREPARO'], icone: FaTasks, corIcone: 'text-yellow-500' }, // Para pedidos de ENTREGA
  { titulo: 'Aguardando Cliente', statusBackend: ['AGUARDANDO_CLIENTE'], icone: FaShoppingBag, corIcone: 'text-purple-500' }, // Para pedidos de RETIRADA
  { titulo: 'Finalizados', statusBackend: ['FINALIZADO'], icone: FaCheckDouble, corIcone: 'text-green-500' },
  { titulo: 'Recusados / Cancelados', statusBackend: ['RECUSADO', 'CANCELADO_FORNECEDOR'], icone: FaBan, corIcone: 'text-red-500' },
];

// Ações base para os botões principais (não para o dropdown de edição)
const acoesBase: {
  statusOrigem: string;
  novoStatus: string;
  label: string;
  icone: IconType;
  className: string;
  tipoEntrega?: 'ENTREGA' | 'RETIRADA'; // Para condicionar a ação
}[] = [
  // Ações para status NOVO
  { statusOrigem: 'NOVO', novoStatus: 'EM_PREPARO', label: 'Aceitar (Entrega)', icone: FaTasks, className: 'bg-green-500 hover:bg-green-600', tipoEntrega: 'ENTREGA' },
  { statusOrigem: 'NOVO', novoStatus: 'EM_PREPARO', label: 'Aceitar e Preparar (Retirada)', icone: FaTasks, className: 'bg-green-500 hover:bg-green-600', tipoEntrega: 'RETIRADA' },
  { statusOrigem: 'NOVO', novoStatus: 'RECUSADO', label: 'Recusar Pedido', icone: FaBan, className: 'bg-red-500 hover:bg-red-600' },

  // Ações para status EM_PREPARO
  // Para ENTREGA
  { statusOrigem: 'EM_PREPARO', novoStatus: 'FINALIZADO', label: 'Saiu para Entrega', icone: FaShippingFast, className: 'bg-purple-500 hover:bg-purple-600', tipoEntrega: 'ENTREGA' },
  { statusOrigem: 'EM_PREPARO', novoStatus: 'CANCELADO_FORNECEDOR', label: 'Cancelar Pedido', icone: FaBan, className: 'bg-gray-500 hover:bg-gray-600', tipoEntrega: 'ENTREGA' },
  // Para RETIRADA
  { statusOrigem: 'EM_PREPARO', novoStatus: 'AGUARDANDO_CLIENTE', label: 'Pronto para Retirada', icone: FaShoppingBag, className: 'bg-blue-500 hover:bg-blue-600', tipoEntrega: 'RETIRADA' },
  { statusOrigem: 'EM_PREPARO', novoStatus: 'CANCELADO_FORNECEDOR', label: 'Cancelar Pedido', icone: FaBan, className: 'bg-gray-500 hover:bg-gray-600', tipoEntrega: 'RETIRADA' },

  // Ações para status AGUARDANDO_CLIENTE (apenas para RETIRADA)
  { statusOrigem: 'AGUARDANDO_CLIENTE', novoStatus: 'FINALIZADO', label: 'Cliente Retirou', icone: FaCheckDouble, className: 'bg-green-500 hover:bg-green-600', tipoEntrega: 'RETIRADA' },
  { statusOrigem: 'AGUARDANDO_CLIENTE', novoStatus: 'CANCELADO_FORNECEDOR', label: 'Cancelar Pedido', icone: FaBan, className: 'bg-gray-500 hover:bg-gray-600', tipoEntrega: 'RETIRADA' },
];

const RenderPedidosKanban: React.FC<PedidosKanbanProps> = ({ pedidosAgrupados, loading, error, onMudarStatus }) => {
  const [editingPedidoId, setEditingPedidoId] = useState<number | null>(null);
  const [pedidoSelecionadoModal, setPedidoSelecionadoModal] = useState<Pedido | null>(null); // Novo estado

  const toggleEditDropdown = (pedidoId: number, event: React.MouseEvent) => {
    event.stopPropagation(); // Impedir que o clique no ícone abra o modal de detalhes
    setEditingPedidoId(prevId => (prevId === pedidoId ? null : pedidoId));
  };

  const handleSelectNewStatus = (pedidoId: number, novoStatus: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Impedir que o clique na opção do dropdown abra o modal de detalhes
    onMudarStatus(pedidoId, novoStatus);
    setEditingPedidoId(null);
  };

  const handleAbrirDetalhesModal = (pedido: Pedido) => {
    setPedidoSelecionadoModal(pedido);
  };

  const handleFecharDetalhesModal = () => {
    setPedidoSelecionadoModal(null);
  };

  if (loading) {
    return <div className="text-center py-10"><FaSpinner className="animate-spin text-3xl text-green-500 mx-auto" /><p className="mt-2 text-gray-600 dark:text-gray-400">Carregando pedidos...</p></div>;
  }
  if (error) {
    return <div className="text-center py-10 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-4 rounded-md"><FaExclamationTriangle className="text-3xl mx-auto mb-2" />{error}</div>;
  }

  // Garante que todas as colunas definidas em statusColunas existam em pedidosAgrupados
  const colunasCompletas: Record<string, Pedido[]> = {};
  statusColunas.forEach(col => {
    let pedidosParaEstaColuna: Pedido[] = [];
    col.statusBackend.forEach(sb => {
      pedidosParaEstaColuna = [...pedidosParaEstaColuna, ...(pedidosAgrupados[sb] || [])];
    });
    colunasCompletas[col.titulo] = pedidosParaEstaColuna;
     // Garante que a coluna exista mesmo vazia para manter a ordem
    if (!colunasCompletas[col.titulo]) {
        colunasCompletas[col.titulo] = [];
    }
  });

  const totalPedidos = Object.values(colunasCompletas).reduce((sum, arr) => sum + arr.length, 0);
  if (totalPedidos === 0 && !loading) {
    return (
      <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-lg shadow">
        <FaBoxOpen className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-6" />
        <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-2">Nenhum Pedido por Enquanto</h3>
        <p className="text-gray-500 dark:text-gray-400">Quando novos pedidos chegarem, eles aparecerão aqui.</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 overflow-x-auto pb-4 animate-fadeIn">
        {statusColunas.map((coluna) => {
          const pedidosDaColuna = colunasCompletas[coluna.titulo] || [];
          const IconeColuna = coluna.icone;
          return (
            <div key={coluna.titulo} className="bg-gray-100 dark:bg-gray-800/50 p-3 rounded-lg shadow-md min-w-[300px] md:min-w-[320px] flex-shrink-0">
              <h3 className={`text-lg font-semibold mb-3 pb-2 border-b-2 border-gray-200 dark:border-gray-700 flex items-center ${coluna.corIcone}`}>
                <IconeColuna className="mr-2" />
                {coluna.titulo} ({pedidosDaColuna.length})
              </h3>
              <div className="space-y-3 max-h-[calc(100vh-20rem)] overflow-y-auto pr-1"> {/* Scroll para pedidos dentro da coluna */}
                {pedidosDaColuna.length === 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic p-2 text-center">Nenhum pedido nesta etapa.</p>
                )}
                {pedidosDaColuna.map((pedido) => (
                  <div 
                    key={pedido.id} 
                    className="bg-white dark:bg-gray-700 p-3.5 rounded-lg shadow-sm hover:shadow-lg transition-shadow border-l-4 border-transparent group cursor-pointer hover:border-green-500 flex flex-col justify-between min-h-[240px] h-auto md:min-h-[260px]"
                    onClick={() => handleAbrirDetalhesModal(pedido)}
                  >
                    <div> {/* Container para conteúdo principal do card */}
                      {/* Header do Card */}
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-800 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors truncate" title={pedido.prato.nome}>{pedido.prato.nome} (x{pedido.quantidade})</h4>
                        <div className="flex items-center">
                          <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">#{pedido.id}</span>
                          <div className="relative z-20"> {/* Container para dropdown, z-index maior */}
                            <button
                              onClick={(e) => toggleEditDropdown(pedido.id, e)}
                              className="text-yellow-500 hover:text-yellow-600 p-1"
                              title="Editar status do pedido"
                            >
                              <FaPencilAlt />
                            </button>
                            {editingPedidoId === pedido.id && (
                              <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none py-1 z-30">
                                {['NOVO', 'EM_PREPARO', 'AGUARDANDO_CLIENTE', 'FINALIZADO', 'RECUSADO', 'CANCELADO_FORNECEDOR'].map(statusOption => (
                                  <button
                                    key={statusOption}
                                    onClick={(e) => handleSelectNewStatus(pedido.id, statusOption, e)}
                                    disabled={pedido.status === statusOption}
                                    className={`block w-full text-left px-4 py-2 text-sm 
                                              ${
                                                pedido.status === statusOption 
                                                  ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed' 
                                                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                                              }`}
                                  >
                                    {statusOption.replace('_', ' ')}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Detalhes do Cliente e Pedido */}
                      <div className="text-xs text-gray-600 dark:text-gray-300 space-y-1 mb-3">
                        <p className="flex items-center"><FaUserCircle className="mr-1.5 text-gray-400 dark:text-gray-500" /> {pedido.nomeCliente}</p>
                        {pedido.contatoCliente && <p className="flex items-center"><FaPhoneAlt className="mr-1.5 text-gray-400 dark:text-gray-500" /> {pedido.contatoCliente}</p>}
                        <p className="font-medium">
                          <span className={pedido.tipoEntrega === "ENTREGA" ? 'text-orange-600 dark:text-orange-400' : 'text-purple-600 dark:text-purple-400'}>
                            {pedido.tipoEntrega}
                          </span>
                        </p>
                        {/* NÃO mostrar endereço aqui se for ENTREGA */}
                        {/* {pedido.tipoEntrega === "ENTREGA" && pedido.enderecoEntrega && (
                          <p className="flex items-start"><FaMapMarkerAlt className="mr-1.5 mt-0.5 text-gray-400 dark:text-gray-500 flex-shrink-0" /> <span className="break-all truncate" title={pedido.enderecoEntrega}>{pedido.enderecoEntrega}</span></p>
                        )} */}
                        {pedido.observacoes && 
                          <p className="flex items-start italic">
                            <FaRegStickyNote className="mr-1.5 mt-0.5 text-gray-400 dark:text-gray-500 flex-shrink-0"/> 
                            <span className="text-gray-500 dark:text-gray-400 truncate" title={pedido.observacoes}>{pedido.observacoes}</span>
                          </p>
                        }
                      </div>

                      {/* Valor e Data - Movido para dentro do div principal para melhor controle do flex */}
                      <div className="text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-600 pt-2 flex justify-between items-center">
                        <span className="font-semibold text-green-600 dark:text-green-400">R$ {pedido.valor_total.toFixed(2).replace('.', ',')}</span>
                        <span>{new Date(pedido.time_do_pedido).toLocaleDateString('pt-BR', {day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit'})}</span>
                      </div>
                    </div>

                    {/* Ações do Pedido - Mantido no final, `justify-between` no container flex fará com que ele vá para baixo */}
                    <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-600 space-y-1.5">
                      {acoesBase
                        .filter(acao => acao.statusOrigem === pedido.status && (!acao.tipoEntrega || acao.tipoEntrega === pedido.tipoEntrega))
                        .map(acao => {
                          const IconeAcao = acao.icone;
                          return (
                            <button 
                              key={acao.novoStatus + (acao.tipoEntrega || '')}
                              onClick={(e) => { e.stopPropagation(); onMudarStatus(pedido.id, acao.novoStatus); }}
                              className={`w-full flex items-center justify-center text-xs font-medium text-white px-3 py-1.5 rounded-md shadow-sm hover:opacity-90 transition-opacity ${acao.className}`}
                            >
                              <IconeAcao className="mr-1.5" />
                              {acao.label}
                            </button>
                          );
                        })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      {/* Renderizar o Modal de Detalhes */}
      <DetalhesPedidoModal 
        isOpen={!!pedidoSelecionadoModal} 
        onClose={handleFecharDetalhesModal} 
        pedido={pedidoSelecionadoModal}
      />
    </>
  );
};

export default RenderPedidosKanban; 