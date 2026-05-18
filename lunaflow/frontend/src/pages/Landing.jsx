// ============================================================
// src/pages/Landing.jsx — Beautiful Landing Page
// ============================================================

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, ChevronDown, ChevronUp, ArrowRight, Heart, Shield, BarChart2, Calendar, Droplets, Bell } from "lucide-react";

// ─── Animation variants ───────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

// ─── Data ─────────────────────────────────────────────────
const features = [
  { icon: "🌙", title: "Smart Predictions",     desc: "AI-powered cycle predictions tailored to your unique rhythm." },
  { icon: "📅", title: "Calendar View",          desc: "Visualize your period, fertile window, and ovulation at a glance." },
  { icon: "💧", title: "Water Tracker",          desc: "Stay hydrated with daily reminders and visual progress rings." },
  { icon: "📊", title: "Cycle Analytics",        desc: "Beautiful charts showing mood patterns and cycle consistency." },
  { icon: "📝", title: "Private Journal",        desc: "Write private notes and log how you feel each day." },
  { icon: "🔔", title: "Smart Reminders",        desc: "Never miss period prep, medication, or ovulation windows." },
];

const testimonials = [
  { name: "Priya S.", avatar: "💗", role: "Healthcare Professional", text: "LunaFlow has completely changed how I track my health. The design is so calming and beautiful — I actually look forward to logging!" },
  { name: "Aanya R.", avatar: "🌸", role: "Student",                 text: "Finally a period app that doesn't feel clinical. The pink aesthetic and smooth animations make it a joy to use daily." },
  { name: "Meera K.", avatar: "✨", role: "Fitness Coach",           text: "The cycle analytics helped me align my workouts with my cycle phases. Absolutely game-changing for my energy levels!" },
];

const faqs = [
  { q: "Is my data private?",                    a: "Absolutely. Your data is encrypted and stored securely. We never sell or share your personal health information with anyone." },
  { q: "Is LunaFlow free to use?",               a: "LunaFlow's core features are completely free. We believe every woman deserves access to quality period tracking tools." },
  { q: "How accurate are the predictions?",      a: "Predictions improve with each logged cycle. After 3+ cycles, accuracy significantly increases as the app learns your unique pattern." },
  { q: "Can I use it on my phone?",              a: "Yes! LunaFlow is fully responsive and works beautifully on mobile, tablet, and desktop browsers." },
  { q: "How do I log my period?",               a: "Simply go to the Dashboard or Calendar, click 'Log Period', enter your start date and any symptoms, and save. It takes less than a minute!" },
];

// ─── FAQ Item Component ───────────────────────────────────
function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-pink-100 rounded-2xl overflow-hidden mb-3">
      <button
        onClick={() => setOpen(!open)}
        className="flex justify-between items-center w-full p-5 text-left hover:bg-pink-50 transition-colors"
      >
        <span className="font-medium text-gray-700">{q}</span>
        {open ? <ChevronUp size={18} className="text-pink-400" /> : <ChevronDown size={18} className="text-pink-400" />}
      </button>
      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="px-5 pb-5 text-gray-500 text-sm leading-relaxed"
        >
          {a}
        </motion.div>
      )}
    </div>
  );
}

