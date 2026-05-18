// ============================================================
// models/User.js — User Schema
// ============================================================

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [50, "Name cannot exceed 50 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Don't return password by default
    },

    avatar: {
      type: String,
      default: "", // URL to avatar image
    },

    dateOfBirth: {
      type: Date,
    },

    // Default cycle length for predictions
    cycleLength: {
      type: Number,
      default: 28,
      min: 21,
      max: 45,
    },

    // Default period duration
    periodDuration: {
      type: Number,
      default: 5,
      min: 1,
      max: 10,
    },

    // Notification preferences
    notifications: {
      periodReminder: { type: Boolean, default: true },
      ovulationReminder: { type: Boolean, default: true },
      waterReminder: { type: Boolean, default: false },
    },

    // Daily water goal (in glasses)
    waterGoal: {
      type: Number,
      default: 8,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// ─── Hash password before saving ──────────────────────────
userSchema.pre("save", async function (next) {
  // Only hash if password was modified
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ─── Method to compare passwords ──────────────────────────
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
