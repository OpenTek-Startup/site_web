/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useState } from "react";
import { account } from "../config/appwrite";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const current = await account.get();
      setUser(current);
      return current;
    } catch {
      setUser(null);
      return null;
    }
  };

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    // createEmailPasswordSession = nom de la methode dans les SDK Appwrite recents.
    await account.createEmailPasswordSession(email, password);
    return refreshUser();
  };

  const logout = async () => {
    await account.deleteSession("current");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth doit etre utilise a l'interieur d'un <AuthProvider>");
  }
  return ctx;
}
