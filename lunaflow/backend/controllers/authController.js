// ============================================================
// controllers/authController.js — Auth Business Logic
// ============================================================

const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ─── Helper: Generate JWT Token ───────────────────────────
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "30d",
  });
};

// ─── @route   POST /api/auth/register ─────────────────────
// ─── @desc    Register a new user ─────────────────────────
// ─── @access  Public ───────────────────────────────────────
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, and password",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    // Create new user (password is hashed via pre-save hook)
    const user = await User.create({ name, email, password });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "Account created successfully! 🌙",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        cycleLength: user.cycleLength,
        waterGoal: user.waterGoal,
      },
    });
  } catch (error) {
    console.error("Register Error:", error.message);
    res.status(500).json({ success: false, message: "Server error during registration" });
  }
};

// ─── @route   POST /api/auth/login ────────────────────────
// ─── @desc    Login user ───────────────────────────────────
// ─── @access  Public ───────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Find user WITH password (it's excluded by default)
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: `Welcome back, ${user.name}! 💗`,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        cycleLength: user.cycleLength,
        waterGoal: user.waterGoal,
      },
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ success: false, message: "Server error during login" });
  }
};

// ─── @route   GET /api/auth/profile ───────────────────────
// ─── @desc    Get logged-in user profile ──────────────────
// ─── @access  Private ──────────────────────────────────────
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─── @route   PUT /api/auth/profile ───────────────────────
// ─── @desc    Update user profile ─────────────────────────
// ─── @access  Private ──────────────────────────────────────
const updateProfile = async (req, res) => {
  try {
    const { name, cycleLength, periodDuration, waterGoal, avatar, dateOfBirth } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, cycleLength, periodDuration, waterGoal, avatar, dateOfBirth },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: "Profile updated! ✨",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update Profile Error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { register, login, getProfile, updateProfile };
