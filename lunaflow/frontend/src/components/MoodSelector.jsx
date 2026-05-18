// ============================================================
// src/components/MoodSelector.jsx — Mood Picker UI
// ============================================================

import React from "react";
import { motion } from "framer-motion";

const moods = [
  { value: "happy",     emoji: "😊", label: "Happy",     color: "bg-yellow-100 border-yellow-300" },
  { value: "sad",       emoji: "😢", label: "Sad",       color: "bg-blue-100 border-blue-300" },
  { value: "irritated", emoji: "😤", label: "Irritated", color: "bg-orange-100 border-orange-300" },
  { value: "tired",     emoji: "😴", label: "Tired",     color: "bg-purple-100 border-purple-300" },
  { value: "emotional", emoji: "🥺", label: "Emotional", color: "bg-pink-100 border-pink-300" },
  { value: "anxious",   emoji: "😰", label: "Anxious",   color: "bg-teal-100 border-teal-300" },
  { value: "normal",    emoji: "😌", label: "Normal",    color: "bg-green-100 border-green-300" },
];

export default function MoodSelector({ selected, onChange, label = "How are you feeling?" }) {
  return (
    <div>
      {label && <p className="text-sm font-medium text-gray-600 mb-3">{label}</p>}
      <div className="flex flex-wrap gap-2">
        {moods.map((mood) => (
          <motion.button
            key={mood.value}
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange(mood.value)}
            className={`
              flex flex-col items-center gap-1 px-3 py-2 rounded-2xl border-2 transition-all text-xs font-medium
              ${selected === mood.value
                ? `${mood.color} scale-105 shadow-sm`
                : "bg-white border-gray-100 text-gray-400 hover:border-pink-200"
              }
            `}
          >
            <span className="text-xl">{mood.emoji}</span>
            <span>{mood.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// Export moods array for use in other components
export { moods };
