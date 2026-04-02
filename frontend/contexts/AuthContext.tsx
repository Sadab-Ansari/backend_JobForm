"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  fullName?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (email: string, password: string, fullName?: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = "http://localhost:5063/api"; // Backend URL

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for existing token on mount
    const storedToken = Cookies.get("auth_token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      // Set default authorization header for axios
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      const { token: newToken, isSuccess, message } = response.data;

      if (isSuccess && newToken) {
        // Store token in cookie
        Cookies.set("auth_token", newToken, { expires: 7 }); // 7 days

        // Extract user info from token (or get from response if available)
        const userInfo: User = {
          id: "", // You can decode JWT to get user ID
          email: email,
          fullName: "",
        };

        // Store user in localStorage
        localStorage.setItem("user", JSON.stringify(userInfo));
        setUser(userInfo);
        setToken(newToken);

        // Set default authorization header for axios
        axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

        // Redirect to homepage
        router.push("/");
        return { success: true, message };
      } else {
        return { success: false, message };
      }
    } catch (error: any) {
      const message = error.response?.data?.message || "An error occurred during login";
      return { success: false, message };
    }
  };

  const register = async (email: string, password: string, fullName?: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, { email, password, fullName });
      const { token: newToken, isSuccess, message } = response.data;

      if (isSuccess && newToken) {
        // Store token in cookie
        Cookies.set("auth_token", newToken, { expires: 7 }); // 7 days

        // Extract user info
        const userInfo: User = {
          id: "",
          email: email,
          fullName: fullName,
        };

        // Store user in localStorage
        localStorage.setItem("user", JSON.stringify(userInfo));
        setUser(userInfo);
        setToken(newToken);

        // Set default authorization header for axios
        axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

        // Redirect to homepage
        router.push("/");
        return { success: true, message };
      } else {
        return { success: false, message };
      }
    } catch (error: any) {
      const message = error.response?.data?.message || "An error occurred during registration";
      return { success: false, message };
    }
  };

  const logout = () => {
    Cookies.remove("auth_token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
    delete axios.defaults.headers.common["Authorization"];
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isLoading }}>
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