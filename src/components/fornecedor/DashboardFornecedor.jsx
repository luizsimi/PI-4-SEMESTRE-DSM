import React, { useState } from "react";
import { FiUser, FiList, FiPlusCircle, FiLogOut } from "react-icons/fi";
import AdicionarPrato from "./AdicionarPrato";
import MeusPratos from "./MeusPratos";
import EditarPerfil from "./EditarPerfil";
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

      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          {/* Navegação */}
          <div className="flex flex-wrap md:flex-nowrap border-b border-gray-200">
            <button
              onClick={() => setTabAtiva("meus-pratos")}
              className={`flex items-center gap-2 px-6 py-4 text-lg font-medium transition-colors duration-300 ${
                tabAtiva === "meus-pratos"
                  ? "text-green-600 border-b-2 border-green-600 bg-green-50"
                  : "text-gray-600 hover:bg-green-50 hover:text-green-600"
              }`}
            >
              <FiList
                className={
                  tabAtiva === "meus-pratos"
                    ? "text-green-600"
                    : "text-gray-500"
                }
              />
              <span>Meus Pratos</span>
            </button>
            <button
              onClick={() => setTabAtiva("adicionar-prato")}
              className={`flex items-center gap-2 px-6 py-4 text-lg font-medium transition-colors duration-300 ${
                tabAtiva === "adicionar-prato"
                  ? "text-green-600 border-b-2 border-green-600 bg-green-50"
                  : "text-gray-600 hover:bg-green-50 hover:text-green-600"
              }`}
            >
              <FiPlusCircle
                className={
                  tabAtiva === "adicionar-prato"
                    ? "text-green-600"
                    : "text-gray-500"
                }
              />
              <span>Adicionar Prato</span>
            </button>
            <button
              onClick={() => setTabAtiva("editar-perfil")}
              className={`flex items-center gap-2 px-6 py-4 text-lg font-medium transition-colors duration-300 ${
                tabAtiva === "editar-perfil"
                  ? "text-green-600 border-b-2 border-green-600 bg-green-50"
                  : "text-gray-600 hover:bg-green-50 hover:text-green-600"
              }`}
            >
              <FiUser
                className={
                  tabAtiva === "editar-perfil"
                    ? "text-green-600"
                    : "text-gray-500"
                }
              />
              <span>Meu Perfil</span>
            </button>
          </div>

          {/* Conteúdo principal */}
          <div className="p-6">{renderizarConteudo()}</div>
        </div>
      </div>
    </div>
  );
};

DashboardFornecedor.propTypes = {
  onLogout: PropTypes.func.isRequired,
};

export default DashboardFornecedor;
