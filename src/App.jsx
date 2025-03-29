import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Sobre from "./components/Sobre";
import Menu from "./components/Menu";
import Footer from "./components/Footer";
import Pratos from "./components/Pratos";
import Review from "./components/Review";
import DashboardFornecedor from "./components/fornecedor/DashboardFornecedor";

const App = () => {
  const [currentPage, setCurrentPage] = useState("home");

  // Simular um usuário logado ou não (em produção, viria de um contexto/estado global)
  const [usuarioLogado, setUsuarioLogado] = useState({
    logado: false,
    tipo: null, // 'usuario' ou 'fornecedor'
  });

  // Função para simular login (em um cenário real, seria feito através de autenticação)
  const fazerLogin = (tipo) => {
    setUsuarioLogado({
      logado: true,
      tipo: tipo,
    });
    if (tipo === "fornecedor") {
      setCurrentPage("dashboard");
    }
  };

  // Função para simular logout
  const fazerLogout = () => {
    setUsuarioLogado({
      logado: false,
      tipo: null,
    });
    setCurrentPage("home");
  };

  // Para testes - ir direto para o dashboard
  const irParaDashboardTeste = () => {
    fazerLogin("fornecedor");
    setCurrentPage("dashboard");
  };

  // Renderizar página baseado no estado atual
  const renderizarPagina = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardFornecedor onLogout={fazerLogout} />;
      default:
        return (
          <>
            <Navbar
              onLogin={fazerLogin}
              usuarioLogado={usuarioLogado}
              onLogout={fazerLogout}
              onNavigate={setCurrentPage}
            />
            <main>
              <div id="home">
                <Home />
              </div>

              <div id="pratos">
                <Pratos />
              </div>

              <div id="sobre">
                <Sobre />
              </div>

              <div id="menu">
                <Menu />
              </div>

              <div id="review">
                <Review />
              </div>

              {/* Botão para teste - acessar Dashboard diretamente */}
              <div className="fixed bottom-4 right-4 z-50">
                <button
                  onClick={irParaDashboardTeste}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-purple-700"
                >
                  Acessar Dashboard (Teste)
                </button>
              </div>
            </main>
            <Footer />
          </>
        );
    }
  };

  return <div>{renderizarPagina()}</div>;
};

export default App;
