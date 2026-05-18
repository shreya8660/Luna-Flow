// ============================================================
// src/context/AuthContext.jsx — Global Auth State
// ============================================================

import React, { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../utils/api";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true); // True while checking stored session

  // ─── On mount: restore session from localStorage ──────────
  useEffect(() => {
    const storedUser  = localStorage.getItem("lunaflow_user");
    const storedToken = localStorage.getItem("lunaflow_token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // ─── Register ─────────────────────────────────────────────
  const register = async (name, email, password) => {
    try {
      const { data } = await authAPI.register({ name, email, password });
      localStorage.setItem("lunaflow_token", data.token);
      localStorage.setItem("lunaflow_user",  JSON.stringify(data.user));
      setUser(data.user);
      toast.success(data.message || "Welcome to LunaFlow! 🌙");
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || "Registration failed";
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  // ─── Login ────────────────────────────────────────────────
  const login = async (email, password) => {
    try {
      const { data } = await authAPI.login({ email, password });
      localStorage.setItem("lunaflow_token", data.token);
      localStorage.setItem("lunaflow_user",  JSON.stringify(data.user));
      setUser(data.user);
      toast.success(data.message || "Welcome back! 💗");
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || "Login failed";
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  // ─── Logout ───────────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem("lunaflow_token");
    localStorage.removeItem("lunaflow_user");
    setUser(null);
    toast.success("Logged out. See you soon! 🌙");
  };

  // ─── Update User ──────────────────────────────────────────
  const updateUser = (updatedUser) => {
    const merged = { ...user, ...updatedUser };
    setUser(merged);
    localStorage.setItem("lunaflow_user", JSON.stringify(merged));
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy access
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
