import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import axios from "axios";

type UserType = "cliente" | "fornecedor" | null;

interface UserData {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  cep?: string;
  rua?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  whatsapp?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface AuthContextType {
  isAuthenticated: boolean;
  userType: UserType;
  userData: UserData | null;
  login: (token: string, type: UserType, data: UserData) => void;
  logout: () => void;
  updateUserData: (data: Partial<UserData>) => void;
  refreshUserData: (explicitUserType?: UserType) => Promise<UserData | void>;
  isRefreshing: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userType, setUserType] = useState<UserType>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const refreshingRef = useRef<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUserType = localStorage.getItem("userType") as UserType;
    const storedUserData = localStorage.getItem("userData");

    console.log(
      "DEBUG - AuthContext - Inicializando, verificando localStorage:",
      {
        token: token ? "Existe" : "Não existe",
        storedUserType,
        storedUserData: storedUserData ? JSON.stringify(JSON.parse(storedUserData), null, 2) : "Não existe",
      }
    );

    if (token && storedUserType) {
      setIsAuthenticated(true);
      setUserType(storedUserType);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      console.log("DEBUG - AuthContext - Token configurado no axios. Tentando refreshUserData.");
      
      if (storedUserData) {
        try {
          const parsedUserData = JSON.parse(storedUserData);
          setUserData(parsedUserData);
          console.log("DEBUG - AuthContext - Dados do localStorage aplicados temporariamente:", parsedUserData);
        } catch (e) {
          console.error("DEBUG - AuthContext - Erro ao parsear userData do localStorage:", e);
          localStorage.removeItem("userData");
        }
      }
      
      refreshUserData(storedUserType).then(refreshedData => {
        if (refreshedData) {
            console.log("DEBUG - AuthContext - Dados atualizados após refresh na inicialização:", refreshedData);
        } else {
            console.log("DEBUG - AuthContext - Não foi possível obter dados atualizados na inicialização, usando localStorage se disponível ou null.");
        }
      }).catch(error => {
          console.error("DEBUG - AuthContext - Erro no refreshUserData durante inicialização:", error);
      });

    } else {
      console.log("DEBUG - AuthContext - Usuário não está autenticado na inicialização (sem token ou tipo).");
      setIsAuthenticated(false);
      setUserType(null);
      setUserData(null);
      delete axios.defaults.headers.common["Authorization"];
    }
  }, []);

  const login = async (token: string, type: UserType, data: UserData) => {
    console.log("DEBUG - AuthContext - Realizando login com dados recebidos:", {
      tokenExiste: !!token,
      type,
      userDataReceived: data, 
    });

    localStorage.setItem("token", token);
    localStorage.setItem("userType", type as string);

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    setIsAuthenticated(true);
    setUserType(type);

    try {
      console.log("DEBUG - AuthContext - Chamando refreshUserData após login.");
      const refreshedData = await refreshUserData(type);
      if (refreshedData) {
        console.log("DEBUG - AuthContext - Login concluído e dados atualizados:", refreshedData);
      } else {
        console.warn("DEBUG - AuthContext - Login concluído, mas refreshUserData não retornou dados. Usando dados parciais do login:", data);
        setUserData(data); 
        localStorage.setItem("userData", JSON.stringify(data));
      }
    } catch (error) {
        console.error("DEBUG - AuthContext - Erro durante refreshUserData após login:", error);
        setUserData(data);
        localStorage.setItem("userData", JSON.stringify(data));
    }
  };

  const logout = () => {
    console.log("DEBUG - AuthContext - Realizando logout");

    localStorage.removeItem("token");
    setUserType(null);
    setUserData(null);
    setIsAuthenticated(false);
    delete axios.defaults.headers.common["Authorization"];
    
    localStorage.removeItem("userType");
    localStorage.removeItem("userData");

    console.log("DEBUG - AuthContext - Logout concluído");
  };

  const updateUserData = (data: Partial<UserData>) => {
    if (!userData) return;

    console.log("DEBUG - AuthContext - Atualizando dados do usuário:", data);

    const updatedUserData = { ...userData, ...data };
    localStorage.setItem("userData", JSON.stringify(updatedUserData));
    setUserData(updatedUserData);

    console.log("DEBUG - AuthContext - Dados atualizados com sucesso");
  };

  const refreshUserData = async (explicitUserType?: UserType): Promise<UserData | void> => {
    const currentContextUserType = userType;
    const typeToUse = explicitUserType || currentContextUserType;

    if (!typeToUse || refreshingRef.current) {
        console.log("DEBUG - AuthContext - refreshUserData pulado:", { typeToUse, isRefreshing: refreshingRef.current });
        if (!typeToUse) return Promise.resolve();
        return Promise.resolve(userData || undefined);
    }

    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("DEBUG - AuthContext - Token não encontrado para refreshUserData. Fazendo logout.");
      logout();
      return Promise.resolve();
    }

    try {
      refreshingRef.current = true;
      setIsRefreshing(true);

      console.log(`DEBUG - AuthContext - Atualizando dados do usuário da API para tipo: ${typeToUse}`);

      const endpoint =
        typeToUse === "fornecedor"
          ? "http://localhost:3333/fornecedores/perfil"
          : "http://localhost:3333/clientes/perfil";

      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedUserDataFromApi = response.data as UserData;
      console.log(
        "DEBUG - AuthContext - Dados atualizados recebidos da API:",
        updatedUserDataFromApi
      );

      if (updatedUserDataFromApi) {
        localStorage.setItem("userData", JSON.stringify(updatedUserDataFromApi));
        setUserData(updatedUserDataFromApi);
        return updatedUserDataFromApi;
      } else {
        console.warn("DEBUG - AuthContext - API não retornou dados de usuário em refreshUserData.");
        return Promise.resolve();
      }
    } catch (error) {
      console.error("DEBUG - AuthContext - Erro ao atualizar dados:", error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        console.warn(
          "DEBUG - AuthContext - Erro de autenticação (401) no refreshUserData, realizando logout."
        );
        logout();
      }
      return Promise.reject(error);
    } finally {
      setIsRefreshing(false);
      setTimeout(() => {
        refreshingRef.current = false;
      }, 5000);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userType,
        userData,
        login,
        logout,
        updateUserData,
        refreshUserData,
        isRefreshing,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};

export default AuthContext;
