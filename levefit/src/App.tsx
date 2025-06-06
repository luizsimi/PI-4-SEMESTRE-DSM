import React, { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext"; // useAuth é necessário para ProtectedRoute, mesmo comentado
import { CarrinhoProvider } from "./contexts/CarrinhoContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import DetalhePrato from "./pages/DetalhePrato";
import Fornecedores from "./pages/Fornecedores";
import DetalheFornecedor from "./pages/DetalheFornecedor";
import LoginModal from "./components/LoginModal";
import RegisterModal from "./components/RegisterModal";
import FornecedorDashboard from "./pages/FornecedorDashboard";
import FornecedorPerfil from "./pages/FornecedorPerfil";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboardHomePage from "./pages/admin/AdminDashboardHomePage";
import AdminFornecedoresListPage from "./pages/admin/AdminFornecedoresListPage";
import AdminClientesListPage from "./pages/admin/AdminClientesListPage";
import AdminDashboardLayout from "./pages/admin/AdminDashboardLayout";
import MeusPedidosPage from "./pages/MeusPedidosPage";
import Contato from "./pages/Contato";
import Categorias from "./pages/Categorias";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import CarrinhoPage from "./pages/CarrinhoPage";
import AssinaturaFornecedor from "./pages/AssinaturaFornecedor";
import FormularioPrato from "./pages/FormularioPrato";

// import { ToastContainer } from 'react-toastify'; // Comentado novamente
// import 'react-toastify/dist/ReactToastify.css'; // Comentado novamente

// Rotas Protegidas (Interface e Componente - mantidos mas não usados diretamente nas rotas problemáticas por enquanto)
interface ProtectedRouteProps {
  children: React.ReactElement;
  allowedUserType: "cliente" | "fornecedor" | "admin";
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedUserType,
}) => {
  const { isAuthenticated, userType, isRefreshing } = useAuth();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Se não estiver mais atualizando e temos informações de autenticação, não estamos mais inicializando
    if (!isRefreshing && (isAuthenticated !== null || userType !== null)) {
      setIsInitializing(false);
    }
  }, [isRefreshing, isAuthenticated, userType]);

  console.log("[ProtectedRoute] Verificando rota:", window.location.pathname);
  console.log("[ProtectedRoute] Props:", { allowedUserType });
  console.log("[ProtectedRoute] Estado Auth:", {
    isAuthenticated,
    userType,
    isRefreshing,
    isInitializing,
  });

  // Mostra loading apenas durante a inicialização ou refresh
  if (isInitializing || isRefreshing) {
    console.log("[ProtectedRoute] Estado: LOADING");
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-dashed rounded-full animate-spin mb-4"></div>
          <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">
            Verificando acesso...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log(
      "[ProtectedRoute] Estado: NOT_AUTHENTICATED, redirecionando para /login"
    );
    return <Navigate to="/login" replace />;
  }

  if (userType !== allowedUserType) {
    console.log(
      `[ProtectedRoute] Estado: WRONG_USER_TYPE (userType: ${userType}, allowedUserType: ${allowedUserType}), redirecionando para /`
    );
    return <Navigate to="/" replace />;
  }

  console.log("[ProtectedRoute] Estado: ACCESS_GRANTED, renderizando children");
  return children;
};

const ProtectedRouteCliente: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => <ProtectedRoute allowedUserType="cliente">{children}</ProtectedRoute>;
const ProtectedRouteFornecedor: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => <ProtectedRoute allowedUserType="fornecedor">{children}</ProtectedRoute>;

// Componente de rota protegida para fornecedores com verificação de assinatura
const ProtectedRouteFornecedorAssinatura: React.FC<{
  children: React.ReactElement;
}> = ({ children }) => {
  const { isAuthenticated, userType, userData } = useAuth();

  // Se não estiver autenticado ou não for fornecedor, o ProtectedRouteFornecedor já lida com isso
  if (!isAuthenticated || userType !== "fornecedor") {
    return <ProtectedRouteFornecedor>{children}</ProtectedRouteFornecedor>;
  }

  // Verifica se o fornecedor tem assinatura ativa
  if (!userData?.assinaturaAtiva) {
    console.log(
      "[ProtectedRouteFornecedorAssinatura] Fornecedor sem assinatura ativa, redirecionando para assinatura"
    );
    // Redireciona para a página de assinatura
    return <Navigate to="/dashboard/fornecedor/assinatura" replace />;
  }

  // Se tudo estiver ok, renderiza o componente filho
  return children;
};

// Componente para agrupar rotas que usam o layout global (Navbar + Footer)
const GlobalLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const location = useLocation();

  // Efeito para rolar para o topo quando a rota muda
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <Navbar />
      <div className="">{children}</div>
      <Footer />
    </>
  );
};

// Componente para rotas que NÃO usam o layout global (ex: dashboards)
const NoGlobalLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <>{children}</>; // Simplesmente renderiza os filhos
};

