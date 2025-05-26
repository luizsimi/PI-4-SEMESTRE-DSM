import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';
import { FaShoppingBag, FaStore, FaClipboardList, FaSpinner, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';

interface PedidoCliente {
  id: number;
  status: string;
  time_do_pedido: string;
  valor_total: number;
  quantidade: number;
  preco_unitario_snapshot: number;
  tipoEntrega: string;
  enderecoEntrega?: string;
  observacoes?: string;
  prato: {
    nome: string;
    imagem?: string;
  };
  fornecedor: {
    nome: string;
    logo?: string;
  };
}

const statusTextMap: Record<string, string> = {
  NOVO: "Novo Pedido",
  EM_PREPARO: "Em Preparo",
  PRONTO_PARA_RETIRADA: "Pronto para Retirada",
  SAIU_PARA_ENTREGA: "Saiu para Entrega",
  FINALIZADO: "Finalizado",
  RECUSADO_PELO_FORNECEDOR: "Recusado pelo Fornecedor",
  CANCELADO_PELO_CLIENTE: "Cancelado por Você", // Se implementarmos cancelamento pelo cliente
};

const statusColorMap: Record<string, string> = {
  NOVO: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  EM_PREPARO: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  PRONTO_PARA_RETIRADA: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  SAIU_PARA_ENTREGA: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
  FINALIZADO: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  RECUSADO_PELO_FORNECEDOR: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  CANCELADO_PELO_CLIENTE: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
};

const MeusPedidosPage: React.FC = () => {
  const [pedidos, setPedidos] = useState<PedidoCliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, userData } = useAuth(); // Usar isAuthenticated e/ou userData para dependência

  useEffect(() => {
    const fetchMeusPedidos = async () => {
      if (!isAuthenticated) { // Ou if(!userData) - verificar se o usuário está logado
        setLoading(false); // Não buscar se não estiver autenticado
        //setError("Você precisa estar logado para ver seus pedidos."); // Opcional: mostrar mensagem
        setPedidos([]); // Limpar pedidos se não estiver autenticado
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        if (!token) { // Segurança extra
            setError("Token de autenticação não encontrado.");
            setLoading(false);
            return;
        }
        const response = await axios.get('http://localhost:3333/pedidos/meus', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPedidos(response.data || []);
      } catch (err) {
        console.error("Erro ao buscar meus pedidos:", err);
        setError("Não foi possível carregar seus pedidos. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };
    fetchMeusPedidos();
  }, [isAuthenticated, userData]); // Usar isAuthenticated ou userData como dependência

  const formatarDataSimples = (dataString: string) => {
    return new Date(dataString).toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-8">
            <FaClipboardList className="text-3xl text-green-600 dark:text-green-400 mr-3" />
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Meus Pedidos</h1>
          </div>

          {loading && (
            <div className="text-center py-12"><FaSpinner className="animate-spin text-4xl text-green-500 mx-auto" /><p className="mt-3 text-gray-600 dark:text-gray-400">Carregando seus pedidos...</p></div>
          )}

          {error && (
            <div className="bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 dark:border-red-400 text-red-700 dark:text-red-300 p-6 rounded-md shadow-md mb-6" role="alert">
              <div className="flex items-center"><FaExclamationTriangle className="text-2xl mr-3" /><h3 className="text-lg font-semibold">Ocorreu um erro</h3></div>
              <p className="mt-2 text-sm">{error}</p>
            </div>
          )}

          {!loading && !error && pedidos.length === 0 && (
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-md">
              <FaShoppingBag className="text-6xl text-gray-300 dark:text-gray-500 mx-auto mb-6" />
              <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-2">Nenhum Pedido Encontrado</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6">Você ainda não fez nenhum pedido. Que tal explorar nosso cardápio?</p>
              <Link to="/categorias" className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors shadow-sm hover:shadow-lg">Ver Cardápios</Link>
            </div>
          )}

          {!loading && !error && pedidos.length > 0 && (
            <div className="space-y-6">
              {pedidos.map((pedido) => (
                <div key={pedido.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl">
                  <div className="p-5 md:p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start mb-3 sm:mb-2">
                      <div>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColorMap[pedido.status] || 'bg-gray-200 text-gray-800'}`}>{statusTextMap[pedido.status] || pedido.status}</span>
                        <h3 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-white mt-1.5 line-clamp-1">{pedido.prato.nome} (x{pedido.quantidade})</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Pedido nº {pedido.id} • {formatarDataSimples(pedido.time_do_pedido)}</p>
                      </div>
                      <div className="flex-shrink-0 mt-3 sm:mt-0 sm:ml-4">
                        {pedido.prato.imagem ? (
                          <img src={pedido.prato.imagem} alt={pedido.prato.nome} className="w-16 h-16 md:w-20 md:h-20 rounded-lg object-cover shadow-sm border border-gray-200 dark:border-gray-700" />
                        ) : (
                          <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500"><FaShoppingBag size={24}/></div>
                        )}
                      </div>
                    </div>
                    
                    <div className="my-3 py-3 border-y border-gray-100 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300">
                        <p><strong>Fornecedor:</strong> {pedido.fornecedor.nome}</p>
                        <p><strong>Tipo:</strong> {pedido.tipoEntrega}</p>
                        {pedido.tipoEntrega === "ENTREGA" && pedido.enderecoEntrega && <p><strong>Endereço:</strong> {pedido.enderecoEntrega}</p>}
                        <p><strong>Preço Unit.:</strong> R$ {pedido.preco_unitario_snapshot.toFixed(2).replace('.', ',')}</p>
                        <p><strong>Valor Total:</strong> <span className="font-bold text-green-600 dark:text-green-400">R$ {pedido.valor_total.toFixed(2).replace('.', ',')}</span></p>
                        {pedido.observacoes && <p className="mt-1 text-xs text-gray-500 dark:text-gray-400"><FaInfoCircle className="inline mr-1"/> <strong>Obs:</strong> {pedido.observacoes}</p>}
                    </div>
                    
                    {/* Ações para o cliente (ex: repetir pedido, rastrear - futuras) */}
                    {/* <div className="mt-3 flex justify-end"><button className="text-sm text-green-600 hover:underline">Pedir Novamente</button></div> */}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MeusPedidosPage; 