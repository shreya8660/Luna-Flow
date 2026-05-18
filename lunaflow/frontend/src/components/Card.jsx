// ============================================================
// src/components/Card.jsx — Reusable Glass Card
// ============================================================

import React from "react";
import { motion } from "framer-motion";

/**
 * GlassCard — main card wrapper with glassmorphism effect
 */
export function GlassCard({ children, className = "", hover = true, ...props }) {
  return (
    <motion.div
      whileHover={hover ? { y: -2, boxShadow: "0 12px 40px rgba(247, 43, 122, 0.15)" } : {}}
      transition={{ duration: 0.2 }}
      className={`bg-white/70 backdrop-blur-md border border-pink-100 rounded-3xl shadow-card p-5 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * StatCard — a dashboard stat card with icon + value + label
 */
export function StatCard({ icon, label, value, sub, gradient, className = "" }) {
  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className={`relative overflow-hidden rounded-3xl p-5 shadow-card ${gradient || "bg-white"} ${className}`}
    >
      {/* Background decoration */}
      <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-white/20 blur-2xl" />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium opacity-80 mb-1">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
          {sub && <p className="text-xs opacity-70 mt-1">{sub}</p>}
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
    </motion.div>
  );
}

/**
 * SectionTitle — consistent section heading with optional subtitle
 */
export function SectionTitle({ title, subtitle, className = "" }) {
  return (
    <div className={`mb-6 ${className}`}>
      <h2 className="text-xl font-bold text-gray-800 font-display">{title}</h2>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );
}
