// ============================================================
// controllers/cycleController.js — Cycle Business Logic
// ============================================================

const Cycle = require("../models/Cycle");

// ─── @route   POST /api/cycles ─────────────────────────────
// ─── @desc    Log a new period cycle ──────────────────────
// ─── @access  Private ──────────────────────────────────────
const addCycle = async (req, res) => {
  try {
    const { startDate, endDate, cycleLength, flow, mood, symptoms, notes, painLevel } = req.body;

    if (!startDate) {
      return res.status(400).json({ success: false, message: "Start date is required" });
    }

    const cycle = await Cycle.create({
      user: req.user.id,
      startDate,
      endDate,
      cycleLength: cycleLength || req.user.cycleLength || 28,
      flow,
      mood,
      symptoms,
      notes,
      painLevel,
    });

    res.status(201).json({
      success: true,
      message: "Period logged successfully! 🌸",
      cycle,
    });
  } catch (error) {
    console.error("Add Cycle Error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─── @route   GET /api/cycles ──────────────────────────────
// ─── @desc    Get all cycles for logged-in user ────────────
// ─── @access  Private ──────────────────────────────────────
const getCycles = async (req, res) => {
  try {
    const cycles = await Cycle.find({ user: req.user.id })
      .sort({ startDate: -1 }) // Most recent first
      .limit(12); // Last 12 cycles

    // Calculate predictions based on latest cycle
    let predictions = null;
    if (cycles.length > 0) {
      const latest = cycles[0];
      const avgCycleLength = cycles.reduce((sum, c) => sum + (c.cycleLength || 28), 0) / cycles.length;

      const nextPeriod = new Date(latest.startDate);
      nextPeriod.setDate(nextPeriod.getDate() + Math.round(avgCycleLength));

      const ovulation = new Date(latest.startDate);
      ovulation.setDate(ovulation.getDate() + Math.round(avgCycleLength) - 14);

      const fertileStart = new Date(ovulation);
      fertileStart.setDate(ovulation.getDate() - 2);

      const fertileEnd = new Date(ovulation);
      fertileEnd.setDate(ovulation.getDate() + 2);

      const today = new Date();
      const daysUntilNextPeriod = Math.ceil((nextPeriod - today) / (1000 * 60 * 60 * 24));
      const currentCycleDay = Math.ceil((today - new Date(latest.startDate)) / (1000 * 60 * 60 * 24));

      predictions = {
        nextPeriodDate: nextPeriod,
        daysUntilNextPeriod,
        ovulationDate: ovulation,
        fertileWindowStart: fertileStart,
        fertileWindowEnd: fertileEnd,
        currentCycleDay,
        avgCycleLength: Math.round(avgCycleLength),
      };
    }

    res.json({ success: true, cycles, predictions });
  } catch (error) {
    console.error("Get Cycles Error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─── @route   GET /api/cycles/:id ──────────────────────────
// ─── @desc    Get single cycle ─────────────────────────────
// ─── @access  Private ──────────────────────────────────────
const getCycleById = async (req, res) => {
  try {
    const cycle = await Cycle.findOne({ _id: req.params.id, user: req.user.id });

    if (!cycle) {
      return res.status(404).json({ success: false, message: "Cycle not found" });
    }

    res.json({ success: true, cycle });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─── @route   PUT /api/cycles/:id ──────────────────────────
// ─── @desc    Update a cycle ───────────────────────────────
// ─── @access  Private ──────────────────────────────────────
const updateCycle = async (req, res) => {
  try {
    const cycle = await Cycle.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!cycle) {
      return res.status(404).json({ success: false, message: "Cycle not found" });
    }

    res.json({ success: true, message: "Cycle updated!", cycle });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─── @route   DELETE /api/cycles/:id ───────────────────────
// ─── @desc    Delete a cycle ───────────────────────────────
// ─── @access  Private ──────────────────────────────────────
const deleteCycle = async (req, res) => {
  try {
    const cycle = await Cycle.findOneAndDelete({ _id: req.params.id, user: req.user.id });

    if (!cycle) {
      return res.status(404).json({ success: false, message: "Cycle not found" });
    }

    res.json({ success: true, message: "Cycle deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { addCycle, getCycles, getCycleById, updateCycle, deleteCycle };
