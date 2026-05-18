// ============================================================
// models/Note.js — Journal Notes Schema
// ============================================================

const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
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

    content: {
      type: String,
      required: [true, "Content is required"],
      maxlength: [2000, "Content cannot exceed 2000 characters"],
    },

    // Optional mood tag on the note
    mood: {
      type: String,
      enum: ["happy", "sad", "irritated", "tired", "emotional", "anxious", "normal"],
    },

    // Color tag for the note card
    color: {
      type: String,
      enum: ["pink", "lavender", "peach", "mint", "white"],
      default: "pink",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Note", noteSchema);