function AppContent() {
  const location = useLocation();
  console.log(
    "App.tsx (VERSÃO RESTAURADA E SIMPLIFICADA) CARREGADO!",
    new Date().toLocaleTimeString()
  );
  console.log("Localização atual:", location.pathname);

  // Lista de rotas que NÃO devem usar o Navbar/Footer global
  const noLayoutRoutes = [
    "/dashboard-fornecedor",
    // Adicione outras rotas de dashboard aqui se necessário, ex: '/admin/dashboard'
  ];

  const shouldUseGlobalLayout = !noLayoutRoutes.some((route) =>
    location.pathname.startsWith(route)
  );
  console.log("Deve usar layout global?", shouldUseGlobalLayout);

  return (
    <Routes>
      {/* Rotas com Layout Global */}
      <Route
        path="/"
        element={
          <GlobalLayout>
            <Home />
          </GlobalLayout>
        }
      />
      <Route
        path="/login"
        element={
          <GlobalLayout>
            <LoginModal onClose={() => {}} />
          </GlobalLayout>
        }
      />
      <Route
        path="/register"
        element={
          <GlobalLayout>
            <RegisterModal onClose={() => {}} />
          </GlobalLayout>
        }
      />
      <Route
        path="/fornecedores"
        element={
          <GlobalLayout>
            <Fornecedores />
          </GlobalLayout>
        }
      />
      <Route
        path="/fornecedores/:id"
        element={
          <GlobalLayout>
            <DetalheFornecedor />
          </GlobalLayout>
        }
      />
      <Route
        path="/pratos/:id"
        element={
          <GlobalLayout>
            <DetalhePrato />
          </GlobalLayout>
        }
      />
      <Route
        path="/contato"
        element={
          <GlobalLayout>
            <Contato />
          </GlobalLayout>
        }
      />
      <Route
        path="/categorias"
        element={
          <GlobalLayout>
            <Categorias />
          </GlobalLayout>
        }
      />
      <Route
        path="/blog"
        element={
          <GlobalLayout>
            <Blog />
          </GlobalLayout>
        }
      />
      <Route
        path="/blog/:slug"
        element={
          <GlobalLayout>
            <BlogPost />
          </GlobalLayout>
        }
      />
      <Route
        path="/carrinho"
        element={
          <GlobalLayout>
            <CarrinhoPage />
          </GlobalLayout>
        }
      />
      <Route
        path="/meus-pedidos"
        element={
          <GlobalLayout>
            <ProtectedRouteCliente>
              <MeusPedidosPage />
            </ProtectedRouteCliente>
          </GlobalLayout>
        }
      />
      <Route
        path="/perfil-fornecedor"
        element={
          <GlobalLayout>
            <ProtectedRouteFornecedor>
              <FornecedorPerfil />
            </ProtectedRouteFornecedor>
          </GlobalLayout>
        }
      />
      <Route
        path="/restrito"
        element={
          <GlobalLayout>
            <AdminLoginPage />
          </GlobalLayout>
        }
      />
      <Route path="/admin" element={<AdminDashboardLayout />}>
        <Route path="dashboard" element={<AdminDashboardHomePage />} />
        <Route path="fornecedores" element={<AdminFornecedoresListPage />} />
        <Route path="clientes" element={<AdminClientesListPage />} />
      </Route>

      {/* Rotas SEM Layout Global (Dashboard Fornecedor) / (Dashboard Admin) */}
      <Route
        path="/dashboard/fornecedor"
        element={
          <NoGlobalLayout>
            <ProtectedRouteFornecedorAssinatura>
              <FornecedorDashboard />
            </ProtectedRouteFornecedorAssinatura>
          </NoGlobalLayout>
        }
      />
      <Route
        path="/dashboard/fornecedor/assinatura"
        element={
          <NoGlobalLayout>
            <ProtectedRouteFornecedor>
              <AssinaturaFornecedor />
            </ProtectedRouteFornecedor>
          </NoGlobalLayout>
        }
      />
      <Route
        path="/dashboard/fornecedor/novo-prato"
        element={
          <NoGlobalLayout>
            <ProtectedRouteFornecedorAssinatura>
              <FormularioPrato />
            </ProtectedRouteFornecedorAssinatura>
          </NoGlobalLayout>
        }
      />
      <Route
        path="/dashboard/fornecedor/editar-prato/:id"
        element={
          <NoGlobalLayout>
            <ProtectedRouteFornecedorAssinatura>
              <FormularioPrato />
            </ProtectedRouteFornecedorAssinatura>
          </NoGlobalLayout>
        }
      />

      <Route
        path="*"
        element={
          <GlobalLayout>
            <div>PÁGINA NÃO ENCONTRADA (App.tsx principal)</div>
          </GlobalLayout>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <CarrinhoProvider>
        <BrowserRouter>
          <AppContent />
          {/* <ToastContainer autoClose={3000} aria-label="Notifications" /> */}
        </BrowserRouter>
      </CarrinhoProvider>
    </AuthProvider>
  );
}

export default App;
