import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaSpinner,
  FaExclamationTriangle,
  FaShoppingBag,
  FaCalendarAlt,
  FaUserFriends,
  FaSearch,
  FaMoneyBillWave,
  FaCheckCircle,
  FaSortAmountDown,
  FaSortAmountUp,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { isAdminLoggedIn } from "../../services/adminAuth";

interface Cliente {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  createdAt: string;
  updatedAt: string;
  pedidos: Array<{
    id: number;
    valor_total_pedido: number;
    status: string;
    time_do_pedido: string;
  }>;
  estatisticas: {
    totalGasto: number;
    totalPedidos: number;
    pedidosFinalizados: number;
  };
}

type SortField = "nome" | "totalGasto" | "totalPedidos" | "createdAt";
type SortDirection = "asc" | "desc";

const AdminClientesListPage: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdminLoggedIn()) {
      navigate("/restrito");
      return;
    }

    const fetchClientes = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          "http://localhost:3333/admin/clientes"
        );
        setClientes(response.data || []);
      } catch (err) {
        console.error("Erro ao buscar clientes:", err);
        setError("Não foi possível carregar a lista de clientes.");
      } finally {
        setLoading(false);
      }
    };

    fetchClientes();
  }, [navigate]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString("pt-BR");
  };

  const formatarValor = (valor: number) => {
    return `R$ ${valor.toFixed(2).replace(".", ",")}`;
  };

  const filteredClientes = searchTerm
    ? clientes.filter(
        (cliente) =>
          cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cliente.telefone.includes(searchTerm)
      )
    : clientes;

  const sortedClientes = [...filteredClientes].sort((a, b) => {
    if (sortField === "nome") {
      return sortDirection === "asc"
        ? a.nome.localeCompare(b.nome)
        : b.nome.localeCompare(a.nome);
    } else if (sortField === "totalGasto") {
      return sortDirection === "asc"
        ? a.estatisticas.totalGasto - b.estatisticas.totalGasto
        : b.estatisticas.totalGasto - a.estatisticas.totalGasto;
    } else if (sortField === "totalPedidos") {
      return sortDirection === "asc"
        ? a.estatisticas.totalPedidos - b.estatisticas.totalPedidos
        : b.estatisticas.totalPedidos - a.estatisticas.totalPedidos;
    } else {
      // createdAt
      return sortDirection === "asc"
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-4xl text-green-500" />
        <p className="ml-3 text-lg">Carregando clientes...</p>
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
    <div className="animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mb-4 md:mb-0">
          Gerenciamento de Clientes
        </h2>
        <div className="relative w-full md:w-auto">
          <input
            type="text"
            placeholder="Buscar cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full md:w-64 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400"
          />
          <FaSearch className="absolute left-3 top-3 text-gray-500 dark:text-gray-400" />
        </div>
      </div>

      {/* Estatísticas Gerais */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
          <FaUserFriends className="mr-2 text-green-600 dark:text-green-400" />
          Estatísticas de Clientes
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <FaUser className="text-blue-500 dark:text-blue-400 mr-2" />
              <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">
                Total de Clientes
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {clientes.length}
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <FaShoppingBag className="text-purple-500 dark:text-purple-400 mr-2" />
              <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">
                Total de Pedidos
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {clientes.reduce(
                (sum, cliente) => sum + cliente.estatisticas.totalPedidos,
                0
              )}
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <FaMoneyBillWave className="text-green-500 dark:text-green-400 mr-2" />
              <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">
                Receita Total
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatarValor(
                clientes.reduce(
                  (sum, cliente) => sum + cliente.estatisticas.totalGasto,
                  0
                )
              )}
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <FaCheckCircle className="text-amber-500 dark:text-amber-400 mr-2" />
              <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">
                Pedidos Finalizados
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {clientes.reduce(
                (sum, cliente) => sum + cliente.estatisticas.pedidosFinalizados,
                0
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Lista de Clientes */}
      {sortedClientes.length === 0 ? (
        <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <FaUserFriends className="text-5xl text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300">
            {searchTerm
              ? "Nenhum cliente encontrado"
              : "Nenhum cliente cadastrado"}
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            {searchTerm
              ? "Tente outro termo de busca."
              : "Não há clientes cadastrados no sistema."}
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("nome")}
                  >
                    <div className="flex items-center">
                      Cliente
                      {sortField === "nome" && (
                        <span className="ml-1">
                          {sortDirection === "asc" ? (
                            <FaSortAmountUp />
                          ) : (
                            <FaSortAmountDown />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Contato
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("totalPedidos")}
                  >
                    <div className="flex items-center">
                      Pedidos
                      {sortField === "totalPedidos" && (
                        <span className="ml-1">
                          {sortDirection === "asc" ? (
                            <FaSortAmountUp />
                          ) : (
                            <FaSortAmountDown />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("totalGasto")}
                  >
                    <div className="flex items-center">
                      Total Gasto
                      {sortField === "totalGasto" && (
                        <span className="ml-1">
                          {sortDirection === "asc" ? (
                            <FaSortAmountUp />
                          ) : (
                            <FaSortAmountDown />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("createdAt")}
                  >
                    <div className="flex items-center">
                      Data Cadastro
                      {sortField === "createdAt" && (
                        <span className="ml-1">
                          {sortDirection === "asc" ? (
                            <FaSortAmountUp />
                          ) : (
                            <FaSortAmountDown />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {sortedClientes.map((cliente) => (
                  <tr
                    key={cliente.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                          <FaUser className="text-gray-500 dark:text-gray-400" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-gray-900 dark:text-white">
                            {cliente.nome}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            ID: {cliente.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white flex items-center">
                        <FaEnvelope className="mr-1.5 text-gray-400 dark:text-gray-500 flex-shrink-0" />{" "}
                        {cliente.email}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-1">
                        <FaPhone className="mr-1.5 text-gray-400 dark:text-gray-500 flex-shrink-0" />{" "}
                        {cliente.telefone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        <span className="font-semibold">
                          {cliente.estatisticas.totalPedidos}
                        </span>{" "}
                        pedidos
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <span className="font-medium">
                          {cliente.estatisticas.pedidosFinalizados}
                        </span>{" "}
                        finalizados
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        {formatarValor(cliente.estatisticas.totalGasto)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <FaCalendarAlt className="mr-2 text-gray-400" />
                        {formatarData(cliente.createdAt)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminClientesListPage;
