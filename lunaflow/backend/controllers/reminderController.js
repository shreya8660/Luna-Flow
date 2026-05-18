// ============================================================
// controllers/reminderController.js — Reminders Logic
// ============================================================

const Reminder = require("../models/Reminder");

// Add reminder
const addReminder = async (req, res) => {
  try {
    const { title, description, type, date, recurring, frequency } = req.body;
    if (!title || !date) {
      return res.status(400).json({ success: false, message: "Title and date are required" });
    }
    const reminder = await Reminder.create({
      user: req.user.id, title, description, type, date, recurring, frequency,
    });
    res.status(201).json({ success: true, message: "Reminder set! ⏰", reminder });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all reminders
const getReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find({ user: req.user.id }).sort({ date: 1 });
    res.json({ success: true, reminders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Toggle complete
const toggleReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findOne({ _id: req.params.id, user: req.user.id });
    if (!reminder) return res.status(404).json({ success: false, message: "Reminder not found" });
    reminder.completed = !reminder.completed;
    await reminder.save();
    res.json({ success: true, reminder });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete reminder
const deleteReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!reminder) return res.status(404).json({ success: false, message: "Reminder not found" });
    res.json({ success: true, message: "Reminder deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { addReminder, getReminders, toggleReminder, deleteReminder };
