// ============================================================
// src/pages/Journal.jsx — Private Notes Journal
// ============================================================

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Edit3, Save, X, BookOpen } from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { noteAPI } from "../utils/api";
import { GlassCard } from "../components/Card";
import Modal from "../components/Modal";
import MoodSelector from "../components/MoodSelector";

const colorMap = {
  pink:     "bg-pink-50 border-pink-200",
  lavender: "bg-purple-50 border-purple-200",
  peach:    "bg-orange-50 border-orange-200",
  mint:     "bg-teal-50 border-teal-200",
  white:    "bg-white border-gray-200",
};

const colorDotMap = {
  pink:     "bg-pink-400",
  lavender: "bg-purple-400",
  peach:    "bg-orange-400",
  mint:     "bg-teal-400",
  white:    "bg-gray-300",
};

export default function Journal() {
  const [notes, setNotes]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editNote, setEditNote] = useState(null);
  const [form, setForm]         = useState({
    title: "", content: "", mood: "", color: "pink",
  });

  useEffect(() => { fetchNotes(); }, []);

  const fetchNotes = async () => {
    try {
      const { data } = await noteAPI.getAll();
      setNotes(data.notes || []);
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditNote(null);
    setForm({ title: "", content: "", mood: "", color: "pink" });
    setModalOpen(true);
  };

  const openEdit = (note) => {
    setEditNote(note);
    setForm({ title: note.title, content: note.content, mood: note.mood || "", color: note.color || "pink" });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      toast.error("Title and content are required");
      return;
    }
    try {
      if (editNote) {
        await noteAPI.update(editNote._id, form);
        toast.success("Note updated! ✏️");
      } else {
        await noteAPI.add(form);
        toast.success("Note saved! 📝");
      }
      setModalOpen(false);
      fetchNotes();
    } catch {
      toast.error("Failed to save note");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this note?")) return;
    try {
      await noteAPI.delete(id);
      toast.success("Note deleted");
      setNotes((n) => n.filter((x) => x._id !== id));
    } catch {
      toast.error("Failed to delete");
    }
  };

  const moodEmoji = { happy:"😊", sad:"😢", irritated:"😤", tired:"😴", emotional:"🥺", anxious:"😰", normal:"😌" };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-800">Journal 📖</h1>
          <p className="text-gray-500 text-sm mt-1">Your private wellness diary</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
          onClick={openAdd} className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} /> New Entry
        </motion.button>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="text-4xl animate-pulse mb-3">📖</div>
          <p className="text-pink-400">Loading journal...</p>
        </div>
      ) : notes.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
          <div className="text-6xl mb-4">✍️</div>
          <h3 className="font-display text-xl font-semibold text-gray-700 mb-2">Start your wellness journal</h3>
          <p className="text-gray-400 text-sm mb-6 max-w-xs mx-auto">
            Write about your feelings, symptoms, and experiences. It's completely private.
          </p>
          <button onClick={openAdd} className="btn-primary">Write First Entry 💗</button>
        </motion.div>
      ) : (
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.06 } } }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <AnimatePresence>
            {notes.map((note) => (
              <motion.div
                key={note._id}
                variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -3 }}
                className={`rounded-3xl border-2 p-5 transition-all duration-200 ${colorMap[note.color] || colorMap.pink}`}
              >
                {/* Note Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${colorDotMap[note.color] || colorDotMap.pink}`} />
                    <span className="text-xs text-gray-400">
                      {format(new Date(note.createdAt), "MMM d, yyyy")}
                    </span>
                    {note.mood && <span className="text-base">{moodEmoji[note.mood]}</span>}
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(note)}
                      className="p-1.5 rounded-lg hover:bg-white/60 text-gray-400 hover:text-pink-500 transition-colors">
                      <Edit3 size={14} />
                    </button>
                    <button onClick={() => handleDelete(note._id)}
                      className="p-1.5 rounded-lg hover:bg-white/60 text-gray-400 hover:text-red-400 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <h3 className="font-semibold text-gray-800 mb-2 line-clamp-1">{note.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed line-clamp-4">{note.content}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editNote ? "✏️ Edit Entry" : "📝 New Journal Entry"}
        maxWidth="lg"
      >
        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1.5 block">Title</label>
            <input
              type="text" placeholder="Give this entry a title..."
              value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="input-pink"
            />
          </div>

          {/* Content */}
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1.5 block">Your thoughts</label>
            <textarea
              placeholder="How are you feeling today? What's on your mind..."
              value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={6} className="input-pink resize-none"
            />
          </div>

          {/* Mood */}
          <MoodSelector
            selected={form.mood}
            onChange={(m) => setForm({ ...form, mood: m })}
            label="Mood tag (optional)"
          />

          {/* Color */}
          <div>
            <label className="text-sm font-medium text-gray-600 mb-2 block">Card Color</label>
            <div className="flex gap-2">
              {Object.entries(colorDotMap).map(([color, cls]) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setForm({ ...form, color })}
                  className={`w-8 h-8 rounded-full ${cls} transition-transform ${form.color === color ? "scale-125 ring-2 ring-offset-1 ring-gray-400" : ""}`}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button onClick={() => setModalOpen(false)} className="btn-ghost flex-1">Cancel</button>
            <button onClick={handleSave} className="btn-primary flex-1 flex items-center justify-center gap-2">
              <Save size={16} /> {editNote ? "Update" : "Save Entry"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
