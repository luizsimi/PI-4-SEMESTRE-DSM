import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isAdminLoggedIn } from '../../services/adminAuth';

const AdminProtectedRoute: React.FC = () => {
  if (!isAdminLoggedIn()) {
    // Se não estiver logado, redireciona para a página de login do admin
    return <Navigate to="/restrito" replace />;
  }

  // Se estiver logado, renderiza o conteúdo da rota (Outlet)
  return <Outlet />;
};

export default AdminProtectedRoute; 