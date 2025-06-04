import React, { useState } from "react";
import { Outlet, Link, useLocation, Navigate } from "react-router-dom";
import { isAdminLoggedIn, logoutAdmin } from "../../services/adminAuth";
import {
  FaTachometerAlt,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaShieldAlt,
  FaUserFriends,
  FaStore,
} from "react-icons/fa";

const AdminDashboardLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  if (!isAdminLoggedIn()) {
    // Este é um fallback, redireciona para página de login admin
    return <Navigate to="/restrito" replace />;
  }

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: <FaTachometerAlt />,
    },
    {
      name: "Fornecedores",
      path: "/admin/fornecedores",
      icon: <FaStore />,
    },
    {
      name: "Clientes",
      path: "/admin/clientes",
      icon: <FaUserFriends />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <button
              className="md:hidden mr-3 p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
            <div className="flex items-center">
              <FaShieldAlt className="text-2xl text-green-600 dark:text-green-500 mr-2" />
              <h1 className="text-xl font-bold">Painel Admin</h1>
            </div>
          </div>
          <button
            onClick={logoutAdmin}
            className="flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <FaSignOutAlt className="mr-1.5" />
            Sair
          </button>
        </div>
      </header>

      <div className="flex flex-col md:flex-row min-h-[calc(100vh-60px)]">
        {/* Sidebar */
        /* Em telas pequenas é um menu móvel fixo, em telas maiores fica sempre visível */}
        <aside
          className={`w-64 bg-white dark:bg-gray-800 p-5 transition-all duration-300 ease-in-out 
                      md:relative md:shadow-none md:translate-x-0
                      fixed top-[60px] left-0 h-full shadow-lg z-30
                      ${
                        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                      }`}
        >
          <nav className="mt-5">
            <ul>
              {menuItems.map((item) => (
                <li key={item.name} className="mb-2">
                  <Link
                    to={item.path}
                    onClick={() =>
                      isMobileMenuOpen && setIsMobileMenuOpen(false)
                    }
                    className={`flex items-center p-3 rounded-lg transition-colors duration-200 
                      ${
                        location.pathname === item.path
                          ? "bg-green-600 dark:bg-green-500 text-white font-semibold shadow-md"
                          : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                      }`}
                  >
                    <span className="mr-3 text-lg">{item.icon}</span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Overlay para fechar menu mobile */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black opacity-50 z-20 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
        )}

        {/* Content Area */}
        <main className="flex-1 p-4 md:p-6 max-w-full overflow-hidden">
          <div className="max-w-full overflow-x-hidden">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
