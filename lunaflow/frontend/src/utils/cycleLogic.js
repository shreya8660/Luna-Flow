// ============================================================
// src/utils/cycleLogic.js — Period Prediction Calculations
// ============================================================

import { format, addDays, differenceInDays, isWithinInterval } from "date-fns";

/**
 * Calculate cycle predictions based on cycle history
 * @param {Array} cycles - Array of cycle objects from DB (sorted newest first)
 * @param {number} defaultLength - Default cycle length (28)
 */
export const calculatePredictions = (cycles = [], defaultLength = 28) => {
  if (cycles.length === 0) {
    return {
      nextPeriodDate: null,
      daysUntilNextPeriod: null,
      ovulationDate: null,
      fertileWindowStart: null,
      fertileWindowEnd: null,
      currentCycleDay: null,
      avgCycleLength: defaultLength,
    };
  }

  const latest = cycles[0];
  const startDate = new Date(latest.startDate);

  // Calculate average cycle length from last 6 cycles
  const recentCycles = cycles.slice(0, 6);
  const avgCycleLength = Math.round(
    recentCycles.reduce((sum, c) => sum + (c.cycleLength || defaultLength), 0) /
      recentCycles.length
  );

  // Next period = last period start + avg cycle length
  const nextPeriodDate = addDays(startDate, avgCycleLength);

  // Ovulation = cycle start + (cycle length - 14)
  const ovulationDate = addDays(startDate, avgCycleLength - 14);

  // Fertile window: ovulation ± 2 days (3–5 days before ovulation + ovulation day)
  const fertileWindowStart = addDays(ovulationDate, -3);
  const fertileWindowEnd   = addDays(ovulationDate, 1);

  const today = new Date();
  const daysUntilNextPeriod = differenceInDays(nextPeriodDate, today);
  const currentCycleDay = differenceInDays(today, startDate) + 1;

  return {
    nextPeriodDate,
    daysUntilNextPeriod,
    ovulationDate,
    fertileWindowStart,
    fertileWindowEnd,
    currentCycleDay: currentCycleDay > 0 ? currentCycleDay : 1,
    avgCycleLength,
    formattedNextPeriod: format(nextPeriodDate, "MMM d, yyyy"),
    formattedOvulation:  format(ovulationDate,  "MMM d, yyyy"),
  };
};

/**
 * Get the type of a calendar day (period, fertile, ovulation, normal)
 */
export const getDayType = (date, cycles, predictions) => {
  if (!cycles || cycles.length === 0) return "normal";

  const dateObj = new Date(date);

  // Check if it's a period day (within any cycle's start → end)
  for (const cycle of cycles) {
    const start = new Date(cycle.startDate);
    const end   = cycle.endDate
      ? new Date(cycle.endDate)
      : addDays(start, cycle.periodDuration || 5);

    if (isWithinInterval(dateObj, { start, end })) {
      return "period";
    }
  }

  // Check fertile window and ovulation
  if (predictions?.fertileWindowStart && predictions?.fertileWindowEnd) {
    const fertStart = new Date(predictions.fertileWindowStart);
    const fertEnd   = new Date(predictions.fertileWindowEnd);

    // Ovulation day
    const ovDay = new Date(predictions.ovulationDate);
    if (dateObj.toDateString() === ovDay.toDateString()) return "ovulation";

    // Fertile window
    if (isWithinInterval(dateObj, { start: fertStart, end: fertEnd })) {
      return "fertile";
    }
  }

  return "normal";
};

/**
 * Generate wellness tips based on current cycle day
 */
export const getWellnessTip = (cycleDay) => {
  if (!cycleDay) return "Track your cycle to get personalized tips! 🌸";

  if (cycleDay <= 5)
    return "During your period, rest well and stay hydrated. Warm teas help with cramps! 🫖";
  if (cycleDay <= 13)
    return "Your energy is rising! This is a great time for workouts and socializing. 💪";
  if (cycleDay === 14)
    return "Ovulation time! You may feel most vibrant and confident today. ✨";
  if (cycleDay <= 21)
    return "Post-ovulation phase — focus on nutrition and self-care routines. 🥗";
  return "Pre-menstrual phase. Be kind to yourself, rest when needed. 💗";
};

/**
 * Get daily motivational quotes (rotates daily)
 */
export const getDailyQuote = () => {
  const quotes = [
    { text: "Your body is a temple of wisdom. Listen to her.", author: "LunaFlow" },
    { text: "Every cycle is a reminder of your incredible strength.", author: "LunaFlow" },
    { text: "Wellness is a journey, not a destination.", author: "LunaFlow" },
    { text: "Embrace every phase of your beautiful cycle.", author: "LunaFlow" },
    { text: "Self-care is the highest form of self-respect.", author: "LunaFlow" },
    { text: "Your period is a superpower — wear it with pride.", author: "LunaFlow" },
    { text: "Nourish your body, honor your cycle, trust the process.", author: "LunaFlow" },
  ];

  const dayOfYear = Math.floor(
    (new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000
  );
  return quotes[dayOfYear % quotes.length];
};

/**
 * Format dates nicely
 */
export const formatDate = (date) => format(new Date(date), "MMMM d, yyyy");
export const formatShort = (date) => format(new Date(date), "MMM d");
