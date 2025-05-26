import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios, { AxiosError } from "axios";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaStar,
  FaRegStar,
  FaComments,
  FaUserEdit,
  FaSignOutAlt,
  FaCheck,
  FaUtensils,
  FaExclamationCircle,
  FaSpinner,
  FaTimes,
  FaTag,
  FaBars,
  FaClipboardList,
  FaCheckDouble,
  FaTruckLoading,
  FaBoxOpen,
  FaBan,
  FaRedo,
  FaCalendarAlt,
  FaDollarSign,
  FaChevronRight,
  FaInfoCircle,
  FaBell,
  FaRegBell
} from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import UserProfileModal from "../components/UserProfileModal";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import RenderPedidosKanban from "../components/fornecedor/RenderPedidosKanban";
// import SidebarFornecedor from '../components/fornecedor/SidebarFornecedor'; // Comentado - Arquivo não encontrado
import type { Pedido } from '../types';
// import LoadingSpinner from '../components/common/LoadingSpinner'; // Comentado - Arquivo não encontrado

interface Prato {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  imagem?: string;
  categoria: string;
  disponivel: boolean;
  avaliacoes: Avaliacao[];
}

interface Avaliacao {
  id: number;
  nota: number;
  comentario: string;
  cliente: {
    id: number;
    nome: string;
  };
  createdAt: string;
}

interface Fornecedor {
  id: number;
  nome: string;
  email: string;
  whatsapp: string;
  descricao?: string;
  logo?: string;
  status: boolean;
  assinaturaAtiva: boolean;
}

interface ErrorResponse {
  error: string;
}

