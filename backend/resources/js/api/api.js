import axios from "axios";

// Configuração base do axios para comunicação com o backend
const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Interceptor para adicionar token de autenticação em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Verificar se o erro é de autenticação (401)
    if (error.response && error.response.status === 401) {
      // Limpar token e redirecionar para login
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/";
    }
    return Promise.reject(error);

  }
);

// Serviços de autenticação
export const authService = {
  register: (userData) => api.post("/register", userData),
  login: (credentials) => api.post("/login", credentials),
  logout: () => api.post("/logout"),
  getCurrentUser: () => api.get("/user"),
};

// Serviços para pratos
export const pratoService = {
  listarPratos: (params) => api.get("/pratos", { params }),
  obterPrato: (id) => api.get(`/pratos/${id}`),
  criarPrato: (pratoData) => {
    const formData = new FormData();

    // Adicionar campos do prato ao FormData
    Object.keys(pratoData).forEach((key) => {
      // Verificar se é a imagem (File object)
      if (key === "imagem" && pratoData[key] instanceof File) {
        formData.append(key, pratoData[key]);
      } else {
        formData.append(key, pratoData[key]);
      }
    });

    return api.post("/pratos", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  atualizarPrato: (id, pratoData) => {
    const formData = new FormData();

    // Adicionar método PUT para Laravel
    formData.append("_method", "PUT");

    // Adicionar campos do prato ao FormData
    Object.keys(pratoData).forEach((key) => {
      // Verificar se é a imagem (File object)
      if (key === "imagem" && pratoData[key] instanceof File) {
        formData.append(key, pratoData[key]);
      } else {
        formData.append(key, pratoData[key]);
      }
    });

    return api.post(`/pratos/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  excluirPrato: (id) => api.delete(`/pratos/${id}`),
};

// Serviços para avaliações
export const avaliacaoService = {
  listarAvaliacoes: (pratoId) => api.get(`/pratos/${pratoId}/avaliacoes`),
  criarAvaliacao: (pratoId, avaliacaoData) =>
    api.post(`/pratos/${pratoId}/avaliacoes`, avaliacaoData),
  atualizarAvaliacao: (id, avaliacaoData) =>
    api.put(`/avaliacoes/${id}`, avaliacaoData),
  excluirAvaliacao: (id) => api.delete(`/avaliacoes/${id}`),
};

export default api;