// ─── Main Landing Page ────────────────────────────────────
export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-purple-50 font-body overflow-x-hidden">

      {/* ── Navbar ─────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-pink-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🌙</span>
            <span className="font-display text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              LunaFlow
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login"  className="text-sm font-medium text-gray-600 hover:text-pink-500 transition-colors px-3 py-2">
              Log In
            </Link>
            <Link to="/signup" className="btn-primary text-sm">
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ───────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Floating blobs */}
        <div className="blob w-96 h-96 bg-pink-300 top-10 -left-20" />
        <div className="blob w-72 h-72 bg-purple-200 bottom-20 -right-10" style={{ animationDelay: "3s" }} />
        <div className="blob w-48 h-48 bg-peach-mid top-1/2 left-1/3" style={{ animationDelay: "5s" }} />

        <div className="relative z-10 text-center max-w-4xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-pink-100 text-pink-600 rounded-full px-4 py-2 text-sm font-medium mb-8"
          >
            <span>✨</span> Your personal wellness companion
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="font-display text-5xl md:text-7xl font-bold text-gray-800 leading-tight mb-6"
          >
            Track Your Cycle
            <br />
            <span className="bg-gradient-to-r from-pink-400 via-rose-400 to-purple-500 bg-clip-text text-transparent">
              With Elegance
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="text-lg text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            LunaFlow is the beautiful, private period tracker that helps you understand your body,
            predict your cycle, and feel empowered every day of the month.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/signup" className="btn-primary flex items-center gap-2 text-base px-8 py-4">
              Start Tracking Free <ArrowRight size={18} />
            </Link>
            <Link to="/login"  className="btn-ghost text-base px-8 py-4">
              I have an account
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="flex flex-wrap justify-center gap-6 mt-12 text-sm text-gray-400"
          >
            {["🔒 100% Private", "✅ Free to use", "💗 10k+ Women trust LunaFlow"].map((b) => (
              <span key={b} className="flex items-center gap-1">{b}</span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Features Section ────────────────────────────── */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <motion.div
          variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.p variants={fadeUp} className="badge-pink mb-4">Features</motion.p>
          <motion.h2 variants={fadeUp} className="section-heading mb-4">
            Everything you need to thrive
          </motion.h2>
          <motion.p variants={fadeUp} className="text-gray-500 max-w-2xl mx-auto">
            From cycle tracking to mood journaling — LunaFlow has all the tools to understand your body and mind.
          </motion.p>
        </motion.div>

        <motion.div
          variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={fadeUp}
              whileHover={{ y: -5 }}
              className="glass-card p-6 group cursor-default"
            >
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="font-semibold text-gray-800 mb-2 text-lg">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Testimonials ────────────────────────────────── */}
      <section className="py-24 bg-gradient-to-r from-pink-50 to-purple-50">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="badge-pink mb-4">Testimonials</p>
            <h2 className="section-heading">Loved by women everywhere 💗</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                viewport={{ once: true }}
                className="glass-card p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center text-2xl">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{t.name}</p>
                    <p className="text-xs text-pink-400">{t.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed italic">"{t.text}"</p>
                <div className="flex gap-1 mt-3">
                  {Array(5).fill("⭐").map((s, j) => <span key={j} className="text-sm">{s}</span>)}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ Section ─────────────────────────────────── */}
      <section className="py-24 px-6 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="badge-pink mb-4">FAQ</p>
          <h2 className="section-heading">Frequently Asked Questions</h2>
        </motion.div>
        {faqs.map((faq) => (
          <FAQItem key={faq.q} {...faq} />
        ))}
      </section>

      {/* ── CTA Section ─────────────────────────────────── */}
      <section className="py-24 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-gradient-to-r from-pink-400 via-rose-400 to-purple-500 rounded-4xl p-12 text-center text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-20">
            <div className="blob w-64 h-64 bg-white top-0 left-0" />
            <div className="blob w-48 h-48 bg-white bottom-0 right-0" />
          </div>
          <div className="relative z-10">
            <h2 className="font-display text-4xl font-bold mb-4">Start your wellness journey today</h2>
            <p className="text-white/80 mb-8 max-w-xl mx-auto">
              Join thousands of women who trust LunaFlow to understand their bodies and cycle with confidence.
            </p>
            <Link to="/signup" className="inline-flex items-center gap-2 bg-white text-pink-500 font-bold px-8 py-4 rounded-2xl hover:shadow-lg transition-all hover:-translate-y-1">
              Create Free Account <ArrowRight size={18} />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ──────────────────────────────────────── */}
      <footer className="bg-white border-t border-pink-100 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌙</span>
            <span className="font-display font-bold text-lg bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              LunaFlow
            </span>
          </div>
          <p className="text-sm text-gray-400 text-center">
            Made with 💗 for every woman. Your health, your data, your power.
          </p>
          <div className="flex gap-4 text-sm text-gray-400">
            <a href="#" className="hover:text-pink-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-pink-400 transition-colors">Terms</a>
            <a href="#" className="hover:text-pink-400 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
