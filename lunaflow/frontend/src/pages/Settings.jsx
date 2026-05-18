// ============================================================
// src/pages/Settings.jsx — Profile & App Settings
// ============================================================

import React, { useState } from "react";
import { motion } from "framer-motion";
import { User, Bell, Moon, Droplets, Save, LogOut, Shield, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { GlassCard } from "../components/Card";

export default function Settings() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    name:           user?.name || "",
    cycleLength:    user?.cycleLength || 28,
    periodDuration: user?.periodDuration || 5,
    waterGoal:      user?.waterGoal || 8,
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await authAPI.update(profile);
      updateUser(data.user);
      toast.success("Settings saved! ✨");
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-800">Settings ⚙️</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your profile and preferences</p>
      </div>

      {/* ── Avatar / Profile Header ─────────────────────── */}
      <GlassCard className="flex items-center gap-5 p-6">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white text-3xl font-bold shadow-pink-md">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-pink-500 rounded-full flex items-center justify-center text-white text-xs cursor-pointer hover:bg-pink-600 transition-colors">
            ✏️
          </div>
        </div>
        <div>
          <h2 className="font-semibold text-gray-800 text-lg">{user?.name}</h2>
          <p className="text-sm text-gray-400">{user?.email}</p>
          <span className="badge-pink mt-1 text-xs">LunaFlow Member ✨</span>
        </div>
      </GlassCard>

      {/* ── Profile Settings ─────────────────────────────── */}
      <GlassCard className="p-6 space-y-5">
        <div className="flex items-center gap-2 mb-2">
          <User className="text-pink-400" size={18} />
          <h3 className="font-semibold text-gray-700">Profile</h3>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600 mb-1.5 block">Display Name</label>
          <input type="text" value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            className="input-pink" />
        </div>
      </GlassCard>

      {/* ── Cycle Settings ────────────────────────────────── */}
      <GlassCard className="p-6 space-y-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">🌙</span>
          <h3 className="font-semibold text-gray-700">Cycle Settings</h3>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600 mb-1.5 block">
            Average Cycle Length: <span className="text-pink-500">{profile.cycleLength} days</span>
          </label>
          <input type="range" min="21" max="45" value={profile.cycleLength}
            onChange={(e) => setProfile({ ...profile, cycleLength: +e.target.value })}
            className="w-full accent-pink-400" />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>21 days</span><span>28 (average)</span><span>45 days</span>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600 mb-1.5 block">
            Average Period Duration: <span className="text-pink-500">{profile.periodDuration} days</span>
          </label>
          <input type="range" min="1" max="10" value={profile.periodDuration}
            onChange={(e) => setProfile({ ...profile, periodDuration: +e.target.value })}
            className="w-full accent-pink-400" />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>1 day</span><span>5 days</span><span>10 days</span>
          </div>
        </div>
      </GlassCard>

      {/* ── Water Goal ───────────────────────────────────── */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Droplets className="text-blue-400" size={18} />
          <h3 className="font-semibold text-gray-700">Water Goal</h3>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600 mb-1.5 block">
            Daily Water Goal: <span className="text-blue-500">{profile.waterGoal} glasses</span>
          </label>
          <input type="range" min="4" max="16" value={profile.waterGoal}
            onChange={(e) => setProfile({ ...profile, waterGoal: +e.target.value })}
            className="w-full accent-blue-400" />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>4 glasses</span><span>8 (recommended)</span><span>16 glasses</span>
          </div>
        </div>
      </GlassCard>

      {/* ── App Info ─────────────────────────────────────── */}
      <GlassCard className="p-4">
        {[
          { icon: <Shield size={16} />, label: "Privacy Policy",   href: "#" },
          { icon: <Bell size={16} />,   label: "Notification Settings", href: "#" },
        ].map((item) => (
          <a key={item.label} href={item.href}
            className="flex items-center justify-between py-3 border-b border-pink-50 last:border-0 text-gray-600 hover:text-pink-500 transition-colors">
            <div className="flex items-center gap-3 text-sm">
              <span className="text-pink-400">{item.icon}</span>
              {item.label}
            </div>
            <ChevronRight size={16} className="text-gray-300" />
          </a>
        ))}
      </GlassCard>

      {/* ── Actions ──────────────────────────────────────── */}
      <div className="flex gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={handleSave} disabled={saving}
          className="btn-primary flex-1 flex items-center justify-center gap-2"
        >
          {saving ? (
            <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
            </svg> Saving...</>
          ) : (
            <><Save size={16} /> Save Settings</>
          )}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl border-2 border-red-200 text-red-400 hover:bg-red-50 transition-all font-semibold text-sm"
        >
          <LogOut size={16} /> Log Out
        </motion.button>
      </div>

      {/* App version */}
      <p className="text-center text-xs text-gray-300 pb-4">LunaFlow v1.0.0 — Made with 💗</p>
    </div>
  );
}
