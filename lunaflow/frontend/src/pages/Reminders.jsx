// ============================================================
// src/pages/Reminders.jsx — Reminders & Alerts
// ============================================================

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Check, Bell, Droplets, Pill, Calendar, Star } from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { reminderAPI } from "../utils/api";
import { GlassCard } from "../components/Card";
import Modal from "../components/Modal";

const typeConfig = {
  period:     { icon: "🌸", label: "Period",     color: "bg-pink-100 text-pink-600" },
  medication: { icon: "💊", label: "Medication", color: "bg-blue-100 text-blue-600" },
  water:      { icon: "💧", label: "Water",      color: "bg-cyan-100 text-cyan-600" },
  ovulation:  { icon: "🌿", label: "Ovulation",  color: "bg-teal-100 text-teal-600" },
  custom:     { icon: "⭐", label: "Custom",     color: "bg-purple-100 text-purple-600" },
};

const quickReminders = [
  { title: "Period prep reminder",   type: "period",     description: "Stock up on pads/tampons!" },
  { title: "Drink 8 glasses today",  type: "water",      description: "Stay hydrated 💧" },
  { title: "Take medication",        type: "medication", description: "Daily medication reminder" },
  { title: "Ovulation window",       type: "ovulation",  description: "Fertile window approaching" },
];

export default function Reminders() {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm]           = useState({
    title: "", description: "", type: "custom",
    date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    recurring: false, frequency: "daily",
  });

  useEffect(() => { fetchReminders(); }, []);

  const fetchReminders = async () => {
    try {
      const { data } = await reminderAPI.getAll();
      setReminders(data.reminders || []);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    try {
      await reminderAPI.add(form);
      toast.success("Reminder set! ⏰");
      setModalOpen(false);
      fetchReminders();
      setForm({ title: "", description: "", type: "custom",
        date: format(new Date(), "yyyy-MM-dd'T'HH:mm"), recurring: false, frequency: "daily" });
    } catch { toast.error("Failed to set reminder"); }
  };

  const handleToggle = async (id) => {
    try {
      const { data } = await reminderAPI.toggle(id);
      setReminders((r) => r.map((x) => x._id === id ? data.reminder : x));
    } catch { toast.error("Failed to update"); }
  };

  const handleDelete = async (id) => {
    try {
      await reminderAPI.delete(id);
      setReminders((r) => r.filter((x) => x._id !== id));
      toast.success("Reminder deleted");
    } catch { toast.error("Failed to delete"); }
  };

  const addQuick = (q) => {
    setForm({ ...form, title: q.title, description: q.description, type: q.type });
    setModalOpen(true);
  };

  const pending   = reminders.filter((r) => !r.completed);
  const completed = reminders.filter((r) => r.completed);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-800">Reminders 🔔</h1>
          <p className="text-gray-500 text-sm mt-1">Never miss an important date</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
          onClick={() => setModalOpen(true)} className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} /> Add Reminder
        </motion.button>
      </div>

      {/* Quick Add */}
      <GlassCard className="p-5">
        <p className="text-sm font-semibold text-gray-700 mb-3">Quick Add</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickReminders.map((q) => (
            <button key={q.title} onClick={() => addQuick(q)}
              className="flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 border-dashed border-pink-200 hover:border-pink-400 hover:bg-pink-50 transition-all text-xs text-gray-500">
              <span className="text-xl">{typeConfig[q.type].icon}</span>
              <span className="font-medium text-center leading-tight">{q.title}</span>
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Pending Reminders */}
      <div>
        <h2 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
          Upcoming ({pending.length})
        </h2>
        {pending.length === 0 ? (
          <GlassCard className="text-center py-10">
            <Bell className="mx-auto text-pink-200 mb-3" size={32} />
            <p className="text-gray-400 text-sm">No upcoming reminders. Add one above!</p>
          </GlassCard>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {pending.map((r) => (
                <motion.div
                  key={r._id}
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white/70 backdrop-blur-sm border border-pink-100 rounded-2xl p-4 flex items-center gap-4 shadow-card"
                >
                  {/* Type icon */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${typeConfig[r.type]?.color || typeConfig.custom.color}`}>
                    {typeConfig[r.type]?.icon || "⭐"}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-sm">{r.title}</p>
                    {r.description && <p className="text-xs text-gray-400 mt-0.5">{r.description}</p>}
                    <p className="text-xs text-pink-400 mt-1">
                      {format(new Date(r.date), "MMM d, yyyy · h:mm a")}
                      {r.recurring && ` · Repeats ${r.frequency}`}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => handleToggle(r._id)}
                      className="p-2 rounded-xl bg-green-50 hover:bg-green-100 text-green-500 transition-colors">
                      <Check size={16} />
                    </button>
                    <button onClick={() => handleDelete(r._id)}
                      className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-400 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Completed */}
      {completed.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wide">
            Completed ({completed.length})
          </h2>
          <div className="space-y-2">
            {completed.map((r) => (
              <div key={r._id}
                className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex items-center gap-3 opacity-60">
                <div className="w-8 h-8 rounded-xl bg-green-100 flex items-center justify-center">
                  <Check size={14} className="text-green-500" />
                </div>
                <span className="text-sm text-gray-500 line-through flex-1">{r.title}</span>
                <button onClick={() => handleDelete(r._id)}
                  className="text-gray-300 hover:text-red-400 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="🔔 Set Reminder">
        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1.5 block">Title *</label>
            <input type="text" placeholder="Reminder title"
              value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="input-pink" />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1.5 block">Note (optional)</label>
            <input type="text" placeholder="Add a note..."
              value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="input-pink" />
          </div>

          {/* Type */}
          <div>
            <label className="text-sm font-medium text-gray-600 mb-2 block">Type</label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(typeConfig).map(([key, cfg]) => (
                <button key={key} type="button" onClick={() => setForm({ ...form, type: key })}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 text-xs font-medium transition-all
                    ${form.type === key ? `${cfg.color} border-current` : "border-gray-100 text-gray-400"}`}>
                  <span>{cfg.icon}</span>{cfg.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date/Time */}
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1.5 block">Date & Time *</label>
            <input type="datetime-local" value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="input-pink" />
          </div>

          {/* Recurring */}
          <div className="flex items-center gap-3">
            <input type="checkbox" id="recurring" checked={form.recurring}
              onChange={(e) => setForm({ ...form, recurring: e.target.checked })}
              className="w-4 h-4 accent-pink-400" />
            <label htmlFor="recurring" className="text-sm text-gray-600">Repeat this reminder</label>
          </div>

          {form.recurring && (
            <select value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value })}
              className="input-pink">
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button onClick={() => setModalOpen(false)} className="btn-ghost flex-1">Cancel</button>
            <button onClick={handleAdd} className="btn-primary flex-1">Set Reminder ⏰</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
