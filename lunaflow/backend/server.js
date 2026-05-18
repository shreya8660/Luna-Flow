const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");


dotenv.config();


connectDB();

const app = express();

app.use(cors({
  origin: process.env.NODE_ENV === "production"
    ? "https://lunaflow.vercel.app"   // your Vercel URL
    : "http://localhost:5173",
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ─── Routes ───────────────────────────────────────────────
app.use("/api/auth",      require("./routes/authRoutes"));
app.use("/api/cycles",    require("./routes/cycleRoutes"));
app.use("/api/moods",     require("./routes/moodRoutes"));
app.use("/api/notes",     require("./routes/noteRoutes"));
app.use("/api/reminders", require("./routes/reminderRoutes"));

// ─── Health Check ─────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ message: "🌙 LunaFlow API is running!", status: "OK" });
});

// ─── 404 Handler ──────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ─── Global Error Handler ─────────────────────────────────
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ─── Start Server ─────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🌙 LunaFlow server running on http://localhost:${PORT}`);
  console.log(`📦 Environment: ${process.env.NODE_ENV}\n`);
});
