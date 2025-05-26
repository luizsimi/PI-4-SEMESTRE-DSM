const ADMIN_AUTH_KEY = "isAdminLoggedIn";

export const loginAdmin = (email?: string, password?: string): boolean => {
  // Em um app real, isso validaria contra um backend.
  // Para este exemplo, usamos credenciais fixas.
  if (email === "admin@admin.com" && password === "123") {
    localStorage.setItem(ADMIN_AUTH_KEY, "true");
    return true;
  }
  return false;
};

export const logoutAdmin = (): void => {
  localStorage.removeItem(ADMIN_AUTH_KEY);
  // Opcionalmente, redirecionar para a página de login ou home.
  window.location.href = '/restrito'; // Redireciona para a página de login admin
};

export const isAdminLoggedIn = (): boolean => {
  return localStorage.getItem(ADMIN_AUTH_KEY) === "true";
}; 