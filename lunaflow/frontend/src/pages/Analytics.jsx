// ============================================================
// src/pages/Analytics.jsx — Charts & Insights
// ============================================================

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend, CartesianGrid,
} from "recharts";
import { format, parseISO } from "date-fns";
import { cycleAPI, moodAPI } from "../utils/api";
import { GlassCard, SectionTitle } from "../components/Card";

const PINK_PALETTE = ["#f472b6", "#c084fc", "#fb923c", "#34d399", "#60a5fa", "#fbbf24", "#a78bfa"];

// Custom tooltip for recharts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 backdrop-blur-sm border border-pink-100 rounded-2xl px-4 py-2 shadow-lg text-xs">
        <p className="font-semibold text-gray-700 mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>{p.name}: {p.value}</p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Analytics() {
  const [cycles, setCycles]     = useState([]);
  const [moodData, setMoodData] = useState({});
  const [symptomData, setSymptomData] = useState({});
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [cycleRes, moodRes] = await Promise.all([cycleAPI.getAll(), moodAPI.analytics()]);
        setCycles(cycleRes.data.cycles || []);
        setMoodData(moodRes.data.moodCount || {});
        setSymptomData(moodRes.data.symptomCount || {});
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ── Build chart datasets ──────────────────────────────────
  // Cycle length over time
  const cycleLengthData = [...cycles].reverse().map((c, i) => ({
    name: `Cycle ${i + 1}`,
    length: c.cycleLength || 28,
    date: c.startDate ? format(new Date(c.startDate), "MMM d") : "",
  }));

  // Mood distribution pie
  const moodPieData = Object.entries(moodData).map(([name, value]) => ({ name, value }));

  // Symptom frequency bar
  const symptomBarData = Object.entries(symptomData)
    .sort(([, a], [, b]) => b - a)
    .map(([name, count]) => ({ name, count }));

  // Pain level trend
  const painData = [...cycles].reverse().map((c, i) => ({
    name: `Cycle ${i + 1}`,
    pain: c.painLevel || 1,
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center"><div className="text-4xl mb-3 animate-pulse">📊</div>
          <p className="text-pink-400">Loading your analytics...</p></div>
      </div>
    );
  }

  if (cycles.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="font-display text-xl font-semibold text-gray-700 mb-2">No data yet</h3>
        <p className="text-gray-400 text-sm">Log at least 2–3 cycles to unlock your analytics!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-800">Analytics 📊</h1>
        <p className="text-gray-500 text-sm mt-1">Insights from your cycle history</p>
      </div>

      {/* ── Summary Stats ────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Avg Cycle", value: `${Math.round(cycles.reduce((s, c) => s + (c.cycleLength || 28), 0) / cycles.length)}d`, icon: "📅" },
          { label: "Cycles Tracked", value: cycles.length, icon: "🌸" },
          { label: "Most Common Mood", value: Object.entries(moodData).sort(([,a],[,b])=>b-a)[0]?.[0] || "—", icon: "😊" },
          { label: "Top Symptom", value: Object.entries(symptomData).sort(([,a],[,b])=>b-a)[0]?.[0] || "—", icon: "📝" },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <GlassCard className="text-center py-5">
              <div className="text-3xl mb-2">{s.icon}</div>
              <p className="text-xl font-bold text-gray-800 capitalize">{s.value}</p>
              <p className="text-xs text-gray-400 mt-1">{s.label}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* ── Cycle Length Chart ───────────────────────────── */}
      <GlassCard className="p-6">
        <SectionTitle title="Cycle Length Over Time" subtitle="Consistency of your cycles (days)" />
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={cycleLengthData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#fce7f3" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#9ca3af" }} />
            <YAxis domain={[20, 40]} tick={{ fontSize: 11, fill: "#9ca3af" }} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone" dataKey="length" name="Cycle Length"
              stroke="#ec4899" strokeWidth={2.5}
              dot={{ r: 5, fill: "#ec4899", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 7 }}
            />
            {/* Average line */}
            <Line
              type="monotone" dataKey={() => Math.round(cycles.reduce((s,c)=>s+(c.cycleLength||28),0)/cycles.length)}
              name="Average" stroke="#c084fc" strokeWidth={1.5} strokeDasharray="5 5"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </GlassCard>

      {/* ── Mood + Symptoms Side by Side ─────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Mood Pie Chart */}
        <GlassCard className="p-6">
          <SectionTitle title="Mood Distribution" subtitle="Across all logged cycles" />
          {moodPieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={moodPieData} cx="50%" cy="50%"
                  innerRadius={50} outerRadius={85}
                  dataKey="value" paddingAngle={3}
                >
                  {moodPieData.map((_, i) => (
                    <Cell key={i} fill={PINK_PALETTE[i % PINK_PALETTE.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value} times`, name]}
                  contentStyle={{ borderRadius: "12px", border: "1px solid #fce7f3" }}
                />
                <Legend
                  formatter={(value) => <span className="text-xs capitalize text-gray-600">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-400 text-sm py-10">No mood data yet</p>
          )}
        </GlassCard>

        {/* Symptom Frequency Bar */}
        <GlassCard className="p-6">
          <SectionTitle title="Symptom Frequency" subtitle="Most common symptoms" />
          {symptomBarData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={symptomBarData} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 11, fill: "#9ca3af" }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: "#9ca3af" }} width={90} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Count" radius={[0, 8, 8, 0]}>
                  {symptomBarData.map((_, i) => (
                    <Cell key={i} fill={PINK_PALETTE[i % PINK_PALETTE.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-400 text-sm py-10">No symptom data yet</p>
          )}
        </GlassCard>
      </div>

      {/* ── Pain Level Trend ─────────────────────────────── */}
      {painData.length > 1 && (
        <GlassCard className="p-6">
          <SectionTitle title="Pain Level Trend" subtitle="Pain intensity across cycles (1–10)" />
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={painData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#fce7f3" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9ca3af" }} />
              <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: "#9ca3af" }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="pain" name="Pain Level" fill="#f472b6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>
      )}

      {/* ── Wellness Insights ────────────────────────────── */}
      <GlassCard className="p-6">
        <SectionTitle title="💡 Wellness Insights" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            cycles.reduce((s,c)=>s+(c.cycleLength||28),0)/cycles.length > 30
              ? "⚠️ Your average cycle is longer than 30 days. Consider consulting a healthcare provider if this persists."
              : "✅ Your cycle length is within the typical 21–35 day range.",
            moodData["happy"] > (moodData["sad"] || 0)
              ? "😊 Great news! You've logged more happy days than sad ones."
              : "💗 Take extra care of your mental health. Consider journaling during tough days.",
            symptomData["cramps"] > 2
              ? "🩸 You frequently experience cramps. Magnesium-rich foods and heat therapy may help."
              : "✨ You've reported minimal cramping. Keep up your healthy habits!",
            cycles.length >= 3
              ? "📊 Great tracking consistency! Your predictions are becoming more accurate."
              : "📝 Log more cycles to improve prediction accuracy.",
          ].map((tip, i) => (
            <div key={i} className="bg-pink-50 rounded-2xl p-4 text-sm text-gray-600 leading-relaxed">
              {tip}
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
