import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaDollarSign, FaUsers, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';

interface AdminStats {
  totalAssinaturasAtivas: number;
  // Futuramente podemos buscar o valor total do backend
  // valorTotalRecebido: number;
}

const VALOR_ASSINATURA_MENSAL = 50.00; // Valor hipotético da assinatura

const AdminDashboardHomePage: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        // TODO: Usar token de admin se necessário para o endpoint real
        // const token = localStorage.getItem('adminToken'); // Supondo que haja um token admin

        // Endpoint para buscar total de assinaturas ativas
        // Este endpoint precisa ser criado no backend
        const response = await axios.get('http://localhost:3333/admin/stats/assinaturas-ativas', {
          // headers: { Authorization: `Bearer ${token}` }
        });

        setStats({
          totalAssinaturasAtivas: response.data.totalAssinaturasAtivas || 0,
        });

      } catch (err) {
        console.error("Erro ao buscar estatísticas do admin:", err);
        setError('Não foi possível carregar as estatísticas. Verifique a conexão ou tente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

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
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mb-6">Dashboard Principal</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card Valores Recebidos */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400">Valores Recebidos (Assinaturas)</h3>
            <FaDollarSign className="text-3xl text-green-500 dark:text-green-400 opacity-70" />
          </div>
          <p className="text-4xl font-bold text-green-600 dark:text-green-400">
            R$ {valorTotalRecebidoCalculado.toFixed(2).replace('.', ',')}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Estimativa mensal baseada em {stats?.totalAssinaturasAtivas || 0} assinaturas ativas.</p>
        </div>

        {/* Card Total de Assinaturas */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400">Total de Assinaturas Ativas</h3>
            <FaUsers className="text-3xl text-blue-500 dark:text-blue-400 opacity-70" />
          </div>
          <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
            {stats?.totalAssinaturasAtivas ?? '0'}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Fornecedores com assinatura ativa na plataforma.</p>
        </div>
      </div>

      {/* Placeholder para mais estatísticas ou gráficos futuros */}
      {/*
      <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Outras Estatísticas</h3>
        <p className="text-gray-600 dark:text-gray-400">Mais gráficos e dados virão aqui...</p>
      </div>
      */}
    </div>
  );
};

export default AdminDashboardHomePage; 