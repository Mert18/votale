"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api } from "../api/api";

interface User {
  id: string;
  email: string;
  name: string;
  pictureUrl: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (googleToken: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load token from localStorage on mount
    const storedToken = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      // Set axios default header
      api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    }
    setIsLoading(false);
  }, []);

  const login = async (googleToken: string) => {
    try {
      const response = await api.post<AuthResponse>("/api/auth/google", {
        googleToken,
      });

      const { token: jwtToken, user: userData } = response.data;

      setToken(jwtToken);
      setUser(userData);

      // Store in localStorage
      localStorage.setItem("authToken", jwtToken);
      localStorage.setItem("user", JSON.stringify(userData));

      // Set axios default header
      api.defaults.headers.common["Authorization"] = `Bearer ${jwtToken}`;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    delete api.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
