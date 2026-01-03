"use client";

import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

interface Admin {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "super_admin";
}

interface AdminAuthContextType {
  admin: Admin | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        setIsLoading(false);
        return;
      }

      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setAdmin(response.data.data);
      } else {
        localStorage.removeItem("adminToken");
      }
    } catch (error) {
      localStorage.removeItem("adminToken");
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });

    if (response.data.success) {
      localStorage.setItem("adminToken", response.data.data.token);
      setAdmin(response.data.data.admin);
    } else {
      throw new Error(response.data.message || "Login failed");
    }
  };

  const logout = async () => {
    localStorage.removeItem("adminToken");
    setAdmin(null);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        isLoading,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }
  return context;
}
