import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../firebase"; // Importa il servizio di autenticazione Firebase
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from "firebase/auth";

// Crea il contesto
const AuthContext = createContext();

// Hook per usare il contesto
export const useAuth = () => useContext(AuthContext);

// Provider per gestire l'autenticazione
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Controlla se l'utente è loggato
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Login con email e password
  const login = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  // Logout
  const logout = async () => {
    await signOut(auth);
  };

  // Registrazione con email e password
  const register = async (email, password) => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
