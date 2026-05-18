// ============================================================
// src/App.jsx — Root App with Router
// ============================================================

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Pages
import Landing    from "./pages/Landing";
import Login      from "./pages/Login";
import Signup     from "./pages/Signup";
import Dashboard  from "./pages/Dashboard";
import Calendar   from "./pages/Calendar";
import Analytics  from "./pages/Analytics";
import Journal    from "./pages/Journal";
import Settings   from "./pages/Settings";
import Reminders  from "./pages/Reminders";

// Layout
import AppLayout  from "./components/AppLayout";

// ─── Protected Route Wrapper ──────────────────────────────
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-pulse">🌙</div>
          <p className="text-pink-400 font-medium">Loading LunaFlow...</p>
        </div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
};

// ─── Public Route (redirect if logged in) ─────────────────
const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? <Navigate to="/dashboard" replace /> : children;
};

// ─── App with Providers ───────────────────────────────────
export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/"      element={<Landing />} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup"element={<PublicRoute><Signup /></PublicRoute>} />

        {/* Protected routes (wrapped in AppLayout with sidebar) */}
        <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route path="dashboard"  element={<Dashboard />} />
          <Route path="calendar"   element={<Calendar />} />
          <Route path="analytics"  element={<Analytics />} />
          <Route path="journal"    element={<Journal />} />
          <Route path="reminders"  element={<Reminders />} />
          <Route path="settings"   element={<Settings />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
