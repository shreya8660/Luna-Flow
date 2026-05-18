// ============================================================
// src/components/WaterTracker.jsx — Water Intake Ring Tracker
// ============================================================

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Droplets, Plus, Minus } from "lucide-react";
import { GlassCard } from "./Card";
import toast from "react-hot-toast";

export default function WaterTracker({ goal = 8 }) {
  const [glasses, setGlasses] = useState(0);

  const percentage = Math.min((glasses / goal) * 100, 100);

  // SVG circle math
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDash = (percentage / 100) * circumference;

  const add = () => {
    if (glasses < goal) {
      setGlasses((g) => g + 1);
      if (glasses + 1 === goal) toast.success("🎉 Daily water goal reached!");
    }
  };

  const remove = () => {
    if (glasses > 0) setGlasses((g) => g - 1);
  };

  const colorMap = {
    0: "#e9d5ff",
    25: "#93c5fd",
    50: "#60a5fa",
    75: "#3b82f6",
    100: "#1d4ed8",
  };

  const progressColor =
    percentage >= 100 ? colorMap[100] :
    percentage >= 75  ? colorMap[75]  :
    percentage >= 50  ? colorMap[50]  :
    percentage >= 25  ? colorMap[25]  : colorMap[0];

  return (
    <GlassCard className="flex flex-col items-center">
      <div className="flex items-center gap-2 w-full mb-4">
        <Droplets className="text-blue-400" size={18} />
        <h3 className="font-semibold text-gray-700 text-sm">Water Intake</h3>
        <span className="ml-auto text-xs text-gray-400">Goal: {goal} glasses</span>
      </div>

      {/* SVG Ring */}
      <div className="relative w-28 h-28 mb-4">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          {/* Background circle */}
          <circle
            cx="50" cy="50" r={radius}
            fill="none" stroke="#f0f9ff"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <motion.circle
            cx="50" cy="50" r={radius}
            fill="none" stroke={progressColor}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${circumference}`}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - strokeDash }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-blue-500">{glasses}</span>
          <span className="text-xs text-gray-400">/{goal}</span>
        </div>
      </div>

      {/* Glasses visual */}
      <div className="flex flex-wrap justify-center gap-1 mb-4 max-w-[160px]">
        {Array.from({ length: goal }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.03 }}
            className={`text-lg ${i < glasses ? "opacity-100" : "opacity-20"}`}
          >
            💧
          </motion.div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={remove}
          disabled={glasses === 0}
          className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 disabled:opacity-40 transition-colors"
        >
          <Minus size={16} className="text-gray-500" />
        </button>
        <span className="text-sm font-medium text-gray-600 min-w-[80px] text-center">
          {glasses === 0 ? "Stay hydrated!" :
           glasses < goal ? `${goal - glasses} more to go` :
           "Goal reached! 🎉"}
        </span>
        <button
          onClick={add}
          disabled={glasses >= goal}
          className="p-2 rounded-xl bg-blue-100 hover:bg-blue-200 disabled:opacity-40 transition-colors"
        >
          <Plus size={16} className="text-blue-500" />
        </button>
      </div>
    </GlassCard>
  );
}
