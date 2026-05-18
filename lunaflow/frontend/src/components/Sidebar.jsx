// ============================================================
// src/components/Sidebar.jsx — Navigation Sidebar
// ============================================================

import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Calendar, BarChart2, BookOpen,
  Bell, Settings, LogOut, X, Moon,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/calendar",  icon: Calendar,        label: "Calendar" },
  { to: "/analytics", icon: BarChart2,        label: "Analytics" },
  { to: "/journal",   icon: BookOpen,         label: "Journal" },
  { to: "/reminders", icon: Bell,             label: "Reminders" },
  { to: "/settings",  icon: Settings,         label: "Settings" },
];

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between p-6 pb-8">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌙</span>
          <span className="font-display text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            LunaFlow
          </span>
        </div>
        {/* Mobile close button */}
        <button onClick={onClose} className="lg:hidden text-pink-400 hover:text-pink-600">
          <X size={20} />
        </button>
      </div>

      {/* User Avatar */}
      <div className="px-6 mb-6">
        <div className="flex items-center gap-3 p-3 bg-pink-50 rounded-2xl">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center text-white font-bold text-sm">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700">{user?.name}</p>
            <p className="text-xs text-pink-400">Cycle day ✨</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 font-medium text-sm
              ${isActive
                ? "bg-gradient-to-r from-pink-400 to-pink-500 text-white shadow-pink-soft"
                : "text-gray-500 hover:bg-pink-50 hover:text-pink-500"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom: Logout */}
      <div className="p-6">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-400 transition-all duration-200"
        >
          <LogOut size={18} />
          Log Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (always visible) */}
      <div className="hidden lg:flex flex-col fixed left-0 top-0 h-full w-64 bg-white/80 backdrop-blur-xl border-r border-pink-100 z-30">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar (slide in) */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 h-full w-64 bg-white z-30 lg:hidden flex flex-col shadow-2xl"
          >
            <SidebarContent />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
