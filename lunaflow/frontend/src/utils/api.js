// ============================================================
// src/utils/api.js — Axios API Helper
// ============================================================

import axios from "axios";

// Base URL — uses Vite env variable in production, or proxy in dev
const API_BASE = import.meta.env.VITE_API_URL || "";

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  headers: { "Content-Type": "application/json" },
});

// ─── Request Interceptor: attach JWT token ─────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("lunaflow_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor: handle 401 ─────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("lunaflow_token");
      localStorage.removeItem("lunaflow_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ─── Auth API Calls ────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login:    (data) => api.post("/auth/login", data),
  profile:  ()     => api.get("/auth/profile"),
  update:   (data) => api.put("/auth/profile", data),
};

// ─── Cycle API Calls ───────────────────────────────────────
export const cycleAPI = {
  getAll:   ()           => api.get("/cycles"),
  add:      (data)       => api.post("/cycles", data),
  update:   (id, data)   => api.put(`/cycles/${id}`, data),
  delete:   (id)         => api.delete(`/cycles/${id}`),
};

// ─── Note API Calls ────────────────────────────────────────
export const noteAPI = {
  getAll:   ()           => api.get("/notes"),
  add:      (data)       => api.post("/notes", data),
  update:   (id, data)   => api.put(`/notes/${id}`, data),
  delete:   (id)         => api.delete(`/notes/${id}`),
};

// ─── Reminder API Calls ────────────────────────────────────
export const reminderAPI = {
  getAll:   ()   => api.get("/reminders"),
  add:      (d)  => api.post("/reminders", d),
  toggle:   (id) => api.patch(`/reminders/${id}/toggle`),
  delete:   (id) => api.delete(`/reminders/${id}`),
};

// ─── Mood Analytics ────────────────────────────────────────
export const moodAPI = {
  analytics: () => api.get("/moods/analytics"),
};

export default api;
