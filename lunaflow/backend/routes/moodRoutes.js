// routes/moodRoutes.js
// Mood tracking is embedded in cycles — this route provides analytics
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const Cycle = require("../models/Cycle");

// GET /api/moods/analytics — Returns mood distribution
router.get("/analytics", protect, async (req, res) => {
  try {
    const cycles = await Cycle.find({ user: req.user.id });
    const moodCount = {};
    cycles.forEach((c) => {
      if (c.mood) moodCount[c.mood] = (moodCount[c.mood] || 0) + 1;
    });
    const symptomCount = {};
    cycles.forEach((c) => {
      (c.symptoms || []).forEach((s) => {
        symptomCount[s] = (symptomCount[s] || 0) + 1;
      });
    });
    res.json({ success: true, moodCount, symptomCount });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
