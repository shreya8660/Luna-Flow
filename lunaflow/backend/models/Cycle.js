// ============================================================
// models/Cycle.js — Period Cycle Schema
// ============================================================

const mongoose = require("mongoose");

const cycleSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Period start date (required)
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },

    // Period end date (optional — can be added later)
    endDate: {
      type: Date,
    },

    // Actual cycle length in days (auto-calculated or manual)
    cycleLength: {
      type: Number,
      default: 28,
    },

    // Period duration in days
    periodDuration: {
      type: Number,
    },

    // Flow intensity
    flow: {
      type: String,
      enum: ["spotting", "light", "medium", "heavy"],
      default: "medium",
    },

    // Mood during this period
    mood: {
      type: String,
      enum: ["happy", "sad", "irritated", "tired", "emotional", "anxious", "normal"],
      default: "normal",
    },

    // Symptoms array — multiple symptoms per cycle
    symptoms: [
      {
        type: String,
        enum: ["cramps", "headache", "acne", "bloating", "fatigue", "nausea", "backPain", "breastTenderness", "moodSwings"],
      },
    ],

    // Personal notes for this cycle
    notes: {
      type: String,
      maxlength: [500, "Notes cannot exceed 500 characters"],
      default: "",
    },

    // Pain level 1-10
    painLevel: {
      type: Number,
      min: 1,
      max: 10,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

// ─── Virtual: Calculate if period is active ───────────────
cycleSchema.virtual("isActive").get(function () {
  if (!this.endDate) return true;
  return new Date() <= this.endDate;
});

// ─── Virtual: Predicted ovulation date ────────────────────
cycleSchema.virtual("ovulationDate").get(function () {
  const ovulationDay = new Date(this.startDate);
  ovulationDay.setDate(ovulationDay.getDate() + this.cycleLength - 14);
  return ovulationDay;
});

// ─── Virtual: Predicted next period ───────────────────────
cycleSchema.virtual("nextPeriodDate").get(function () {
  const nextPeriod = new Date(this.startDate);
  nextPeriod.setDate(nextPeriod.getDate() + this.cycleLength);
  return nextPeriod;
});

module.exports = mongoose.model("Cycle", cycleSchema);
