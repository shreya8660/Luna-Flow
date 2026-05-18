// ============================================================
// src/pages/Dashboard.jsx — Main Dashboard
// ============================================================

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Droplets, Heart, Zap, Calendar, Moon } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import toast from "react-hot-toast";

import { useAuth }        from "../context/AuthContext";
import { cycleAPI }       from "../utils/api";
import { calculatePredictions, getDailyQuote, getWellnessTip } from "../utils/cycleLogic";
import { GlassCard, StatCard } from "../components/Card";
import Modal             from "../components/Modal";
import WaterTracker      from "../components/WaterTracker";
import MoodSelector      from "../components/MoodSelector";
import SymptomTracker    from "../components/SymptomTracker";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0 },
};

export default function Dashboard() {
  const { user }          = useAuth();
  const [cycles, setCycles]         = useState([]);
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading]       = useState(true);
  const [modalOpen, setModalOpen]   = useState(false);

  // Log period form state
  const [newCycle, setNewCycle] = useState({
    startDate: format(new Date(), "yyyy-MM-dd"),
    endDate: "",
    flow: "medium",
    mood: "normal",
    symptoms: [],
    notes: "",
    painLevel: 1,
  });

  const quote = getDailyQuote();

  // ── Fetch cycles on mount ────────────────────────────────
  useEffect(() => {
    fetchCycles();
  }, []);

  const fetchCycles = async () => {
    try {
      const { data } = await cycleAPI.getAll();
      setCycles(data.cycles || []);
      const preds = calculatePredictions(data.cycles, user?.cycleLength || 28);
      setPredictions(preds);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ── Log new period ───────────────────────────────────────
  const handleLogPeriod = async () => {
    try {
      await cycleAPI.add(newCycle);
      toast.success("Period logged! 🌸");
      setModalOpen(false);
      fetchCycles();
    } catch (err) {
      toast.error("Failed to log period");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-4xl mb-3 animate-pulse">🌙</div>
          <p className="text-pink-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const hasData = cycles.length > 0;

  return (
    <div className="space-y-6">

      {/* ── Welcome Header ────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between flex-wrap gap-4"
      >
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-gray-800">
            Hello, {user?.name?.split(" ")[0]}! 🌸
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            {format(new Date(), "EEEE, MMMM d, yyyy")}
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => setModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} /> Log Period
        </motion.button>
      </motion.div>

      {/* ── Daily Quote Card ──────────────────────────────── */}
      <motion.div
        initial="hidden" animate="show" variants={fadeUp}
        className="bg-gradient-to-r from-pink-400 to-purple-500 rounded-3xl p-6 text-white relative overflow-hidden"
      >
        <div className="absolute -right-6 -top-6 text-8xl opacity-20">🌙</div>
        <p className="text-xs font-medium uppercase tracking-wider opacity-80 mb-2">Daily Wisdom</p>
        <p className="text-lg font-display font-semibold leading-snug">{quote.text}</p>
        <p className="text-xs opacity-70 mt-2">— {quote.author}</p>
      </motion.div>

      {/* ── Stats Grid ────────────────────────────────────── */}
      <motion.div
        initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.07 } } }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <motion.div variants={fadeUp}>
          <StatCard
            icon="🌸"
            label="Next Period"
            value={hasData ? (predictions?.daysUntilNextPeriod > 0
              ? `${predictions.daysUntilNextPeriod}d`
              : "Today!") : "—"}
            sub={hasData ? predictions?.formattedNextPeriod : "Log a cycle first"}
            gradient="bg-gradient-to-br from-pink-100 to-pink-200 text-pink-800"
          />
        </motion.div>

        <motion.div variants={fadeUp}>
          <StatCard
            icon="📅"
            label="Cycle Day"
            value={hasData ? `Day ${predictions?.currentCycleDay || "—"}` : "—"}
            sub={`of ${predictions?.avgCycleLength || 28} days`}
            gradient="bg-gradient-to-br from-purple-100 to-purple-200 text-purple-800"
          />
        </motion.div>

        <motion.div variants={fadeUp}>
          <StatCard
            icon="🌿"
            label="Fertile Window"
            value={hasData ? (predictions?.fertileWindowStart
              ? format(new Date(predictions.fertileWindowStart), "MMM d")
              : "—") : "—"}
            sub={hasData ? `to ${format(new Date(predictions?.fertileWindowEnd || new Date()), "MMM d")}` : "Track cycles to see"}
            gradient="bg-gradient-to-br from-green-100 to-teal-100 text-teal-800"
          />
        </motion.div>

        <motion.div variants={fadeUp}>
          <StatCard
            icon="💗"
            label="Cycles Logged"
            value={cycles.length}
            sub={cycles.length === 0 ? "Start tracking!" : `Last: ${format(new Date(cycles[0]?.startDate || new Date()), "MMM d")}`}
            gradient="bg-gradient-to-br from-rose-100 to-orange-100 text-rose-800"
          />
        </motion.div>
      </motion.div>

      {/* ── Wellness Tip ─────────────────────────────────── */}
      {hasData && (
        <GlassCard className="flex items-start gap-4">
          <div className="text-3xl">💡</div>
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-1">Wellness Tip</p>
            <p className="text-sm text-gray-500 leading-relaxed">
              {getWellnessTip(predictions?.currentCycleDay)}
            </p>
          </div>
        </GlassCard>
      )}

      {/* ── Bottom Row: Water + Mood + Recent Cycles ─────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Water Tracker */}
        <WaterTracker goal={user?.waterGoal || 8} />

        {/* Mood Today */}
        <GlassCard className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Heart className="text-pink-400" size={18} />
            <h3 className="font-semibold text-gray-700 text-sm">Today's Mood</h3>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[
              { e: "😊", l: "Happy" }, { e: "😢", l: "Sad" },
              { e: "😤", l: "Irritated" }, { e: "😴", l: "Tired" },
              { e: "🥺", l: "Emotional" }, { e: "😰", l: "Anxious" },
              { e: "😌", l: "Normal" }, { e: "⚡", l: "Energetic" },
            ].map((m) => (
              <button
                key={m.l}
                title={m.l}
                className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-pink-50 transition-colors text-xs text-gray-400"
              >
                <span className="text-xl">{m.e}</span>
              </button>
            ))}
          </div>
        </GlassCard>

        {/* Recent Cycles */}
        <GlassCard>
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="text-pink-400" size={18} />
            <h3 className="font-semibold text-gray-700 text-sm">Recent Cycles</h3>
          </div>
          {cycles.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-4">No cycles logged yet.</p>
          ) : (
            <div className="space-y-2">
              {cycles.slice(0, 4).map((c) => (
                <div key={c._id} className="flex items-center justify-between py-2 border-b border-pink-50 last:border-0">
                  <div>
                    <p className="text-xs font-medium text-gray-600">
                      {format(new Date(c.startDate), "MMM d, yyyy")}
                    </p>
                    <p className="text-xs text-pink-400">{c.flow} flow</p>
                  </div>
                  <span className="text-xs bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full">
                    {c.cycleLength}d cycle
                  </span>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>

      {/* ── Empty State ───────────────────────────────────── */}
      {!hasData && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-6xl mb-4">🌸</div>
          <h3 className="font-display text-xl font-semibold text-gray-700 mb-2">
            Ready to start tracking?
          </h3>
          <p className="text-gray-400 text-sm mb-6">
            Log your first period to unlock predictions, analytics, and personalized insights.
          </p>
          <button onClick={() => setModalOpen(true)} className="btn-primary">
            Log My First Period 🌙
          </button>
        </motion.div>
      )}

      {/* ── Log Period Modal ──────────────────────────────── */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="🌸 Log Your Period" maxWidth="lg"  >
        <div className="space-y-5 ">
          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1.5 block">Start Date *</label>
              <input type="date" value={newCycle.startDate}
                onChange={(e) => setNewCycle({ ...newCycle, startDate: e.target.value })}
                className="input-pink" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1.5 block">End Date</label>
              <input type="date" value={newCycle.endDate}
                onChange={(e) => setNewCycle({ ...newCycle, endDate: e.target.value })}
                className="input-pink" />
            </div>
          </div>

          {/* Flow */}
          <div>
            <label className="text-sm font-medium text-gray-600 mb-2 block">Flow Intensity</label>
            <div className="flex gap-2">
              {["spotting", "light", "medium", "heavy"].map((f) => (
                <button key={f} type="button"
                  onClick={() => setNewCycle({ ...newCycle, flow: f })}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border-2 transition-all capitalize
                    ${newCycle.flow === f ? "bg-pink-100 border-pink-400 text-pink-700" : "border-gray-100 text-gray-400"}`}
                >
                  {f === "spotting" ? "🔴" : f === "light" ? "🩸" : f === "medium" ? "💗" : "❤️"} {f}
                </button>
              ))}
            </div>
          </div>

          {/* Mood */}
          <MoodSelector
            selected={newCycle.mood}
            onChange={(m) => setNewCycle({ ...newCycle, mood: m })}
          />

          {/* Symptoms */}
          <SymptomTracker
            selected={newCycle.symptoms}
            onChange={(s) => setNewCycle({ ...newCycle, symptoms: s })}
          />

          {/* Pain Level */}
          <div>
            <label className="text-sm font-medium text-gray-600 mb-2 block">
              Pain Level: {newCycle.painLevel}/10
            </label>
            <input type="range" min="1" max="10" value={newCycle.painLevel}
              onChange={(e) => setNewCycle({ ...newCycle, painLevel: +e.target.value })}
              className="w-full accent-pink-400" />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>No pain</span><span>Moderate</span><span>Severe</span>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1.5 block">Notes (optional)</label>
            <textarea
              value={newCycle.notes}
              onChange={(e) => setNewCycle({ ...newCycle, notes: e.target.value })}
              placeholder="How are you feeling? Any observations..."
              rows={3}
              className="input-pink resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button onClick={() => setModalOpen(false)} className="btn-ghost flex-1">Cancel</button>
            <button onClick={handleLogPeriod} className="btn-primary flex-1">Save Period 🌸</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
