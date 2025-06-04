import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaDollarSign,
  FaUsers,
  FaSpinner,
  FaExclamationTriangle,
  FaShoppingCart,
  FaStore,
  FaChartLine,
  FaRegCalendarAlt,
  FaUtensils,
  FaCheckCircle,
  FaTimesCircle,
  FaEllipsisH,
  FaUserClock,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import { isAdminLoggedIn } from "../../services/adminAuth";
import { useNavigate } from "react-router-dom";

interface AdminStats {
  totalAssinaturasAtivas: number;
  totalPedidosHoje?: number;
  totalPratosAtivos?: number;
  totalFornecedores?: number;
  totalClientes?: number;
  novosClientesPeriodo?: number;
  variacaoClientes?: number;
  variacaoAssinaturas?: number; // em percentual
  novosFornecedoresSemana?: number;
  pedidosRecentes?: Array<{
    id: number;
    cliente: string;
    valorTotal: number;
    data: string;
    status: string;
  }>;
  fornecedoresRecentes?: Array<{
    id: number;
    nome: string;
    logo?: string;
    assinaturaAtiva: boolean;
    dataCadastro: string;
  }>;
}

const VALOR_ASSINATURA_MENSAL = 50.0; // Valor hipotético da assinatura

const AdminDashboardHomePage: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [periodoSelecionado, setPeriodoSelecionado] = useState<
    "hoje" | "semana" | "mes" | "ano"
  >("mes");
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar se o admin está logado
    if (!isAdminLoggedIn()) {
      navigate("/restrito");
      return;
    }

    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        // Buscar dados reais da API
        const response = await axios.get(
          `http://localhost:3333/admin/dashboard/stats?periodo=${periodoSelecionado}`
        );

        setStats(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Erro ao buscar estatísticas do admin:", err);
        setError(
          "Não foi possível carregar as estatísticas. Verifique a conexão ou tente mais tarde."
        );
        setLoading(false);
      }
    };

    fetchStats();
  }, [navigate, periodoSelecionado]);

  const valorTotalRecebidoCalculado = stats
    ? stats.totalAssinaturasAtivas * VALOR_ASSINATURA_MENSAL
    : 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-4xl text-green-500" />
        <p className="ml-3 text-lg">Carregando estatísticas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 dark:border-red-400 text-red-700 dark:text-red-300 p-4 rounded-md shadow-md"
        role="alert"
      >
        <div className="flex items-center">
          <FaExclamationTriangle className="text-xl mr-3" />
          <div>
            <p className="font-bold">Erro ao carregar dados</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn max-w-full overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-3xl font-semibold text-gray-800 dark:text-white">
            Dashboard Principal
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Visão geral da plataforma e métricas principais
          </p>
        </div>

        <div className="flex flex-wrap mt-4 md:mt-0 bg-white dark:bg-gray-800 rounded-lg shadow p-1">
          <PeriodoButton
            label="Hoje"
            active={periodoSelecionado === "hoje"}
            onClick={() => setPeriodoSelecionado("hoje")}
          />
          <PeriodoButton
            label="Semana"
            active={periodoSelecionado === "semana"}
            onClick={() => setPeriodoSelecionado("semana")}
          />
          <PeriodoButton
            label="Mês"
            active={periodoSelecionado === "mes"}
            onClick={() => setPeriodoSelecionado("mes")}
          />
          <PeriodoButton
            label="Ano"
            active={periodoSelecionado === "ano"}
            onClick={() => setPeriodoSelecionado("ano")}
          />
        </div>
      </div>

      {/* Cartões principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card Valores Recebidos */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border-b-4 border-green-500 dark:border-green-600">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400">
              Valores Recebidos
            </h3>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
              <FaDollarSign className="text-xl text-green-600 dark:text-green-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-800 dark:text-white">
            R$ {valorTotalRecebidoCalculado.toFixed(2).replace(".", ",")}
          </p>
          <div className="flex items-center mt-2 text-sm">
            <div className="flex items-center text-green-600 dark:text-green-400">
              <FaArrowUp className="mr-1" />
              <span>{stats?.variacaoAssinaturas || 0}%</span>
            </div>
            <span className="text-gray-500 dark:text-gray-400 ml-2">
              em relação ao período anterior
            </span>
          </div>
        </div>

        {/* Card Assinaturas Ativas */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border-b-4 border-blue-500 dark:border-blue-600">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400">
              Assinaturas Ativas
            </h3>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <FaUsers className="text-xl text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-800 dark:text-white">
            {stats?.totalAssinaturasAtivas || 0}
          </p>
          <div className="flex items-center mt-2 text-sm">
            {stats?.variacaoAssinaturas && stats.variacaoAssinaturas > 0 ? (
              <div className="flex items-center text-green-600 dark:text-green-400">
                <FaArrowUp className="mr-1" />
                <span>{stats.variacaoAssinaturas}%</span>
              </div>
            ) : (
              <div className="flex items-center text-red-600 dark:text-red-400">
                <FaArrowDown className="mr-1" />
                <span>{Math.abs(stats?.variacaoAssinaturas || 0)}%</span>
              </div>
            )}
            <span className="text-gray-500 dark:text-gray-400 ml-2">
              em relação ao período anterior
            </span>
          </div>
        </div>

        {/* Card Pedidos Hoje */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border-b-4 border-purple-500 dark:border-purple-600">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400">
              Pedidos Hoje
            </h3>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
              <FaShoppingCart className="text-xl text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-800 dark:text-white">
            {stats?.totalPedidosHoje || 0}
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
            <FaRegCalendarAlt className="inline mr-1" />{" "}
            {new Date().toLocaleDateString("pt-BR")}
          </p>
        </div>

        {/* Card Fornecedores */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border-b-4 border-amber-500 dark:border-amber-600">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400">
              Fornecedores
            </h3>
            <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-full">
              <FaStore className="text-xl text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-800 dark:text-white">
            {stats?.totalFornecedores || 0}
          </p>
          <div className="flex items-center mt-2 text-sm">
            <div className="flex items-center text-green-600 dark:text-green-400">
              <FaUserClock className="mr-1" />
              <span>{stats?.novosFornecedoresSemana || 0} novos</span>
            </div>
            <span className="text-gray-500 dark:text-gray-400 ml-2">
              esta semana
            </span>
          </div>
        </div>
      </div>

      {/* Card para Clientes Cadastrados */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border-b-4 border-indigo-500 dark:border-indigo-600 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400">
            Clientes Cadastrados
          </h3>
          <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-full">
            <FaUsers className="text-xl text-indigo-600 dark:text-indigo-400" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
            <p className="text-3xl font-bold text-gray-800 dark:text-white">
              {stats?.totalClientes || 0}
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
              Total de clientes
            </p>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
            <p className="text-3xl font-bold text-gray-800 dark:text-white">
              {stats?.novosClientesPeriodo || 0}
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
              Novos neste{" "}
              {periodoSelecionado === "hoje"
                ? "dia"
                : periodoSelecionado === "semana"
                ? "semana"
                : periodoSelecionado === "mes"
                ? "mês"
                : "ano"}
            </p>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
            <div className="flex items-center justify-center">
              {stats?.variacaoClientes && stats.variacaoClientes > 0 ? (
                <div className="flex items-center text-green-600 dark:text-green-400">
                  <FaArrowUp className="mr-1 text-xl" />
                  <span className="text-3xl font-bold">
                    {stats.variacaoClientes}%
                  </span>
                </div>
              ) : (
                <div className="flex items-center text-red-600 dark:text-red-400">
                  <FaArrowDown className="mr-1 text-xl" />
                  <span className="text-3xl font-bold">
                    {Math.abs(stats?.variacaoClientes || 0)}%
                  </span>
                </div>
              )}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
              Variação em relação ao total
            </p>
          </div>
        </div>
      </div>

      {/* Seção de Tabelas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Tabela de Pedidos Recentes */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
              <FaShoppingCart className="mr-2 text-purple-500 dark:text-purple-400" />
              Pedidos Recentes
            </h3>
            <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
              <FaEllipsisH />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Pedido
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Cliente
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Valor
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {stats?.pedidosRecentes && stats.pedidosRecentes.length > 0 ? (
                  stats.pedidosRecentes.map((pedido) => (
                    <tr
                      key={pedido.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        #{pedido.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {pedido.cliente}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        R$ {pedido.valorTotal.toFixed(2).replace(".", ",")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {pedido.status === "ENTREGUE" && (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                            <FaCheckCircle className="mr-1 mt-0.5" /> Entregue
                          </span>
                        )}
                        {pedido.status === "NOVO" && (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                            Novo
                          </span>
                        )}
                        {pedido.status === "PREPARANDO" && (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">
                            Preparando
                          </span>
                        )}
                        {pedido.status === "CANCELADO" && (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">
                            <FaTimesCircle className="mr-1 mt-0.5" /> Cancelado
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                    >
                      Nenhum pedido recente encontrado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 text-right">
            <button
              onClick={() => console.log("Ver todos os pedidos")}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
            >
              Ver todos os pedidos →
            </button>
          </div>
        </div>

        {/* Fornecedores Recentes */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
              <FaStore className="mr-2 text-amber-500 dark:text-amber-400" />
              Fornecedores Recentes
            </h3>
            <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
              <FaEllipsisH />
            </button>
          </div>
          {/* Utilizando flexbox para evitar overflow horizontal */}
          <div className="max-w-full">
            {stats?.fornecedoresRecentes &&
            stats.fornecedoresRecentes.length > 0 ? (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {stats.fornecedoresRecentes.map((fornecedor) => (
                  <div
                    key={fornecedor.id}
                    className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400">
                          {fornecedor.logo ? (
                            <img
                              src={fornecedor.logo}
                              alt={fornecedor.nome}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            fornecedor.nome.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {fornecedor.nome}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Desde{" "}
                            {new Date(
                              fornecedor.dataCadastro
                            ).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                      </div>
                      <div>
                        {fornecedor.assinaturaAtiva ? (
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                            <FaCheckCircle className="mr-1 mt-0.5" /> Ativo
                          </span>
                        ) : (
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">
                            <FaTimesCircle className="mr-1 mt-0.5" /> Inativo
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                Nenhum fornecedor recente encontrado
              </div>
            )}
          </div>
          <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 text-right">
            <button
              onClick={() => navigate("/admin/fornecedores")}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
            >
              Ver todos os fornecedores →
            </button>
          </div>
        </div>
      </div>

      {/* Estatísticas Adicionais */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mt-8">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6 flex items-center">
          <FaChartLine className="mr-2 text-green-600 dark:text-green-400" />
          Estatísticas da Plataforma
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 dark:bg-gray-700/50 p-5 rounded-lg shadow-inner">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Total de Pratos
              </h4>
              <FaUtensils className="text-green-600 dark:text-green-400" />
            </div>
            <p className="text-2xl font-semibold text-gray-800 dark:text-white">
              {stats?.totalPratosAtivos || 0}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Pratos ativos na plataforma
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/50 p-5 rounded-lg shadow-inner">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Taxa de Conversão
              </h4>
              <FaChartLine className="text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-2xl font-semibold text-gray-800 dark:text-white">
              56%
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Visitantes que finalizam pedidos
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/50 p-5 rounded-lg shadow-inner">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Ticket Médio
              </h4>
              <FaDollarSign className="text-green-600 dark:text-green-400" />
            </div>
            <p className="text-2xl font-semibold text-gray-800 dark:text-white">
              R$ 48,90
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Valor médio por pedido
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente auxiliar para os botões de período
const PeriodoButton = ({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    className={`px-4 py-2 text-sm rounded-md transition-colors ${
      active
        ? "bg-green-600 text-white font-medium shadow-sm"
        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
    }`}
    onClick={onClick}
  >
    {label}
  </button>
);

export default AdminDashboardHomePage;
