import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaStore, FaEnvelope, FaWhatsapp, FaCheckCircle, FaTimesCircle, FaSpinner, FaExclamationTriangle, FaImage, FaIdBadge, FaUsers, FaEye, FaArrowLeft, FaChartPie, FaCalendarAlt, FaTag, FaMoneyBillWave } from 'react-icons/fa';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

interface FornecedorAdmin {
  id: number;
  nome: string;
  email: string;
  whatsapp: string;
  descricao?: string;
  logo?: string;
  status: boolean;
  assinaturaAtiva: boolean;
  createdAt: string;
  updatedAt: string;
  pratos?: Array<{ id: number; nome: string; preco: number; pedidos?: Array<{ status: string }> }>;
}

interface VendaPrato {
  nomePrato: string;
  quantidadeVendida: number;
  valorTotalVendido: number;
}

interface ChartData {
  labels: string[];
  datasets: [{
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
    borderWidth: number;
  }];
}

const CHART_COLORS = [
  '#4CAF50', '#2196F3', '#FFEB3B', '#FF9800', '#E91E63', '#9C27B0', '#673AB7', '#00BCD4', '#8BC34A', '#CDDC39', '#FFC107', '#FF5722'
];

const AdminFornecedoresListPage: React.FC = () => {
  const [fornecedores, setFornecedores] = useState<FornecedorAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFornecedor, setSelectedFornecedor] = useState<FornecedorAdmin | null>(null);
  const [isDetailView, setIsDetailView] = useState(false);

  const [vendasChartData, setVendasChartData] = useState<ChartData | null>(null);
  const [loadingVendas, setLoadingVendas] = useState(false);
  const [errorVendas, setErrorVendas] = useState<string | null>(null);
  const [totalVendidoFornecedor, setTotalVendidoFornecedor] = useState(0);

  useEffect(() => {
    const fetchFornecedores = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('http://localhost:3333/admin/fornecedores');
        setFornecedores(response.data || []);
      } catch (err) {
        console.error("Erro ao buscar fornecedores:", err);
        setError('Não foi possível carregar a lista de fornecedores.');
      } finally {
        setLoading(false);
      }
    };
    if (!isDetailView) {
      fetchFornecedores();
    }
  }, [isDetailView]);

  useEffect(() => {
    const fetchVendasData = async () => {
      if (!selectedFornecedor || !isDetailView) return;
      setLoadingVendas(true);
      setErrorVendas(null);
      setVendasChartData(null);
      setTotalVendidoFornecedor(0);
      try {
        const response = await axios.get<VendaPrato[]>(
          `http://localhost:3333/admin/fornecedores/${selectedFornecedor.id}/vendas-pratos`
        );
        const vendas = response.data;
        if (vendas && vendas.length > 0) {
          const labels = vendas.map(v => v.nomePrato);
          const data = vendas.map(v => v.valorTotalVendido);
          const totalValor = data.reduce((sum, val) => sum + val, 0);
          setTotalVendidoFornecedor(totalValor);
          setVendasChartData({
            labels,
            datasets: [{
              data,
              backgroundColor: CHART_COLORS.slice(0, data.length).map(color => `${color}B3`),
              borderColor: CHART_COLORS.slice(0, data.length),
              borderWidth: 1,
            }],
          });
        } else {
          setVendasChartData(null);
        }
      } catch (err) {
        console.error("Erro ao buscar dados de vendas:", err);
        setErrorVendas('Não foi possível carregar os dados de vendas do fornecedor.');
      } finally {
        setLoadingVendas(false);
      }
    };
    fetchVendasData();
  }, [selectedFornecedor, isDetailView]);

  const handleViewDetails = (fornecedor: FornecedorAdmin) => {
    setSelectedFornecedor(fornecedor);
    setIsDetailView(true);
  };

  const handleBackToList = () => {
    setSelectedFornecedor(null);
    setIsDetailView(false);
  };

  const renderDetailView = () => {
    if (!selectedFornecedor) return null;

    return (
      <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-xl shadow-2xl animate-fadeIn">
        <button 
          onClick={handleBackToList}
          className="mb-6 flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
        >
          <FaArrowLeft className="mr-2" /> Voltar para a lista de fornecedores
        </button>

        <div className="flex flex-col md:flex-row items-center mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
          {selectedFornecedor.logo ? (
            <img src={selectedFornecedor.logo} alt={selectedFornecedor.nome} className="h-24 w-24 rounded-full object-cover mr-0 md:mr-6 mb-4 md:mb-0 shadow-lg border-4 border-white dark:border-gray-700" />
          ) : (
            <div className="h-24 w-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-0 md:mr-6 mb-4 md:mb-0 text-3xl text-gray-400 dark:text-gray-500 shadow-lg border-4 border-white dark:border-gray-700"><FaStore /></div>
          )}
          <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">{selectedFornecedor.nome}</h2>
            <p className="text-gray-500 dark:text-gray-400">ID: {selectedFornecedor.id}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-1 space-y-5 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 border-b pb-2 mb-3 border-gray-200 dark:border-gray-600">Informações</h3>
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center"><FaEnvelope className="mr-2 opacity-70" />Email</p>
              <p className="text-gray-800 dark:text-gray-200 break-all">{selectedFornecedor.email}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center"><FaWhatsapp className="mr-2 opacity-70" />WhatsApp</p>
              <p className="text-gray-800 dark:text-gray-200">{selectedFornecedor.whatsapp}</p>
            </div>
            <div className="mt-3">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center"><FaTag className="mr-1.5 opacity-70" />Status da Conta</p>
              {selectedFornecedor.status ? (
                <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 items-center"><FaCheckCircle className="mr-1" />Ativo</span>
              ) : (
                <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300 items-center"><FaTimesCircle className="mr-1" />Inativo</span>
              )}</div>
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center"><FaMoneyBillWave className="mr-1.5 opacity-70" />Assinatura</p>
              {selectedFornecedor.assinaturaAtiva ? (
                <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 items-center"><FaCheckCircle className="mr-1" />Ativa</span>
              ) : (
                <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300 items-center"><FaTimesCircle className="mr-1" />Inativa</span>
              )}</div>
            <div className="pt-1">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center"><FaCalendarAlt className="mr-1.5 opacity-70" />Registrado em</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">{new Date(selectedFornecedor.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Descrição</p>
              <p className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed break-words">{selectedFornecedor.descricao || 'Nenhuma descrição fornecida.'}</p>
            </div>
          </div>
          
          <div className="lg:col-span-2 bg-gray-50 dark:bg-gray-700/30 p-4 md:p-6 rounded-lg shadow-inner flex flex-col items-center justify-center min-h-[300px]">
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-1 flex items-center"><FaChartPie className="mr-2 text-green-600 dark:text-green-500" />Desempenho de Vendas por Prato</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Valor total vendido: <span className="font-semibold text-green-600 dark:text-green-400">R$ {totalVendidoFornecedor.toFixed(2).replace('.', ',')}</span></p>
            {loadingVendas && (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400 py-10">
                <FaSpinner className="animate-spin text-4xl mb-3 text-green-500" />
                <p className="text-lg">Carregando dados de vendas...</p>
              </div>
            )}
            {errorVendas && !loadingVendas && (
              <div className="flex flex-col items-center justify-center h-full text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-4 rounded-md py-10">
                <FaExclamationTriangle className="text-4xl mb-3" />
                <p className="text-lg text-center">{errorVendas}</p>
              </div>
            )}
            {!loadingVendas && !errorVendas && vendasChartData && (
              <div className="w-full h-[300px] md:h-[350px] lg:h-[400px] mt-2">
                <Doughnut 
                  data={vendasChartData} 
                  options={{ 
                    responsive: true, 
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: { font: { size: 11 }, color: document.body.classList.contains('dark') ? '#cbd5e1' : '#4b5563' }
                      },
                      title: { display: false }
                    }
                  }} 
                />
              </div>
            )}
            {!loadingVendas && !errorVendas && !vendasChartData && (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400 py-10">
                <FaChartPie className="text-5xl opacity-50 mb-3" />
                <p className="text-lg text-center">Nenhum dado de venda encontrado.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-4xl text-green-500" />
        <p className="ml-3 text-lg">Carregando fornecedores...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 dark:border-red-400 text-red-700 dark:text-red-300 p-4 rounded-md shadow-md" role="alert">
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
      {!isDetailView ? (
        <>
          <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mb-6">Gerenciamento de Fornecedores</h2>
          {fornecedores.length === 0 && !loading ? (
            <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <FaUsers className="text-5xl text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300">Nenhum fornecedor encontrado</h3>
              <p className="text-gray-500 dark:text-gray-400">Não há fornecedores cadastrados no sistema ainda.</p>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Fornecedor</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Contato</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Assinatura</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Detalhes</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {fornecedores.map((fornecedor) => (
                      <tr key={fornecedor.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              {fornecedor.logo ? (
                                <img className="h-10 w-10 rounded-full object-cover shadow-sm" src={fornecedor.logo} alt={fornecedor.nome} />
                              ) : (
                                <span className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center shadow-sm">
                                  <FaStore className="text-gray-400 dark:text-gray-500" />
                                </span>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-semibold text-gray-900 dark:text-white">{fornecedor.nome}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">ID: {fornecedor.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white flex items-center">
                            <FaEnvelope className="mr-1.5 text-gray-400 dark:text-gray-500 flex-shrink-0" /> {fornecedor.email}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-1">
                            <FaWhatsapp className="mr-1.5 text-gray-400 dark:text-gray-500 flex-shrink-0" /> {fornecedor.whatsapp}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {fornecedor.status ? (
                            <span className="px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 items-center">
                              <FaCheckCircle className="mr-1.5"/> Ativo
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 items-center">
                              <FaTimesCircle className="mr-1.5"/> Inativo
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {fornecedor.assinaturaAtiva ? (
                            <span className="px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 items-center">
                              <FaIdBadge className="mr-1.5"/> Ativa
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 items-center">
                              <FaTimesCircle className="mr-1.5"/> Inativa
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                           <p className="truncate max-w-xs">{fornecedor.descricao || 'Sem descrição'}</p>
                           <p className="text-xs mt-1">Criado em: {new Date(fornecedor.createdAt).toLocaleDateString('pt-BR')}</p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <button 
                            onClick={() => handleViewDetails(fornecedor)}
                            className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-150"
                            title="Ver Detalhes"
                          >
                            <FaEye size={18}/>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      ) : (
        renderDetailView()
      )}
    </div>
  );
};

export default AdminFornecedoresListPage; 