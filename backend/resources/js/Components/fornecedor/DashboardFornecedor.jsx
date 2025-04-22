import { useState } from "react";
import { FiUser, FiList, FiPlusCircle, FiLogOut, FiStar } from "react-icons/fi";
import AdicionarPrato from "./AdicionarPrato";
import MeusPratos from "./MeusPratos";
import EditarPerfil from "./EditarPerfil";
import AvaliacoesPratos from "./AvaliacoesPratos";
import PropTypes from "prop-types";

const DashboardFornecedor = ({ onLogout }) => {
  const [tabAtiva, setTabAtiva] = useState("meus-pratos");

  // Mock de usuário (em produção, viria de um contexto/estado global)
  const usuario = {
    nome: "Restaurante Exemplo",
    email: "contato@restauranteexemplo.com",
    telefone: "(11) 99999-9999",
    dataCadastro: "01/01/2023",
    endereco: "Av. Paulista, 1000",
    cidade: "São Paulo",
    estado: "SP",
    cep: "01310-100",
    fotoPerfil: "https://via.placeholder.com/150",
  };

  const renderizarConteudo = () => {
    switch (tabAtiva) {
      case "adicionar-prato":
        return <AdicionarPrato />;
      case "meus-pratos":
        return <MeusPratos />;
      case "editar-perfil":
        return <EditarPerfil usuario={usuario} />;
      case "avaliacoes":
        return <AvaliacoesPratos />;
      default:
        return <MeusPratos />;
    }
  };

  return (
    <div className="min-h-screen bg-green-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 to-green-500 text-white py-5 shadow-lg">
        <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold">Dashboard Fornecedor</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <img
                src={usuario.fotoPerfil}
                alt="Perfil"
                className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md"
              />
              <span className="hidden md:block font-medium">
                {usuario.nome}
              </span>
            </div>
            <button
              onClick={onLogout}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2.5 rounded-full transition-all duration-300 shadow-md"
              title="Sair"
            >
              <FiLogOut />
            </button>
          </div>
        </div>
      </header>

      {/* Container principal */}
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8">
          {/* Menu lateral */}
          <div className="bg-white rounded-xl shadow-md p-5 h-fit">
            <nav>
              <ul className="space-y-2">
                <li>
                  <button
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      tabAtiva === "meus-pratos"
                        ? "bg-green-100 text-green-700"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                    onClick={() => setTabAtiva("meus-pratos")}
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
                    onClick={() => setTabAtiva("adicionar-prato")}
                  >
                    <FiPlusCircle />
                    <span>Adicionar Prato</span>
                  </button>
                </li>
                <li>
                  <button
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      tabAtiva === "avaliacoes"
                        ? "bg-green-100 text-green-700"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                    onClick={() => setTabAtiva("avaliacoes")}
                  >
                    <FiStar />
                    <span>Avaliações</span>
                  </button>
                </li>
                <li>
                  <button
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      tabAtiva === "editar-perfil"
                        ? "bg-green-100 text-green-700"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                    onClick={() => setTabAtiva("editar-perfil")}
                  >
                    <FiUser />
                    <span>Editar Perfil</span>
                  </button>
                </li>
              </ul>
            </nav>
          </div>

          {/* Conteúdo principal */}
          <div className="bg-white rounded-xl shadow-md p-6">
            {renderizarConteudo()}
          </div>
        </div>
      </div>
    </div>
  );
};

DashboardFornecedor.propTypes = {
  onLogout: PropTypes.func.isRequired,
};

export default DashboardFornecedor;