const FornecedorDashboard = () => {
  const [fornecedor, setFornecedor] = useState<Fornecedor | null>(null);
  const [pratos, setPratos] = useState<Prato[]>([]);
  const [loading, setLoading] = useState(false); // Temporariamente false se não houver spinner
  const [error, setError] = useState("");
  const [mostrarAvaliacoes, setMostrarAvaliacoes] = useState(false);
  const [pratosComAvaliacoes, setPratosComAvaliacoes] = useState<Prato[]>([]);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [activeTab, setActiveTab] = useState("pedidos");
  const [pedidos, setPedidos] = useState<Pedido[]>([]); 
  const [loadingPedidos, setLoadingPedidos] = useState(true);
  const [errorPedidos, setErrorPedidos] = useState("");
  
  // Estados para o filtro de data
  const [dataFiltroStats, setDataFiltroStats] = useState(() => new Date().toISOString().split('T')[0]);
  const [dataAplicadaStats, setDataAplicadaStats] = useState(() => new Date().toISOString().split('T')[0]);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const audioPlayer = useRef<HTMLAudioElement>(null);
  const notifiedNewOrderIds = useRef(new Set<number>());

  // Estados para o sino de notificações
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(() => {
    const savedSoundPreference = localStorage.getItem('notificationSoundEnabled');
    console.log('[Dashboard] Lendo preferência de som do localStorage:', savedSoundPreference);
    const initialValue = savedSoundPreference ? JSON.parse(savedSoundPreference) : true;
    console.log('[Dashboard] Valor inicial para isSoundEnabled:', initialValue);
    return initialValue;
  });
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  const notificationBellRef = useRef<HTMLButtonElement>(null);
  const notificationDropdownRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    console.log("FornecedorDashboard - Carregando dados");
    const buscarDados = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        console.log(
          "FornecedorDashboard - Token:",
          token ? "Existe" : "Não existe"
        );

        // Buscar dados do fornecedor
        const fornecedorResponse = await axios.get(
          "http://localhost:3333/fornecedores/perfil",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(
          "FornecedorDashboard - Dados recebidos:",
          fornecedorResponse.data
        );
        setFornecedor(fornecedorResponse.data);
        setPratos(fornecedorResponse.data.pratos || []);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);

        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<ErrorResponse>;
          // Se receber erro 401 ou 403, redirecionar para a página inicial
          if (
            axiosError.response &&
            (axiosError.response.status === 401 ||
              axiosError.response.status === 403)
          ) {
            // Usar a função logout do contexto
            logout();
            navigate("/");
          } else {
            setError("Erro ao carregar dados do seu perfil.");
          }
        } else {
          setError("Ocorreu um erro inesperado.");
        }

        setLoading(false);
      }
    };

    buscarDados();
  }, [navigate, logout]);

  const fetchAndUpdateOrders = useCallback(async (isPolling = false) => {
    if (!isPolling && activeTab !== 'pedidos') {
      // Se não for polling e a aba não for de pedidos, não faz nada (a menos que queiramos notificações em outras abas)
      // Para notificações em qualquer aba, remova ou ajuste esta condição.
      // Por ora, o polling buscará independentemente da aba ativa para notificar.
    }

    console.log(isPolling ? "Polling: Verificando pedidos..." : "Buscando todos os pedidos do fornecedor...");
    if (!isPolling) setLoadingPedidos(true); // Mostrar loading só na carga inicial da aba
    setErrorPedidos("");

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:3333/pedidos/fornecedor",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const fetchedPedidos: Pedido[] = response.data || [];

      // Lógica de notificação para NOVOS pedidos
      const newIncomingOrders = fetchedPedidos.filter(p => p.status === "NOVO");
      let newOrderDetectedThisPoll = false;
      let newOrdersAddedCount = 0;

      newIncomingOrders.forEach(newOrder => {
        if (!notifiedNewOrderIds.current.has(newOrder.id)) {
          newOrderDetectedThisPoll = true;
          notifiedNewOrderIds.current.add(newOrder.id);
          newOrdersAddedCount++;
          console.log(`Novo pedido processado para notificação: ID ${newOrder.id}`);
        }
      });

      if (newOrderDetectedThisPoll && newOrdersAddedCount > 0) {
        setToastMessage(`Novo(s) pedido(s) realizado(s)! (${newOrdersAddedCount})`);
        setShowToast(true);
        if (isSoundEnabled) { // Tocar som apenas se estiver habilitado
            playNotificationSound();
        }
        // Incrementar contador de não lidas se o dropdown estiver fechado
        if (!showNotificationDropdown) {
            setUnreadNotificationCount(prev => prev + newOrdersAddedCount);
        }
        setTimeout(() => {
          setShowToast(false);
        }, 5000);
      }

      // Lógica para atualizar o estado 'pedidos' (que alimenta o Kanban) de forma condicional
      let shouldUpdatePedidosState = false;
      if (fetchedPedidos.length !== pedidos.length) {
        shouldUpdatePedidosState = true;
        console.log("[Dashboard] Mudança detectada: número de pedidos diferente.");
      } else {
        const currentPedidosMap = new Map(pedidos.map(p => [p.id, p.status]));
        for (const fetchedP of fetchedPedidos) {
          if (!currentPedidosMap.has(fetchedP.id) || currentPedidosMap.get(fetchedP.id) !== fetchedP.status) {
            shouldUpdatePedidosState = true;
            console.log(`[Dashboard] Mudança detectada: pedido ${fetchedP.id} novo ou status alterado.`);
            break;
          }
        }
      }

      if (shouldUpdatePedidosState) {
        console.log("[Dashboard] Atualizando lista de pedidos para o Kanban.");
        setPedidos(fetchedPedidos);
      } else {
        console.log("[Dashboard] Sem mudanças relevantes para a lista de pedidos do Kanban. Estado não atualizado.");
      }

    } catch (err) {
      console.error("Erro ao buscar pedidos:", err);
      if (!isPolling) setErrorPedidos("Não foi possível carregar seus pedidos.");
    } finally {
      if (!isPolling) setLoadingPedidos(false);
    }
  }, [activeTab, isSoundEnabled, showNotificationDropdown, pedidos]);

  useEffect(() => {
    if (activeTab === 'pedidos') {
      // Adicionar um pequeno delay para a primeira busca de pedidos ao carregar a aba
      // para dar chance ao usuário de interagir com a página e desbloquear o áudio.
      console.log("Aba Pedidos ativa. Agendando primeira busca de pedidos em 2 segundos.");
      const timerId = setTimeout(() => {
        console.log("Executando primeira busca de pedidos após delay.");
        fetchAndUpdateOrders(false); // Carga inicial, não é polling
      }, 2000); // Delay de 2 segundos

      return () => clearTimeout(timerId); // Limpa o timeout se o componente desmontar ou activeTab mudar
    }
  }, [activeTab, fetchAndUpdateOrders]);

  useEffect(() => {
    console.log("Configurando polling para novos pedidos...");
    const intervalId = setInterval(() => {
      fetchAndUpdateOrders(true); // É uma chamada de polling
    }, 3000); // Verifica a cada 3 segundos

    return () => {
      console.log("Limpando polling de novos pedidos.");
      clearInterval(intervalId);
    }; // Limpa o intervalo quando o componente é desmontado
  }, [fetchAndUpdateOrders]);

  const pedidosFiltradosParaKanban = useMemo(() => {
    if (activeTab !== 'pedidos') return [];
    console.log(`Filtrando pedidos para o Kanban com data APLICADA: ${dataAplicadaStats}`);
    const filtrados = pedidos.filter(pedido => {
        const dataPedido = pedido.time_do_pedido.split('T')[0];
        return dataPedido === dataAplicadaStats;
    });
    console.log(`Pedidos filtrados para o Kanban (${dataAplicadaStats}):`, filtrados.length);
    return filtrados;
  }, [pedidos, dataAplicadaStats, activeTab]);

  const calcularMediaAvaliacoes = (avaliacoes: Avaliacao[]) => {
    if (avaliacoes.length === 0) return 0;
    const soma = avaliacoes.reduce((acc, av) => acc + av.nota, 0);
    return soma / avaliacoes.length;
  };

  const formatarPreco = (preco: number) => {
    return preco.toFixed(2).replace(".", ",");
  };

  const handleNovoPrato = () => {
    navigate("/dashboard/fornecedor/novo-prato");
  };

  const handleEditarPrato = (id: number) => {
    navigate(`/dashboard/fornecedor/editar-prato/${id}`);
  };

  const handleExcluirPrato = async (id: number) => {
    if (!window.confirm("Tem certeza que deseja excluir este prato?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3333/pratos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Atualizar a lista de pratos após excluir
      setPratos(pratos.filter((prato) => prato.id !== id));
    } catch (error) {
      console.error("Erro ao excluir prato:", error);
      alert("Erro ao excluir o prato.");
    }
  };

  // Função para renderizar estrelas
  const renderEstrelas = (nota: number) => {
    const estrelas = [];
    const notaArredondada = Math.round(nota);

    for (let i = 1; i <= 5; i++) {
      if (i <= notaArredondada) {
        estrelas.push(<FaStar key={i} className="text-yellow-400" />);
      } else {
        estrelas.push(<FaRegStar key={i} className="text-yellow-400" />);
      }
    }

    return <div className="flex">{estrelas}</div>;
  };

  // Formatar data
  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Calcular total de avaliações de todos os pratos
  const calcularTotalAvaliacoes = () => {
    return pratos.reduce((total, prato) => total + prato.avaliacoes.length, 0);
  };

  // Buscar pratos com avaliações
  const buscarPratosComAvaliacoes = () => {
    const filtrados = pratos.filter((prato) => prato.avaliacoes.length > 0);
    setPratosComAvaliacoes(filtrados);
    setMostrarAvaliacoes(true);
    setActiveTab("avaliacoes");
  };

  // Calcular estatísticas
  const calcularEstatisticas = () => {
    const totalPratos = pratos.length;
    const pratosDisponiveis = pratos.filter((prato) => prato.disponivel).length;
    const totalAvaliacoes = calcularTotalAvaliacoes();
    const mediaPratos =
      totalPratos > 0
        ? pratos.reduce((acc, prato) => acc + prato.preco, 0) / totalPratos
        : 0;

    return {
      totalPratos,
      pratosDisponiveis,
      totalAvaliacoes,
      mediaPratos,
    };
  };

  // Modificar/renomear esta função para calcular as estatísticas de pedidos e pratos
  const calcularEstatisticasVisor = useCallback(() => {
    const totalPratos = pratos.length;
    const pratosDisponiveis = pratos.filter((prato) => prato.disponivel).length;
    const mediaPrecoPratos = totalPratos > 0
        ? pratos.reduce((acc, prato) => acc + prato.preco, 0) / totalPratos
        : 0;

    const pedidosFiltradosStats = pedidos.filter(pedido => {
        const dataPedido = pedido.time_do_pedido.split('T')[0];
        return dataPedido === dataAplicadaStats; // USA dataAplicadaStats
    });

    const totalPedidosDia = pedidosFiltradosStats.length;
    const totalVendasDia = pedidosFiltradosStats.reduce((sum, pedido) => sum + pedido.valor_total, 0);

    return {
      totalPratos,
      pratosDisponiveis,
      mediaPrecoPratos,
      totalPedidosDia,
      totalVendasDia,
    };
  }, [pratos, pedidos, dataAplicadaStats]); // Depende de dataAplicadaStats

  // Função para mudar o status do pedido
  const handleChangeStatusPedido = async (pedidoId: number, novoStatus: string) => {
    console.log(`Dashboard: Mudando status do pedido ${pedidoId} para ${novoStatus}`);
    try {
        const token = localStorage.getItem("token");
        // Corrigir o nome da chave no corpo da requisição para "novoStatus"
        await axios.put(`http://localhost:3333/pedidos/fornecedor/${pedidoId}/status`, 
            { novoStatus: novoStatus }, // Alterado de { status: novoStatus } para { novoStatus: novoStatus }
            { headers: { Authorization: `Bearer ${token}` } }
        );
        setPedidos(prevPedidos => 
            prevPedidos.map(p => p.id === pedidoId ? { ...p, status: novoStatus } : p)
        );
        console.log(`Status do pedido #${pedidoId} atualizado para ${novoStatus.replace('_', ' ')} com sucesso!`);
    } catch (error) {
        console.error("Erro ao mudar status do pedido:", error);
        setErrorPedidos("Erro ao atualizar status do pedido.");
        // Você pode querer extrair a mensagem de erro específica do backend aqui, se disponível
        // if (axios.isAxiosError(error) && error.response?.data?.error) {
        //   setErrorPedidos(error.response.data.error);
        // } else {
        //   setErrorPedidos("Erro ao atualizar status do pedido.");
        // }
    }
  };
  
  // Função para agrupar pedidos por status para o Kanban
  const agruparPedidosPorStatus = useCallback((pedidosParaAgrupar: Pedido[]): Record<string, Pedido[]> => {
    console.log("Agrupando pedidos para o Kanban:", pedidosParaAgrupar.length);
    return pedidosParaAgrupar.reduce((acc, pedido) => {
      const { status } = pedido;
      if (!acc[status]) {
        acc[status] = [];
      }
      acc[status].push(pedido);
      return acc;
    }, {} as Record<string, Pedido[]>);
  }, []);

  // Adicionar um novo useMemo para a contagem de novos pedidos filtrados por data
  const novosPedidosFiltradosCount = useMemo(() => {
    if (activeTab !== 'pedidos') return 0;
    return pedidosFiltradosParaKanban.filter(p => p.status === "NOVO").length;
  }, [pedidosFiltradosParaKanban, activeTab]);

  // Novas funções para aplicar e limpar filtro
  const handleAplicarFiltro = () => {
    console.log(`Aplicando filtro para data: ${dataFiltroStats}`);
    setDataAplicadaStats(dataFiltroStats);
  };

  const handleLimparFiltro = () => {
    const hoje = new Date().toISOString().split('T')[0];
    console.log("Limpando filtro, voltando para data de hoje:", hoje);
    setDataFiltroStats(hoje);
    setDataAplicadaStats(hoje);
  };

  function playNotificationSound() {
    if (!isSoundEnabled) {
        console.log("Som de notificação desabilitado pelo usuário.");
        return;
    }
    audioPlayer.current?.play().catch(error => console.log("Erro ao tocar som de notificação:", error));
  }

  const stats = calcularEstatisticasVisor();

  const notificacoesDoDiaParaDropdown = useMemo(() => {
    if (activeTab !== 'pedidos') return [];
    // Filtra pedidos com status "NOVO" da data aplicada
    return pedidosFiltradosParaKanban.filter(p => p.status === "NOVO")
      .sort((a, b) => new Date(b.time_do_pedido).getTime() - new Date(a.time_do_pedido).getTime()); // Ordena mais recentes primeiro
  }, [pedidosFiltradosParaKanban, activeTab]);

  const toggleNotificationDropdown = () => {
    setShowNotificationDropdown(prev => !prev);
    if (!showNotificationDropdown) { // Se está abrindo o dropdown
      setUnreadNotificationCount(0); // Marca como lidas
    }
  };

  // Efeito para persistir a preferência de som
  useEffect(() => {
    console.log('[Dashboard] Salvando preferência de som no localStorage:', isSoundEnabled);
    localStorage.setItem('notificationSoundEnabled', JSON.stringify(isSoundEnabled));
  }, [isSoundEnabled]);

  if (loading && activeTab !== 'pedidos') return <div className="flex justify-center items-center h-screen"><p>Carregando dados do fornecedor...</p></div>;
  if (error) return <div className="text-red-500 text-center p-4">Erro: {error}</div>;
  if (!fornecedor && !loading) return <div className="text-center p-4">Nenhum dado de fornecedor encontrado.</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 relative">
      {/* Áudio Player Escondido */}
      <audio ref={audioPlayer} src="/sounds/new-notification-3-323602.mp3" preload="auto"></audio>

      {/* Notificação Toast */}
      {showToast && (
        <div className="fixed top-5 right-5 bg-green-500 text-white p-4 rounded-lg shadow-xl z-50 flex items-center animate-fadeInUp">
          <FaInfoCircle className="mr-3 text-2xl" />
          <span>{toastMessage}</span>
          <button 
            onClick={() => setShowToast(false)} 
            className="ml-4 text-white hover:text-gray-200"
          >
            <FaTimes />
          </button>
        </div>
      )}

      {/* Header modernizado */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
                <div className="w-8 h-8 rounded-md bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white mr-2 shadow-sm">
                  <FaUtensils />
                </div>
                Dashboard Fornecedor
                {fornecedor?.assinaturaAtiva ? (
                  <span className="ml-3 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border border-green-200 dark:border-green-800/40">
                    <FaCheck className="mr-1" /> Assinatura Ativa
                  </span>
                ) : (
                  <span className="ml-3 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800/40">
                    <FaTimes className="mr-1" /> Assinatura Inativa
                  </span>
                )}
              </h1>
            </div>
            <div className="flex items-center space-x-3 relative">
              {/* Botão de Sino de Notificações */}
              <div className="relative">
                <button
                  ref={notificationBellRef}
                  onClick={toggleNotificationDropdown}
                  className={`p-2 rounded-lg transition-colors
                              ${unreadNotificationCount > 0 
                                ? 'text-yellow-500 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-700/50' 
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                  title="Notificações"
                >
                  {unreadNotificationCount > 0 ? <FaBell className="h-5 w-5" /> : <FaRegBell className="h-5 w-5" />}
                  {unreadNotificationCount > 0 && (
                    <span className="absolute top-0 right-0 block h-2 w-2 transform -translate-y-1/2 translate-x-1/2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800"></span>
                  )}
                </button>

                {/* Dropdown de Notificações */}
                {showNotificationDropdown && (
                  <div
                    ref={notificationDropdownRef}
                    className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border dark:border-gray-700 z-50 overflow-hidden"
                  >
                    <div className="p-4 border-b dark:border-gray-700">
                      <h3 className="text-base font-semibold text-gray-800 dark:text-white">Notificações de Hoje</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Exibindo novos pedidos para {new Date(dataAplicadaStats + 'T00:00:00').toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notificacoesDoDiaParaDropdown.length === 0 ? (
                        <p className="p-4 text-sm text-gray-500 dark:text-gray-400 text-center">Nenhuma nova notificação para hoje.</p>
                      ) : (
                        notificacoesDoDiaParaDropdown.map((pedido) => (
                          <div key={pedido.id} className="p-3 border-b dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                            <p className="text-xs text-gray-700 dark:text-gray-200">
                              <span className="font-medium">Pedido #{pedido.id}</span> - {pedido.prato?.nome || 'Detalhes indisponíveis'}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Recebido às {new Date(pedido.time_do_pedido).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="p-3 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                        <label htmlFor="soundToggle" className="flex items-center cursor-pointer">
                            <div className="relative">
                                <input 
                                    type="checkbox" 
                                    id="soundToggle" 
                                    className="sr-only" 
                                    checked={isSoundEnabled}
                                    onChange={() => setIsSoundEnabled(!isSoundEnabled)}
                                />
                                <div className="block bg-gray-300 dark:bg-gray-600 w-10 h-5 rounded-full"></div>
                                <div className={`dot absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-transform ${isSoundEnabled ? 'translate-x-5 bg-green-500' : 'bg-gray-400'}`}></div>
                            </div>
                            <div className="ml-3 text-xs text-gray-700 dark:text-gray-300 font-medium">
                                Ativar som de notificação
                            </div>
                        </label>
                    </div>
                  </div>
                )}
              </div>
              {/* Fim Botão de Sino */}

              <button
                onClick={() => (window.location.href = "/")}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Ir para o site"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
              </button>
              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="flex items-center space-x-1 text-sm px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium"
              >
                <FaSignOutAlt className="text-gray-500 dark:text-gray-400" />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <aside className="hidden md:flex md:flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4">
          <div className="mb-6">
            {fornecedor && (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
                  {fornecedor.logo ? (
                    <img
                      src={fornecedor.logo}
                      alt={fornecedor.nome}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-400 to-green-600 text-white">
                      {fornecedor.nome.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {fornecedor.nome}
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {fornecedor.email}
                  </p>
                </div>
              </div>
            )}
          </div>

          <nav className="flex-1 space-y-1">
            <button
              onClick={() => {
                setActiveTab("pratos");
                setMostrarAvaliacoes(false);
              }}
              className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                activeTab === "pratos"
                  ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 font-medium"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <FaUtensils
                className={
                  activeTab === "pratos"
                    ? "text-green-500 dark:text-green-400"
                    : "text-gray-500 dark:text-gray-400"
                }
              />
              <span>Meus Pratos</span>
            </button>

            <button
              onClick={buscarPratosComAvaliacoes}
              className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                activeTab === "avaliacoes"
                  ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 font-medium"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
              disabled={calcularTotalAvaliacoes() === 0}
            >
              <FaComments
                className={
                  activeTab === "avaliacoes"
                    ? "text-green-500 dark:text-green-400"
                    : "text-gray-500 dark:text-gray-400"
                }
              />
              <span>Avaliações</span>
              {calcularTotalAvaliacoes() > 0 && (
                <span className="ml-auto inline-flex items-center justify-center w-5 h-5 text-xs bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-400 rounded-full font-medium">
                  {calcularTotalAvaliacoes()}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("pedidos")}
              className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                activeTab === "pedidos"
                  ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 font-medium"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <FaClipboardList
                className={
                  activeTab === "pedidos"
                    ? "text-green-500 dark:text-green-400"
                    : "text-gray-500 dark:text-gray-400"
                }
              />
              <span>Pedidos</span>
              {activeTab === 'pedidos' && novosPedidosFiltradosCount > 0 && (
                <span className="ml-auto inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1 text-xs bg-red-500 text-white rounded-full font-medium">
                  {novosPedidosFiltradosCount} Novo(s)
                </span>
              )}
            </button>

            <button
              onClick={() => setShowProfileModal(true)}
              className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <FaUserEdit className="text-gray-500 dark:text-gray-400" />
              <span>Editar Perfil</span>
            </button>

            <button
              onClick={() => navigate("/dashboard/fornecedor/assinatura")}
              className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg ${
                fornecedor?.assinaturaAtiva
                  ? "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  : "text-yellow-700 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 font-medium"
              } transition-colors`}
            >
              <FaTag
                className={
                  fornecedor?.assinaturaAtiva
                    ? "text-gray-500 dark:text-gray-400"
                    : "text-yellow-500 dark:text-yellow-400"
                }
              />
              <span>
                {fornecedor?.assinaturaAtiva
                  ? "Gerenciar Assinatura"
                  : "Ativar Assinatura"}
              </span>
            </button>
          </nav>

          <div className="pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 text-xs text-gray-600 dark:text-gray-300">
              <p className="font-medium text-green-800 dark:text-green-400 mb-1">
                Dica do dia
              </p>
              <p>
                Mantenha suas descrições detalhadas e atualize suas fotos
                regularmente para atrair mais clientes.
              </p>
            </div>
          </div>
        </aside>

        {/* Conteúdo Principal */}
        <main className="flex-1 p-6 overflow-auto">
          {/* Cabeçalho e Boas-vindas - AJUSTADO PARA MENOS DESTAQUE */}
          <div className="mb-4">
            <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300">
              {fornecedor
                ? `Olá, ${fornecedor.nome.split(" ")[0]}!`
                : "Carregando..."}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Bem-vindo ao seu painel de controle.
            </p>
          </div>

          {/* Estatísticas e Filtro de Data - Renderização Condicional */}
          {(activeTab === "pratos" || activeTab === "avaliacoes") && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
              {/* Card Total de Pratos */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow p-5 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400">
                    <FaUtensils className="text-xl" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total de Pratos</h3>
                    <div className="mt-1 flex items-baseline">
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.totalPratos}</p>
                      {stats.totalPratos > 0 && stats.pratosDisponiveis < stats.totalPratos && (
                        <p className="ml-2 text-xs text-red-600 dark:text-red-400">
                          {stats.totalPratos - stats.pratosDisponiveis} indisponível
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {/* Card Pratos Disponíveis */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow p-5 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                    <FaCheck className="text-xl" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Disponíveis</h3>
                    <div className="mt-1 flex items-baseline">
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.pratosDisponiveis}</p>
                      {stats.totalPratos > 0 && (
                        <p className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                          de {stats.totalPratos} ({Math.round((stats.pratosDisponiveis / stats.totalPratos) * 100)}%)
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {/* Card Total de Avaliações (já existente na função calcularEstatisticasVisor, só precisa ser chamado) */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow p-5 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400">
                    <FaStar className="text-xl" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Avaliações</h3>
                    <div className="mt-1 flex items-baseline">
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white">{calcularTotalAvaliacoes()}</p> {/* Usar a função original para contagem simples */}
                      {calcularTotalAvaliacoes() > 0 && (
                        <button
                          onClick={buscarPratosComAvaliacoes}
                          className="ml-2 text-xs text-blue-600 dark:text-blue-400 flex items-center hover:underline"
                        >
                          Ver todas <FaChevronRight className="h-3 w-3 ml-1" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {/* Card Preço Médio dos Pratos */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow p-5 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">
                    <FaTag className="text-xl" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Preço Médio (Pratos)</h3>
                    <div className="mt-1">
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white">R$ {stats.mediaPrecoPratos.toFixed(2).replace(".", ",")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "pedidos" && (
            <>
              {/* Filtro de Data para Estatísticas de Pedidos - LARGURA DO INPUT AJUSTADA */}
              <div className="mb-4 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-xs border border-gray-200 dark:border-gray-700/60">
                <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-2 space-y-2 sm:space-y-0">
                  <div>
                    <label htmlFor="dataFiltroStats" className="block text-xs font-normal text-gray-600 dark:text-gray-400 mb-1">
                      Filtrar por data:
                    </label>
                    <input 
                        type="date" 
                        id="dataFiltroStats" 
                        name="dataFiltroStats"
                        value={dataFiltroStats}
                        onChange={(e) => setDataFiltroStats(e.target.value)}
                        className="inline-block w-44 pl-3 pr-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-xs"
                    />
                  </div>
                  <button
                    onClick={handleAplicarFiltro}
                    className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-md text-xs font-medium shadow-sm transition-colors w-full sm:w-auto whitespace-nowrap"
                  >
                    Aplicar Filtro
                  </button>
                  <button
                    onClick={handleLimparFiltro}
                    className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md text-xs font-medium shadow-sm transition-colors w-full sm:w-auto whitespace-nowrap"
                  >
                    Limpar Filtro
                  </button>
                </div>
              </div>
              
              {/* Cards de estatísticas de PEDIDOS - Atualizar data exibida */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-4 mb-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow p-5 border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                      <FaClipboardList className="text-xl" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Total de Pedidos ({new Date(dataAplicadaStats + 'T00:00:00').toLocaleDateString('pt-BR')})
                      </h3>
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {stats.totalPedidosDia}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow p-5 border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400">
                      <FaDollarSign className="text-xl" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Total de Vendas ({new Date(dataAplicadaStats + 'T00:00:00').toLocaleDateString('pt-BR')})
                      </h3>
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                        R$ {stats.totalVendasDia.toFixed(2).replace('.', ',')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Conteúdo da Tab (Barra de abas interna e conteúdo específico da aba) */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            {/* Cabeçalho da Tab com botões (Meus Pratos, Avaliações, Pedidos) */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <div className="px-6 flex space-x-4 overflow-x-auto">
                {(activeTab === "pratos" || activeTab === "avaliacoes") && (
                  <>
                    <button
                      onClick={() => {
                        setActiveTab("pratos");
                        setMostrarAvaliacoes(false);
                      }}
                      className={`py-4 px-1 relative font-medium text-sm whitespace-nowrap ${
                        activeTab === "pratos"
                          ? "text-green-600 dark:text-green-400"
                          : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                      } focus:outline-none`}
                    >
                      <span className="flex items-center">
                        <FaUtensils className="mr-2" /> Meus Pratos
                      </span>
                      {activeTab === "pratos" && (
                        <span className="absolute inset-x-0 bottom-0 h-0.5 bg-green-600 dark:bg-green-400"></span>
                      )}
                    </button>

                    {calcularTotalAvaliacoes() > 0 && (
                      <button
                        onClick={buscarPratosComAvaliacoes}
                        className={`py-4 px-1 relative font-medium text-sm whitespace-nowrap ${
                          activeTab === "avaliacoes"
                            ? "text-green-600 dark:text-green-400"
                            : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                        } focus:outline-none`}
                      >
                        <span className="flex items-center">
                          <FaComments className="mr-2" /> Avaliações
                          <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                            {calcularTotalAvaliacoes()}
                          </span>
                        </span>
                        {activeTab === "avaliacoes" && (
                          <span className="absolute inset-x-0 bottom-0 h-0.5 bg-green-600 dark:bg-green-400"></span>
                        )}
                      </button>
                    )}
                  </>
                )}

                {activeTab === "pedidos" && (
                  <button
                    onClick={() => {
                      setActiveTab("pedidos");
                      setMostrarAvaliacoes(false);
                    }}
                    className={`py-4 px-1 relative font-medium text-sm whitespace-nowrap ${
                      activeTab === "pedidos"
                        ? "text-green-600 dark:text-green-400"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                    } focus:outline-none`}
                  >
                    <span className="flex items-center">
                      <FaClipboardList className="mr-2" /> Gerenciar Pedidos
                    </span>
                    {novosPedidosFiltradosCount > 0 && (
                      <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400">
                        {novosPedidosFiltradosCount} Novo(s)
                      </span>
                    )}
                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-green-600 dark:bg-green-400"></span>
                  </button>
                )}
              </div>
            </div>

            {/* Conteúdo da Tab atual */}
            <div className="p-6 min-h-[400px]">
              {activeTab === "pratos" && (
                <div id="pratos-content">
                  {/* Cabeçalho com ações (apenas para pratos) */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 sm:mb-0">Meus Pratos</h3>
                    <button
                      onClick={handleNovoPrato}
                      className="flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-sm transition-colors"
                    >
                      <FaPlus className="mr-2" /> Novo Prato
                    </button>
                  </div>
                  {/* Placeholder para a lista de pratos */}
                  {loading && pratos.length === 0 && <p className="text-center text-gray-500 dark:text-gray-400 py-4">Carregando pratos...</p>}
                  {!loading && pratos.length === 0 && <p className="text-center text-gray-500 dark:text-gray-400 py-4">Nenhum prato cadastrado ainda. Clique em "Novo Prato" para começar.</p>}
                  {pratos.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {pratos.map((prato) => (
                            <div key={prato.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
                                {prato.imagem && <img src={prato.imagem} alt={prato.nome} className="w-full h-48 object-cover"/>}
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 truncate" title={prato.nome}>{prato.nome}</h3>
                                    <p className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">R$ {prato.preco.toFixed(2).replace('.', ',')}</p>
                                    <p className={`text-sm font-medium ${prato.disponivel ? 'text-green-500' : 'text-red-500'} mb-3`}>
                                        {prato.disponivel ? 'Disponível' : 'Indisponível'}
                                    </p>
                                    <div className="flex justify-between space-x-2">
                                        <button onClick={() => handleEditarPrato(prato.id)} className="flex-1 py-2 px-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md shadow-sm text-xs font-medium flex items-center justify-center"><FaEdit className="mr-1.5"/> Editar</button>
                                        <button onClick={() => handleExcluirPrato(prato.id)} className="flex-1 py-2 px-3 bg-red-600 hover:bg-red-700 text-white rounded-md shadow-sm text-xs font-medium flex items-center justify-center"><FaTrash className="mr-1.5" /> Excluir</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "avaliacoes" && (
                <div id="avaliacoes-content">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 sm:mb-0">Avaliações dos Clientes</h3>
                  </div>
                  {/* Placeholder para avaliações */}
                  {pratosComAvaliacoes.length === 0 && <p>Nenhuma avaliação para mostrar.</p>}
                  {pratosComAvaliacoes.length > 0 && <p>{pratosComAvaliacoes.length} pratos com avaliações (conteúdo omitido para teste)</p>}
                  {/* AQUI IRIA O MAPEAMENTO E RENDERIZAÇÃO DAS AVALIAÇÕES COMPLETAS */}
                </div>
              )}

              {activeTab === "pedidos" && (
                <RenderPedidosKanban
                  pedidosAgrupados={agruparPedidosPorStatus(pedidosFiltradosParaKanban)}
                  loading={loadingPedidos}
                  error={errorPedidos}
                  onMudarStatus={handleChangeStatusPedido}
                />
              )}
            </div>
          </div>
        </main>
      </div>

      <Footer />

      {showProfileModal && (
        <UserProfileModal onClose={() => setShowProfileModal(false)} />
      )}
    </div>
  );
};

export default FornecedorDashboard;
