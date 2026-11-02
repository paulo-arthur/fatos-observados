import { createContext, useState, useEffect } from "react";
import { api } from "../api/axios";

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Ao carregar a página, verifica se já existe sessão salva
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // 2. Função de Login consumindo a API
  const loginUser = async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    const { token, instructor } = response.data;

    // Salva no navegador
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(instructor));

    // Atualiza o estado da aplicação
    setUser(instructor);
  };

  // 3. Função de Logout
  const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        signed: !!user,
        user,
        loading,
        loginUser,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}