// ============================================================
// src/components/SymptomTracker.jsx — Symptom Multi-Select
// ============================================================

import React from "react";
import { motion } from "framer-motion";

const symptoms = [
  { value: "cramps",          emoji: "🩸", label: "Cramps" },
  { value: "headache",        emoji: "🤕", label: "Headache" },
  { value: "acne",            emoji: "🔴", label: "Acne" },
  { value: "bloating",        emoji: "🫧", label: "Bloating" },
  { value: "fatigue",         emoji: "😩", label: "Fatigue" },
  { value: "nausea",          emoji: "🤢", label: "Nausea" },
  { value: "backPain",        emoji: "💢", label: "Back Pain" },
  { value: "breastTenderness",emoji: "💗", label: "Breast Tenderness" },
  { value: "moodSwings",      emoji: "🎭", label: "Mood Swings" },
];

export default function SymptomTracker({ selected = [], onChange, label = "Symptoms today" }) {
  const toggle = (symptom) => {
    if (selected.includes(symptom)) {
      onChange(selected.filter((s) => s !== symptom));
    } else {
      onChange([...selected, symptom]);
    }
  };

  return (
    <div>
      {label && <p className="text-sm font-medium text-gray-600 mb-3">{label}</p>}
      <div className="flex flex-wrap gap-2">
        {symptoms.map((s) => (
          <motion.button
            key={s.value}
            type="button"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => toggle(s.value)}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 text-xs font-medium transition-all
              ${selected.includes(s.value)
                ? "bg-pink-100 border-pink-400 text-pink-700"
                : "bg-white border-gray-100 text-gray-400 hover:border-pink-200"
              }
            `}
          >
            <span>{s.emoji}</span>
            {s.label}
          </motion.button>
        ))}
      </div>
      {selected.length > 0 && (
        <p className="text-xs text-pink-400 mt-2">{selected.length} symptom(s) selected</p>
      )}
    </div>
  );
}

export { symptoms };
