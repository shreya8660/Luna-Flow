// ============================================================
// routes/authRoutes.js — Authentication Routes
// ============================================================

const express = require("express");
const router = express.Router();
const { register, login, getProfile, updateProfile } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

router.post("/register", register);           // POST /api/auth/register
router.post("/login", login);                 // POST /api/auth/login
router.get("/profile", protect, getProfile);  // GET  /api/auth/profile
router.put("/profile", protect, updateProfile); // PUT /api/auth/profile

module.exports = router;
