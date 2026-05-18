// ============================================================
// models/Reminder.js — Reminders Schema
// ============================================================

const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },

    description: {
      type: String,
      maxlength: [300, "Description cannot exceed 300 characters"],
      default: "",
    },

    // Type of reminder
    type: {
      type: String,
      enum: ["period", "medication", "water", "ovulation", "custom"],
      default: "custom",
    },

    // Reminder date/time
    date: {
      type: Date,
      required: [true, "Date is required"],
    },

    // Is this reminder completed?
    completed: {
      type: Boolean,
      default: false,
    },

    // Is this a recurring reminder?
    recurring: {
      type: Boolean,
      default: false,
    },

    // Recurring frequency (daily, weekly, monthly)
    frequency: {
      type: String,
      enum: ["daily", "weekly", "monthly"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Reminder", reminderSchema);
