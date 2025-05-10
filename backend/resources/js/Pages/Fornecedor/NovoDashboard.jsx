import React, { useState, useEffect } from "react";
import { Head, usePage, router } from "@inertiajs/react";
import {
    FiBarChart2,
    FiList,
    FiPlusCircle,
    FiStar,
    FiShoppingBag,
    FiLogOut,
    FiUser,
    FiTrendingUp,
    FiDollarSign,
    FiCalendar,
} from "react-icons/fi";

export default function NovoDashboard() {
    const { auth } = usePage().props;
    const [activeTab, setActiveTab] = useState("dashboard");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        console.log("Dashboard montado com auth:", auth);
    }, []);

    const handleLogout = () => {
        router.post(route("logout"));
    };

    // Formatação dos dados do usuário
    const user = auth?.user
        ? {
              nome: auth.user.nome_completo || auth.user.name || "Fornecedor",
              email: auth.user.email || "fornecedor@exemplo.com",
              telefone: auth.user.telefone || "(00) 00000-0000",
              tipo: auth.user.tipo || "fornecedor",
          }
        : {
              nome: "Fornecedor",
              email: "fornecedor@exemplo.com",
              telefone: "(00) 00000-0000",
              tipo: "fornecedor",
          };

    // Componente para o conteúdo do Dashboard
    const DashboardContent = () => (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Painel de Controle
            </h2>

            {/* Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Pedidos</p>
                            <h3 className="text-2xl font-bold text-gray-800">
                                27
                            </h3>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-full">
                            <FiShoppingBag className="text-blue-600" />
                        </div>
                    </div>
                    <p className="text-xs text-green-600 mt-2">
                        +12% em relação à semana passada
                    </p>
                </div>

                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Faturamento</p>
                            <h3 className="text-2xl font-bold text-gray-800">
                                R$ 1.890,00
                            </h3>
                        </div>
                        <div className="bg-green-100 p-3 rounded-full">
                            <FiBarChart2 className="text-green-600" />
                        </div>
                    </div>
                    <p className="text-xs text-green-600 mt-2">
                        +8% em relação à semana passada
                    </p>
                </div>

                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">
                                Avaliação Média
                            </p>
                            <h3 className="text-2xl font-bold text-gray-800">
                                4.8
                            </h3>
                        </div>
                        <div className="bg-yellow-100 p-3 rounded-full">
                            <FiStar className="text-yellow-600" />
                        </div>
                    </div>
                    <p className="text-xs text-green-600 mt-2">
                        +0.2 em relação ao mês passado
                    </p>
                </div>

                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">
                                Pratos Ativos
                            </p>
                            <h3 className="text-2xl font-bold text-gray-800">
                                12
                            </h3>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-full">
                            <FiList className="text-purple-600" />
                        </div>
                    </div>
                    <p className="text-xs text-green-600 mt-2">
                        +2 novos pratos este mês
                    </p>
                </div>
            </div>

            {/* Pedidos Recentes */}
            <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                    Pedidos Recentes
                </h3>
                <div className="bg-white overflow-hidden border border-gray-200 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Cliente
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Prato
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Valor
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    #PED7823
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    Ana Silva
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    Salada Caesar de Frango
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    R$ 34,90
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                        Entregue
                                    </span>
                                </td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    #PED7822
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    Carlos Mendes
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    Bowl de Quinoa com Frango
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    R$ 39,90
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                        Em preparo
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    // Componente para Adicionar Pratos
    const AdicionarPrato = () => (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Adicionar Novo Prato
            </h2>

            <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nome do Prato
                        </label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Ex: Salada Caesar com Frango"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Categoria
                        </label>
                        <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                            <option value="">Selecione uma categoria</option>
                            <option value="saladas">Saladas</option>
                            <option value="proteicos">Proteicos</option>
                            <option value="lowcarb">Low Carb</option>
                            <option value="vegetariano">Vegetariano</option>
                            <option value="vegano">Vegano</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Descrição
                    </label>
                    <textarea
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        rows="4"
                        placeholder="Descreva os ingredientes e o preparo do prato..."
                    ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Preço (R$)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="0,00"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Calorias
                        </label>
                        <input
                            type="number"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="kcal"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Proteínas (g)
                        </label>
                        <input
                            type="number"
                            step="0.1"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="0"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Imagem do Prato
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                            <svg
                                className="mx-auto h-12 w-12 text-gray-400"
                                stroke="currentColor"
                                fill="none"
                                viewBox="0 0 48 48"
                                aria-hidden="true"
                            >
                                <path
                                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <div className="flex text-sm text-gray-600">
                                <label
                                    htmlFor="file-upload"
                                    className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500"
                                >
                                    <span>Fazer upload de arquivo</span>
                                    <input
                                        id="file-upload"
                                        name="file-upload"
                                        type="file"
                                        className="sr-only"
                                    />
                                </label>
                                <p className="pl-1">ou arraste e solte</p>
                            </div>
                            <p className="text-xs text-gray-500">
                                PNG, JPG até 2MB
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-5">
                    <button
                        type="button"
                        onClick={() => setActiveTab("dashboard")}
                        className="mr-3 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        Salvar Prato
                    </button>
                </div>
            </form>
        </div>
    );

    // Componente para Meus Pratos
    const MeusPratos = () => (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                    Meus Pratos
                </h2>
                <button
                    onClick={() => setActiveTab("add-prato")}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors"
                >
                    <FiPlusCircle />
                    <span>Adicionar Prato</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Prato 1 */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                    <div className="h-48 overflow-hidden">
                        <img
                            src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
                            alt="Salada Caesar com Frango"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="p-5">
                        <h3 className="text-lg font-bold text-gray-800 mb-2">
                            Salada Caesar com Frango
                        </h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            Salada fresca com alface, croutons, parmesão e molho
                            Caesar, coberta com peito de frango grelhado.
                        </p>
                        <div className="flex justify-between items-center">
                            <span className="font-bold text-green-600">
                                R$ 34,90
                            </span>
                            <div className="flex items-center gap-1">
                                <FiStar className="text-yellow-500" />
                                <span className="text-gray-700">4.7</span>
                            </div>
                        </div>
                        <div className="mt-4 flex gap-2">
                            <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                                Editar
                            </button>
                            <button className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm">
                                Desativar
                            </button>
                        </div>
                    </div>
                </div>

                {/* Prato 2 */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                    <div className="h-48 overflow-hidden">
                        <img
                            src="https://images.unsplash.com/photo-1580013759032-c96505e24c1f"
                            alt="Bowl de Quinoa com Frango"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="p-5">
                        <h3 className="text-lg font-bold text-gray-800 mb-2">
                            Bowl de Quinoa com Frango
                        </h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            Quinoa cozida com legumes frescos, abacate e frango
                            grelhado temperado com ervas.
                        </p>
                        <div className="flex justify-between items-center">
                            <span className="font-bold text-green-600">
                                R$ 39,90
                            </span>
                            <div className="flex items-center gap-1">
                                <FiStar className="text-yellow-500" />
                                <span className="text-gray-700">4.8</span>
                            </div>
                        </div>
                        <div className="mt-4 flex gap-2">
                            <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                                Editar
                            </button>
                            <button className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm">
                                Desativar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // Componente para Perfil
    const Perfil = () => (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Meu Perfil
            </h2>

            <div className="md:flex items-start gap-8">
                <div className="md:w-1/3 flex flex-col items-center mb-6 md:mb-0">
                    <div className="w-32 h-32 bg-gray-300 rounded-full overflow-hidden mb-4">
                        <img
                            src="https://images.unsplash.com/photo-1560250097-0b93528c311a"
                            alt="Foto de perfil"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors w-full max-w-xs">
                        Alterar Foto
                    </button>
                </div>

                <div className="md:w-2/3">
                    <form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nome Completo
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    value={user.nome}
                                    readOnly
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    value={user.email}
                                    readOnly
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Telefone
                                </label>
                                <input
                                    type="tel"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    value={user.telefone}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tipo de Conta
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50"
                                    value="Fornecedor"
                                    disabled
                                />
                            </div>
                        </div>

                        <div className="pt-5">
                            <button
                                type="submit"
                                className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                                Salvar Alterações
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );

    // Renderiza o conteúdo com base na aba ativa
    const renderContent = () => {
        switch (activeTab) {
            case "dashboard":
                return <DashboardContent />;
            case "meus-pratos":
                return <MeusPratos />;
            case "add-prato":
                return <AdicionarPrato />;
            case "perfil":
                return <Perfil />;
            default:
                return <DashboardContent />;
        }
    };

    return (
        <>
            <Head title="Dashboard de Fornecedor" />

            <div className="min-h-screen bg-gray-100">
                {/* Header */}
                <header className="bg-green-600 text-white">
                    <div className="container mx-auto py-4 px-6 flex justify-between items-center">
                        <h1 className="text-2xl font-bold">
                            LeveFit Fornecedor
                        </h1>
                        <div className="flex items-center gap-4">
                            <div className="hidden md:block">
                                <span className="font-medium">{user.nome}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 hover:text-green-200 transition-colors"
                            >
                                <FiLogOut />
                                <span className="hidden sm:inline">Sair</span>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <div className="container mx-auto py-8 px-4 md:px-6">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Sidebar */}
                        <div className="md:w-64 bg-white rounded-lg shadow-sm p-4 h-fit">
                            <nav>
                                <ul className="space-y-2">
                                    <li>
                                        <button
                                            onClick={() =>
                                                setActiveTab("dashboard")
                                            }
                                            className={`w-full text-left px-4 py-3 flex items-center gap-3 rounded-lg transition-colors ${
                                                activeTab === "dashboard"
                                                    ? "bg-green-100 text-green-700"
                                                    : "hover:bg-gray-100"
                                            }`}
                                        >
                                            <FiBarChart2 />
                                            <span>Dashboard</span>
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() =>
                                                setActiveTab("meus-pratos")
                                            }
                                            className={`w-full text-left px-4 py-3 flex items-center gap-3 rounded-lg transition-colors ${
                                                activeTab === "meus-pratos" ||
                                                activeTab === "add-prato"
                                                    ? "bg-green-100 text-green-700"
                                                    : "hover:bg-gray-100"
                                            }`}
                                        >
                                            <FiList />
                                            <span>Meus Pratos</span>
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() =>
                                                setActiveTab("perfil")
                                            }
                                            className={`w-full text-left px-4 py-3 flex items-center gap-3 rounded-lg transition-colors ${
                                                activeTab === "perfil"
                                                    ? "bg-green-100 text-green-700"
                                                    : "hover:bg-gray-100"
                                            }`}
                                        >
                                            <FiUser />
                                            <span>Meu Perfil</span>
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                            {loading ? (
                                <div className="flex justify-center items-center h-64">
                                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-600"></div>
                                </div>
                            ) : (
                                renderContent()
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
