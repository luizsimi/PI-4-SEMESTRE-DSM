import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Sobre from "./components/Sobre";
import Menu from "./components/Menu";
import Footer from "./components/Footer";
import Pratos from "./components/Pratos";
import Review from "./components/Review";
import DashboardFornecedor from "./components/fornecedor/DashboardFornecedor";
import EditarPerfil from "./components/fornecedor/EditarPerfil";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const App = () => {
  const [currentPage, setCurrentPage] = useState("home");
  const [isPerfilModalOpen, setIsPerfilModalOpen] = useState(false);

  // Simular um usuário logado ou não (em produção, viria de um contexto/estado global)
  const [usuarioLogado, setUsuarioLogado] = useState({
    logado: false,
    tipo: null, // 'usuario' ou 'fornecedor'
    nome: "",
    email: "",
    telefone: "",
    endereco: "",
  });

  // Função para simular login (em um cenário real, seria feito através de autenticação)
  const fazerLogin = (tipo) => {
    // Dados fictícios para simular um usuário logado
    const dadosUsuario =
      tipo === "fornecedor"
        ? {
            nome: "Restaurante Verde",
            email: "contato@restauranteverde.com",
            telefone: "(11) 98765-4321",
            endereco: "Av. Paulista, 1000, São Paulo",
          }
        : {
            nome: "João Silva",
            email: "joao.silva@exemplo.com",
            telefone: "(11) 91234-5678",
            endereco: "Rua das Flores, 123, São Paulo",
          };

    setUsuarioLogado({
      logado: true,
      tipo: tipo,
      ...dadosUsuario,
    });

    // Salvar no localStorage para persistir entre recarregamentos da página
    localStorage.setItem(
      "usuarioLogado",
      JSON.stringify({
        logado: true,
        tipo: tipo,
        ...dadosUsuario,
      })
    );

    if (tipo === "fornecedor") {
      setCurrentPage("dashboard");
    }
  };

  // Função para simular logout
  const fazerLogout = () => {
    setUsuarioLogado({
      logado: false,
      tipo: null,
      nome: "",
      email: "",
      telefone: "",
      endereco: "",
    });

    // Remover do localStorage
    localStorage.removeItem("usuarioLogado");

    setCurrentPage("home");
  };

  // Para testes - ir direto para o dashboard
  const irParaDashboardTeste = () => {
    fazerLogin("fornecedor");
    setCurrentPage("dashboard");
  };

  // Função para atualizar dados do usuário
  const atualizarPerfilUsuario = (dadosAtualizados) => {
    const novosDadosUsuario = {
      ...usuarioLogado,
      ...dadosAtualizados,
    };

    setUsuarioLogado(novosDadosUsuario);

    // Atualizar no localStorage
    if (novosDadosUsuario.logado) {
      localStorage.setItem("usuarioLogado", JSON.stringify(novosDadosUsuario));
    }

    iziToast.success({
      title: "Perfil atualizado",
      message: "Seus dados foram atualizados com sucesso",
      position: "topRight",
      timeout: 3000,
    });

    // Voltar para a página anterior ou para a home
    if (usuarioLogado.tipo === "fornecedor") {
      setCurrentPage("dashboard");
    } else {
      setCurrentPage("home");
    }
  };

  // Redirecionar para a página de edição de perfil
  const irParaEditarPerfil = () => {
    if (usuarioLogado.logado) {
      setIsPerfilModalOpen(true);
    } else {
      iziToast.error({
        title: "Erro",
        message: "Você precisa estar logado para editar o perfil",
        position: "topRight",
        timeout: 3000,
      });
    }
  };

  const fecharModalPerfil = () => {
    setIsPerfilModalOpen(false);
  };

  // Verificar se há usuário logado no localStorage ao iniciar a aplicação
  useEffect(() => {
    const usuarioSalvo = localStorage.getItem("usuarioLogado");
    if (usuarioSalvo) {
      setUsuarioLogado(JSON.parse(usuarioSalvo));
    }
  }, []);

  // Renderizar página baseado no estado atual
  const renderizarPagina = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardFornecedor onLogout={fazerLogout} />;
      case "editar-perfil":
        return (
          <div className="mt-24 pt-10 pb-10 bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <button
                  onClick={() =>
                    usuarioLogado.tipo === "fornecedor"
                      ? setCurrentPage("dashboard")
                      : setCurrentPage("home")
                  }
                  className="mb-6 text-green-600 hover:text-green-800 flex items-center"
                >
                  <svg
                    className="w-5 h-5 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    ></path>
                  </svg>
                  Voltar
                </button>
                <EditarPerfil
                  usuario={usuarioLogado}
                  onSave={atualizarPerfilUsuario}
                />
              </div>
            </div>
          </div>
        );
      default:
        return (
          <>
            <Navbar
              onLogin={fazerLogin}
              usuarioLogado={usuarioLogado}
              onLogout={fazerLogout}
              onNavigate={setCurrentPage}
              onEditarPerfil={irParaEditarPerfil}
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
                <Review
                  usuarioLogado={usuarioLogado.logado}
                  onEditarPerfil={irParaEditarPerfil}
                  onLogout={fazerLogout}
                />
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

            {/* Modal de Edição de Perfil */}
            {isPerfilModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4 overflow-y-auto">
                <div className="relative bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                  <button
                    onClick={fecharModalPerfil}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                  <EditarPerfil
                    usuario={usuarioLogado}
                    onSave={(dados) => {
                      atualizarPerfilUsuario(dados);
                      fecharModalPerfil();
                    }}
                  />
                </div>
              </div>
            )}
          </>
        );
    }
  };

  return <div>{renderizarPagina()}</div>;
};

export default App;
