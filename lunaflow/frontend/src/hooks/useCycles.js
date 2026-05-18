// ============================================================
// src/hooks/useCycles.js — Custom hook for cycle data
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { cycleAPI } from "../utils/api";
import { calculatePredictions } from "../utils/cycleLogic";
import { useAuth } from "../context/AuthContext";

export function useCycles() {
  const { user }    = useAuth();
  const [cycles, setCycles]         = useState([]);
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await cycleAPI.getAll();
      setCycles(data.cycles || []);
      setPredictions(calculatePredictions(data.cycles || [], user?.cycleLength || 28));
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetch(); }, [fetch]);

  return { cycles, predictions, loading, error, refetch: fetch };
}

// ============================================================
// src/hooks/useReminders.js — Custom hook for reminders
// ============================================================

import { useState, useEffect } from "react";
import { reminderAPI } from "../utils/api";

export function useReminders() {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading]     = useState(true);

  const fetch = async () => {
    try {
      const { data } = await reminderAPI.getAll();
      setReminders(data.reminders || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  return { reminders, loading, refetch: fetch };
}
