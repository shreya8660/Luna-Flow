// ============================================================
// src/pages/Calendar.jsx — Interactive Period Calendar
// ============================================================

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  format, startOfMonth, endOfMonth, eachDayOfInterval,
  isSameMonth, isToday, getDay, addMonths, subMonths,
  parseISO, isWithinInterval, addDays,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cycleAPI } from "../utils/api";
import { calculatePredictions } from "../utils/cycleLogic";
import { GlassCard } from "../components/Card";
import { useAuth } from "../context/AuthContext";

export default function Calendar() {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [cycles, setCycles]           = useState([]);
  const [predictions, setPredictions] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    fetchCycles();
  }, []);

  const fetchCycles = async () => {
    try {
      const { data } = await cycleAPI.getAll();
      setCycles(data.cycles || []);
      const preds = calculatePredictions(data.cycles, user?.cycleLength || 28);
      setPredictions(preds);
    } finally {
      setLoading(false);
    }
  };

  // ── Build days for current month view ─────────────────────
  const monthStart = startOfMonth(currentDate);
  const monthEnd   = endOfMonth(currentDate);
  const days       = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Leading empty cells (for weekday alignment)
  const startDayOfWeek = getDay(monthStart); // 0=Sun
  const leadingBlanks  = Array(startDayOfWeek).fill(null);

  // ── Determine day type ────────────────────────────────────
  const getDayStyle = (date) => {
    const d = date;

    // Is a period day?
    for (const cycle of cycles) {
      const start = parseISO(cycle.startDate.toString().split("T")[0]);
      const end   = cycle.endDate
        ? parseISO(cycle.endDate.toString().split("T")[0])
        : addDays(start, cycle.periodDuration || 5);
      if (isWithinInterval(d, { start, end })) {
        return { type: "period", cls: "bg-pink-400 text-white" };
      }
    }

    // Ovulation
    if (predictions?.ovulationDate) {
      const ov = new Date(predictions.ovulationDate);
      if (d.toDateString() === ov.toDateString()) {
        return { type: "ovulation", cls: "bg-purple-500 text-white ring-2 ring-purple-300" };
      }
    }

    // Fertile window
    if (predictions?.fertileWindowStart && predictions?.fertileWindowEnd) {
      const fs = new Date(predictions.fertileWindowStart);
      const fe = new Date(predictions.fertileWindowEnd);
      if (isWithinInterval(d, { start: fs, end: fe })) {
        return { type: "fertile", cls: "bg-teal-200 text-teal-800" };
      }
    }

    return { type: "normal", cls: "" };
  };

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const dayInfo = selectedDay ? getDayStyle(selectedDay) : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-800">Calendar 📅</h1>
        <p className="text-gray-500 text-sm mt-1">Track and visualize your cycle at a glance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Main Calendar ───────────────────────────────── */}
        <GlassCard className="lg:col-span-2 p-6">
          {/* Navigation Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setCurrentDate(subMonths(currentDate, 1))}
              className="p-2 rounded-xl hover:bg-pink-50 text-pink-400 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>

            <h2 className="font-display text-xl font-semibold text-gray-800">
              {format(currentDate, "MMMM yyyy")}
            </h2>

            <button
              onClick={() => setCurrentDate(addMonths(currentDate, 1))}
              className="p-2 rounded-xl hover:bg-pink-50 text-pink-400 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 mb-2">
            {weekdays.map((d) => (
              <div key={d} className="text-center text-xs font-semibold text-pink-400 py-2">{d}</div>
            ))}
          </div>

          {/* Day Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Leading blanks */}
            {leadingBlanks.map((_, i) => <div key={`blank-${i}`} />)}

            {/* Days */}
            {days.map((day) => {
              const { cls } = getDayStyle(day);
              const todayStyle = isToday(day) ? "ring-2 ring-pink-500 ring-offset-1" : "";
              const selectedStyle = selectedDay?.toDateString() === day.toDateString()
                ? "scale-110 shadow-lg" : "";
              const notThisMonth = !isSameMonth(day, currentDate) ? "opacity-30" : "";

              return (
                <motion.button
                  key={day.toISOString()}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedDay(day)}
                  className={`
                    aspect-square flex items-center justify-center rounded-full text-sm font-medium
                    transition-all duration-150 cursor-pointer
                    ${cls || "hover:bg-pink-50 text-gray-600"}
                    ${todayStyle} ${selectedStyle} ${notThisMonth}
                  `}
                >
                  {format(day, "d")}
                </motion.button>
              );
            })}
          </div>
        </GlassCard>

        {/* ── Legend + Day Info ───────────────────────────── */}
        <div className="space-y-4">
          {/* Legend */}
          <GlassCard className="p-5">
            <h3 className="font-semibold text-gray-700 mb-4 text-sm">Legend</h3>
            <div className="space-y-3">
              {[
                { cls: "bg-pink-400", label: "Period Days" },
                { cls: "bg-teal-200", label: "Fertile Window" },
                { cls: "bg-purple-500", label: "Ovulation" },
                { cls: "ring-2 ring-pink-500 bg-white", label: "Today" },
              ].map(({ cls, label }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full ${cls}`} />
                  <span className="text-sm text-gray-600">{label}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Selected Day Info */}
          {selectedDay && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <GlassCard className="p-5">
                <h3 className="font-semibold text-gray-700 mb-3 text-sm">
                  {format(selectedDay, "MMMM d, yyyy")}
                </h3>
                <div className={`
                  flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium
                  ${dayInfo?.type === "period" ? "bg-pink-100 text-pink-700" :
                    dayInfo?.type === "ovulation" ? "bg-purple-100 text-purple-700" :
                    dayInfo?.type === "fertile" ? "bg-teal-100 text-teal-700" :
                    "bg-gray-50 text-gray-500"}
                `}>
                  {dayInfo?.type === "period"    && "🩸 Period Day"}
                  {dayInfo?.type === "ovulation" && "🌿 Ovulation Day"}
                  {dayInfo?.type === "fertile"   && "✨ Fertile Window"}
                  {dayInfo?.type === "normal"    && "☀️ Regular Day"}
                </div>

                {dayInfo?.type === "ovulation" && (
                  <p className="text-xs text-gray-500 mt-2">
                    Peak fertility! The egg is released around this time.
                  </p>
                )}
                {dayInfo?.type === "fertile" && (
                  <p className="text-xs text-gray-500 mt-2">
                    You're in your fertile window. Sperm can survive 3–5 days.
                  </p>
                )}
                {dayInfo?.type === "period" && (
                  <p className="text-xs text-gray-500 mt-2">
                    Period day. Rest, hydrate, and be kind to yourself 💗
                  </p>
                )}
              </GlassCard>
            </motion.div>
          )}

          {/* Upcoming Predictions */}
          {predictions?.nextPeriodDate && (
            <GlassCard className="p-5">
              <h3 className="font-semibold text-gray-700 mb-3 text-sm">Predictions</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-pink-400">🌸</span>
                  <div>
                    <p className="font-medium text-gray-700">Next Period</p>
                    <p className="text-gray-400 text-xs">{predictions.formattedNextPeriod}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-400">🌿</span>
                  <div>
                    <p className="font-medium text-gray-700">Ovulation</p>
                    <p className="text-gray-400 text-xs">{predictions.formattedOvulation}</p>
                  </div>
                </div>
              </div>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
}
