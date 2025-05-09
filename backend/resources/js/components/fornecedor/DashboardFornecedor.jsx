import { useState, useEffect } from "react";
import {
    FiUser,
    FiList,
    FiPlusCircle,
    FiLogOut,
    FiStar,
    FiShoppingBag,
    FiTrendingUp,
    FiDollarSign,
    FiAlertCircle,
    FiCalendar,
    FiBarChart2,
    FiMessageSquare,
    FiChevronDown,
    FiSettings,
} from "react-icons/fi";
import AdicionarPrato from "./AdicionarPrato";
import MeusPratos from "./MeusPratos";
import EditarPerfil from "./EditarPerfil";
import AvaliacoesPratos from "./AvaliacoesPratos";
import PropTypes from "prop-types";

const DashboardFornecedor = ({
    onLogout,
    usuario: usuarioProps,
    onChangeTab,
    tabAtiva: tabAtivaExterna,
}) => {
    // Usar tabAtiva externa se fornecida, caso contrário usar o estado local
    const [tabAtiva, setTabAtiva] = useState(tabAtivaExterna || "meus-pratos");
    const [isLoading, setIsLoading] = useState(true);
    const [periodoStats, setPeriodoStats] = useState("semanal");
    const [menuAberto, setMenuAberto] = useState(false);

    // Atualizar tabAtiva quando a prop externa mudar
    useEffect(() => {
        if (tabAtivaExterna) {
            setTabAtiva(tabAtivaExterna);
        }
    }, [tabAtivaExterna]);

    // Combinar dados do usuário recebidos com os dados mock padrão
    const usuario = {
        nome:
            usuarioProps?.nome ||
            usuarioProps?.nome_completo ||
            "Restaurante Saudável",
        email: usuarioProps?.email || "contato@restaurantesaudavel.com",
        telefone: usuarioProps?.telefone || "(11) 99999-9999",
        dataCadastro:
            usuarioProps?.dataCadastro ||
            usuarioProps?.created_at ||
            "01/01/2023",
        endereco: usuarioProps?.endereco || "Av. Paulista, 1000",
        cidade: usuarioProps?.cidade || "São Paulo",
        estado: usuarioProps?.estado || "SP",
        cep: usuarioProps?.cep || "01310-100",
        fotoPerfil: usuarioProps?.fotoPerfil || "/img/menu1.jpg", // Usando uma imagem que já existe no projeto
        plano: usuarioProps?.plano || "Premium",
        statusAssinatura: usuarioProps?.statusAssinatura || "Ativo",
        proximaCobranca: usuarioProps?.proximaCobranca || "15/07/2023",
    };

    // Mock de estatísticas do restaurante
    const estatisticas = {
        semanal: {
            pedidos: 27,
            faturamento: "R$ 1.890,00",
            avaliacao: 4.8,
            crescimento: "+12%",
        },
        mensal: {
            pedidos: 124,
            faturamento: "R$ 8.750,00",
            avaliacao: 4.7,
            crescimento: "+8%",
        },
        anual: {
            pedidos: 1450,
            faturamento: "R$ 102.500,00",
            avaliacao: 4.6,
            crescimento: "+35%",
        },
    };

    // Mock de pedidos recentes
    const pedidosRecentes = [
        {
            id: "#PED7823",
            cliente: "Ana Silva",
            prato: "Salada Caesar de Frango",
            valor: "R$ 34,90",
            status: "Entregue",
            data: "Hoje, 14:30",
            imgPrato: "/img/menu1.jpg",
        },
        {
            id: "#PED7822",
            cliente: "Carlos Mendes",
            prato: "Bowl de Quinoa com Frango",
            valor: "R$ 39,90",
            status: "Em preparo",
            data: "Hoje, 13:15",
            imgPrato: "/img/menu2.jpg",
        },
        {
            id: "#PED7821",
            cliente: "Mariana Costa",
            prato: "Wrap Vegano de Grão-de-Bico",
            valor: "R$ 29,90",
            status: "Confirmado",
            data: "Hoje, 11:20",
            imgPrato: "/img/img4.jpg",
        },
        {
            id: "#PED7820",
            cliente: "Pedro Alves",
            prato: "Poke de Atum",
            valor: "R$ 42,90",
            status: "Entregue",
            data: "Ontem, 19:45",
            imgPrato: "/img/menu2.jpg",
        },
    ];

    // Mock de avaliações recentes
    const avaliacoesRecentes = [
        {
            id: 1,
            cliente: "Fernanda Lima",
            prato: "Salada Caesar de Frango",
            avaliacao: 5,
            comentario:
                "Simplesmente delicioso e fresco. Entregas sempre pontuais!",
            data: "Hoje, 10:30",
            fotoPerfil: "/img/pic1.png",
        },
        {
            id: 2,
            cliente: "Ricardo Souza",
            prato: "Bowl Vegano Proteico",
            avaliacao: 4,
            comentario:
                "Muito saboroso, mas poderia ter um pouco mais de tofu.",
            data: "Ontem, 18:15",
            fotoPerfil: "/img/pic2.png",
        },
    ];

    // Simulando carregamento inicial
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    // Função para mudar a tab ativa
    const handleTabChange = (tab) => {
        setTabAtiva(tab);
        // Se onChangeTab for fornecido, notificar o componente pai
        if (typeof onChangeTab === "function") {
            onChangeTab(tab);
        }
    };

    // Componente para o Dashboard Home
    const DashboardHome = () => (
        <div className="space-y-6">
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                    Painel de Controle
                </h2>

                {/* Seletor de período */}
                <div className="flex items-center mb-4">
                    <span className="text-sm text-gray-600 mr-3">
                        Mostrar estatísticas:
                    </span>
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        <button
                            className={`px-3 py-1 text-sm rounded-md transition-all ${
                                periodoStats === "semanal"
                                    ? "bg-white shadow-sm text-gray-800"
                                    : "text-gray-600 hover:bg-gray-200"
                            }`}
                            onClick={() => setPeriodoStats("semanal")}
                        >
                            Semanal
                        </button>
                        <button
                            className={`px-3 py-1 text-sm rounded-md transition-all ${
                                periodoStats === "mensal"
                                    ? "bg-white shadow-sm text-gray-800"
                                    : "text-gray-600 hover:bg-gray-200"
                            }`}
                            onClick={() => setPeriodoStats("mensal")}
                        >
                            Mensal
                        </button>
                        <button
                            className={`px-3 py-1 text-sm rounded-md transition-all ${
                                periodoStats === "anual"
                                    ? "bg-white shadow-sm text-gray-800"
                                    : "text-gray-600 hover:bg-gray-200"
                            }`}
                            onClick={() => setPeriodoStats("anual")}
                        >
                            Anual
                        </button>
                    </div>
                </div>

                {/* Cards de estatísticas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 shadow-sm border border-green-200">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">
                                    Total de Pedidos
                                </p>
                                <h3 className="text-2xl font-bold text-gray-800 mt-1">
                                    {estatisticas[periodoStats].pedidos}
                                </h3>
                                <p className="text-xs text-green-600 font-medium mt-1">
                                    {estatisticas[periodoStats].crescimento} do
                                    período anterior
                                </p>
                            </div>
                            <div className="bg-green-500 rounded-lg p-2 text-white">
                                <FiShoppingBag size={22} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 shadow-sm border border-blue-200">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">
                                    Faturamento
                                </p>
                                <h3 className="text-2xl font-bold text-gray-800 mt-1">
                                    {estatisticas[periodoStats].faturamento}
                                </h3>
                                <p className="text-xs text-blue-600 font-medium mt-1">
                                    {estatisticas[periodoStats].crescimento} do
                                    período anterior
                                </p>
                            </div>
                            <div className="bg-blue-500 rounded-lg p-2 text-white">
                                <FiDollarSign size={22} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-5 shadow-sm border border-yellow-200">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">
                                    Avaliação Média
                                </p>
                                <h3 className="text-2xl font-bold text-gray-800 mt-1">
                                    {estatisticas[periodoStats].avaliacao}{" "}
                                    <span className="text-sm text-yellow-500">
                                        ★
                                    </span>
                                </h3>
                                <p className="text-xs text-yellow-600 font-medium mt-1">
                                    Baseado em{" "}
                                    {estatisticas[periodoStats].pedidos} pedidos
                                </p>
                            </div>
                            <div className="bg-yellow-500 rounded-lg p-2 text-white">
                                <FiStar size={22} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 shadow-sm border border-purple-200">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">
                                    Crescimento
                                </p>
                                <h3 className="text-2xl font-bold text-gray-800 mt-1">
                                    {estatisticas[periodoStats].crescimento}
                                </h3>
                                <p className="text-xs text-purple-600 font-medium mt-1">
                                    Comparado ao último período
                                </p>
                            </div>
                            <div className="bg-purple-500 rounded-lg p-2 text-white">
                                <FiTrendingUp size={22} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Pedidos Recentes */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="bg-gray-50 px-5 py-4 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                            <h3 className="font-medium text-gray-800">
                                Pedidos Recentes
                            </h3>
                            <button
                                className="text-green-600 hover:text-green-700 text-sm font-medium transition-colors flex items-center"
                                onClick={() => handleTabChange("pedidos")}
                            >
                                Ver todos{" "}
                                <FiChevronDown className="ml-1" size={14} />
                            </button>
                        </div>
                    </div>

                    <div className="divide-y divide-gray-100">
                        {pedidosRecentes.map((pedido) => (
                            <div
                                key={pedido.id}
                                className="p-4 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="hidden sm:block">
                                        <img
                                            src={pedido.imgPrato}
                                            alt={pedido.prato}
                                            className="w-12 h-12 rounded-lg object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between">
                                            <p className="font-medium text-gray-800">
                                                {pedido.prato}
                                            </p>
                                            <p className="font-medium text-green-600">
                                                {pedido.valor}
                                            </p>
                                        </div>
                                        <div className="flex justify-between mt-1">
                                            <p className="text-sm text-gray-500">
                                                Cliente: {pedido.cliente}
                                            </p>
                                            <span
                                                className={`text-xs px-2 py-0.5 rounded-full ${
                                                    pedido.status === "Entregue"
                                                        ? "bg-green-100 text-green-800"
                                                        : pedido.status ===
                                                          "Em preparo"
                                                        ? "bg-yellow-100 text-yellow-800"
                                                        : "bg-blue-100 text-blue-800"
                                                }`}
                                            >
                                                {pedido.status}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {pedido.data}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {pedidosRecentes.length === 0 && (
                        <div className="p-8 text-center">
                            <p className="text-gray-500">
                                Nenhum pedido recente encontrado.
                            </p>
                        </div>
                    )}
                </div>

                {/* Avaliações Recentes */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="bg-gray-50 px-5 py-4 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                            <h3 className="font-medium text-gray-800">
                                Avaliações Recentes
                            </h3>
                            <button
                                className="text-green-600 hover:text-green-700 text-sm font-medium transition-colors flex items-center"
                                onClick={() => handleTabChange("avaliacoes")}
                            >
                                Ver todas{" "}
                                <FiChevronDown className="ml-1" size={14} />
                            </button>
                        </div>
                    </div>

                    <div className="divide-y divide-gray-100">
                        {avaliacoesRecentes.map((avaliacao) => (
                            <div
                                key={avaliacao.id}
                                className="p-4 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex gap-3">
                                    <img
                                        src={avaliacao.fotoPerfil}
                                        alt={avaliacao.cliente}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <div className="flex-1">
                                        <div className="flex justify-between">
                                            <p className="font-medium text-gray-800">
                                                {avaliacao.cliente}
                                            </p>
                                            <div className="flex text-yellow-400">
                                                {[...Array(5)].map((_, i) => (
                                                    <span key={i}>
                                                        {i < avaliacao.avaliacao
                                                            ? "★"
                                                            : "☆"}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {avaliacao.prato}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {avaliacao.comentario}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {avaliacao.data}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {avaliacoesRecentes.length === 0 && (
                        <div className="p-8 text-center">
                            <p className="text-gray-500">
                                Nenhuma avaliação recente encontrada.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Status da Assinatura */}
            <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-xl p-6 text-white shadow-md">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-bold mb-1">
                            Assinatura {usuario.plano}
                        </h3>
                        <p className="opacity-90">
                            Status: {usuario.statusAssinatura}
                        </p>
                        <p className="text-sm opacity-80 mt-1">
                            Próxima cobrança: {usuario.proximaCobranca}
                        </p>
                    </div>
                    <button className="bg-white text-green-600 px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors">
                        Gerenciar Plano
                    </button>
                </div>
            </div>
        </div>
    );

    const renderizarConteudo = () => {
        if (isLoading) {
            return (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                </div>
            );
        }

        switch (tabAtiva) {
            case "dashboard":
                return <DashboardHome />;
            case "adicionar-prato":
                return <AdicionarPrato />;
            case "meus-pratos":
                return <MeusPratos />;
            case "editar-perfil":
                return <EditarPerfil usuario={usuario} />;
            case "avaliacoes":
                return <AvaliacoesPratos />;
            case "pedidos":
                // Este componente pode ser implementado posteriormente
                return (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
                        <div className="flex items-center gap-2">
                            <FiAlertCircle />
                            <p>Página de pedidos em desenvolvimento.</p>
                        </div>
                    </div>
                );
            default:
                return <DashboardHome />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-gradient-to-r from-green-600 to-green-500 text-white py-4 shadow-lg sticky top-0 z-20">
                <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
                    <div className="flex items-center">
                        <h1 className="text-2xl font-bold">
                            LeveFit{" "}
                            <span className="text-sm font-medium opacity-75">
                                Fornecedor
                            </span>
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-3">
                            <div className="bg-white bg-opacity-10 py-1 px-3 rounded-full text-sm">
                                {usuario.plano}
                            </div>
                        </div>
                        <div className="relative">
                            <button
                                onClick={() => setMenuAberto(!menuAberto)}
                                className="flex items-center gap-2 focus:outline-none"
                            >
                                <img
                                    src={usuario.fotoPerfil}
                                    alt="Perfil"
                                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md"
                                />
                                <span className="hidden md:block font-medium">
                                    {usuario.nome}
                                </span>
                                <FiChevronDown size={16} />
                            </button>

                            {menuAberto && (
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg overflow-hidden z-30">
                                    <div className="p-4 border-b border-gray-100">
                                        <p className="font-medium text-gray-800">
                                            {usuario.nome}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {usuario.email}
                                        </p>
                                    </div>
                                    <ul>
                                        <li>
                                            <button
                                                className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                                                onClick={() => {
                                                    handleTabChange(
                                                        "editar-perfil"
                                                    );
                                                    setMenuAberto(false);
                                                }}
                                            >
                                                <FiUser size={16} />
                                                <span>Meu Perfil</span>
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                                                onClick={() => {
                                                    setMenuAberto(false);
                                                }}
                                            >
                                                <FiSettings size={16} />
                                                <span>Configurações</span>
                                            </button>
                                        </li>
                                        <li className="border-t border-gray-100">
                                            <button
                                                className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-2 text-red-600"
                                                onClick={() => {
                                                    onLogout();
                                                    setMenuAberto(false);
                                                }}
                                            >
                                                <FiLogOut size={16} />
                                                <span>Sair</span>
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Container principal */}
            <div className="container mx-auto px-4 md:px-6 py-8">
                <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
                    {/* Menu lateral */}
                    <div className="bg-white rounded-xl shadow-sm p-5 h-fit border border-gray-200 sticky top-24">
                        <nav>
                            <ul className="space-y-1">
                                <li>
                                    <button
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                            tabAtiva === "dashboard"
                                                ? "bg-green-100 text-green-700"
                                                : "hover:bg-gray-100 text-gray-700"
                                        }`}
                                        onClick={() =>
                                            handleTabChange("dashboard")
                                        }
                                    >
                                        <FiBarChart2 />
                                        <span>Dashboard</span>
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                            tabAtiva === "meus-pratos"
                                                ? "bg-green-100 text-green-700"
                                                : "hover:bg-gray-100 text-gray-700"
                                        }`}
                                        onClick={() =>
                                            handleTabChange("meus-pratos")
                                        }
                                    >
                                        <FiList />
                                        <span>Meus Pratos</span>
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                            tabAtiva === "adicionar-prato"
                                                ? "bg-green-100 text-green-700"
                                                : "hover:bg-gray-100 text-gray-700"
                                        }`}
                                        onClick={() =>
                                            handleTabChange("adicionar-prato")
                                        }
                                    >
                                        <FiPlusCircle />
                                        <span>Adicionar Prato</span>
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                            tabAtiva === "pedidos"
                                                ? "bg-green-100 text-green-700"
                                                : "hover:bg-gray-100 text-gray-700"
                                        }`}
                                        onClick={() =>
                                            handleTabChange("pedidos")
                                        }
                                    >
                                        <FiShoppingBag />
                                        <span>Pedidos</span>
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                            tabAtiva === "avaliacoes"
                                                ? "bg-green-100 text-green-700"
                                                : "hover:bg-gray-100 text-gray-700"
                                        }`}
                                        onClick={() =>
                                            handleTabChange("avaliacoes")
                                        }
                                    >
                                        <FiStar />
                                        <span>Avaliações</span>
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                            tabAtiva === "mensagens"
                                                ? "bg-green-100 text-green-700"
                                                : "hover:bg-gray-100 text-gray-700"
                                        }`}
                                        onClick={() =>
                                            handleTabChange("mensagens")
                                        }
                                    >
                                        <FiMessageSquare />
                                        <span>Mensagens</span>
                                        <span className="ml-auto bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                            3
                                        </span>
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                            tabAtiva === "calendario"
                                                ? "bg-green-100 text-green-700"
                                                : "hover:bg-gray-100 text-gray-700"
                                        }`}
                                        onClick={() =>
                                            handleTabChange("calendario")
                                        }
                                    >
                                        <FiCalendar />
                                        <span>Calendário</span>
                                    </button>
                                </li>
                                <li className="pt-2 mt-2 border-t border-gray-100">
                                    <button
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                            tabAtiva === "editar-perfil"
                                                ? "bg-green-100 text-green-700"
                                                : "hover:bg-gray-100 text-gray-700"
                                        }`}
                                        onClick={() =>
                                            handleTabChange("editar-perfil")
                                        }
                                    >
                                        <FiUser />
                                        <span>Meu Perfil</span>
                                    </button>
                                </li>
                            </ul>
                        </nav>

                        <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-100">
                            <p className="text-sm text-green-800 font-medium">
                                Precisa de ajuda?
                            </p>
                            <p className="text-xs text-green-600 mt-1">
                                Acesse nossa central de suporte ou entre em
                                contato conosco.
                            </p>
                            <button className="mt-3 w-full py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors">
                                Suporte
                            </button>
                        </div>
                    </div>

                    {/* Conteúdo principal */}
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 min-h-[70vh]">
                        {renderizarConteudo()}
                    </div>
                </div>
            </div>

            {/* Footer simples */}
            <footer className="mt-12 bg-white border-t border-gray-200 py-6">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-600 text-sm">
                            © 2023 LeveFit. Todos os direitos reservados.
                        </p>
                        <div className="mt-4 md:mt-0">
                            <div className="flex items-center space-x-4">
                                <a
                                    href="#"
                                    className="text-gray-500 hover:text-green-600 transition-colors"
                                >
                                    Termos de Uso
                                </a>
                                <a
                                    href="#"
                                    className="text-gray-500 hover:text-green-600 transition-colors"
                                >
                                    Privacidade
                                </a>
                                <a
                                    href="#"
                                    className="text-gray-500 hover:text-green-600 transition-colors"
                                >
                                    Suporte
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

DashboardFornecedor.propTypes = {
    onLogout: PropTypes.func.isRequired,
    usuario: PropTypes.object,
    onChangeTab: PropTypes.func,
    tabAtiva: PropTypes.string,
};

DashboardFornecedor.defaultProps = {
    usuario: {},
    tabAtiva: "meus-pratos",
};

export default DashboardFornecedor;
