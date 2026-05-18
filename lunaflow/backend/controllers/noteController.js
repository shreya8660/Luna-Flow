// ============================================================
// controllers/noteController.js — Journal Notes Logic
// ============================================================

const Note = require("../models/Note");

// Add note
const addNote = async (req, res) => {
  try {
    const { title, content, mood, color } = req.body;
    if (!title || !content) {
      return res.status(400).json({ success: false, message: "Title and content are required" });
    }
    const note = await Note.create({ user: req.user.id, title, content, mood, color });
    res.status(201).json({ success: true, message: "Note saved! 📝", note });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all notes
const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, notes });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update note
const updateNote = async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!note) return res.status(404).json({ success: false, message: "Note not found" });
    res.json({ success: true, message: "Note updated!", note });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete note
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!note) return res.status(404).json({ success: false, message: "Note not found" });
    res.json({ success: true, message: "Note deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { addNote, getNotes, updateNote, deleteNote };
