// ============================================================
// src/components/Navbar.jsx — Top Navigation Bar
// ============================================================

import React from "react";
import { Menu, Bell, Moon, Sun, Search } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { format } from "date-fns";

export default function Navbar({ onMenuClick }) {
  const { user } = useAuth();
  const today = format(new Date(), "EEEE, MMMM d");

  return (
    <header className="sticky top-0 z-10 bg-white/70 backdrop-blur-xl border-b border-pink-100 px-4 md:px-8 py-4">
      <div className="flex items-center justify-between">

        {/* Left: Menu button (mobile) + date */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-xl hover:bg-pink-50 text-pink-500 transition-colors"
          >
            <Menu size={22} />
          </button>

          <div className="hidden md:block">
            <p className="text-xs text-pink-400 font-medium">{today}</p>
            <p className="text-sm font-semibold text-gray-700">
              Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 17 ? "afternoon" : "evening"},{" "}
              {user?.name?.split(" ")[0]}! 💗
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Search (decorative) */}
          <button className="p-2 rounded-xl hover:bg-pink-50 text-pink-400 transition-colors hidden md:flex">
            <Search size={18} />
          </button>

          {/* Notification Bell */}
          <button className="relative p-2 rounded-xl hover:bg-pink-50 text-pink-400 transition-colors">
            <Bell size={18} />
            {/* Notification dot */}
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-pink-500 rounded-full"></span>
          </button>

          {/* Avatar */}
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:shadow-pink-soft transition-shadow">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
        </div>
      </div>
    </header>
  );
}
