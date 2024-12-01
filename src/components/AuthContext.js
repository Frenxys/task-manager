import React, { createContext, useContext, useState } from "react";

// Crea il contesto
const AuthContext = createContext();

// Hook per usare il contesto
export const useAuth = () => useContext(AuthContext);

// Provider per gestire lo stato di autenticazione
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = () => setIsAuthenticated(true);
  const logout = () => setIsAuthenticated(false);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
