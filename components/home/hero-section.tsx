"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

// ─────────────────────────────────────────────
// DUMMY DATA
// ─────────────────────────────────────────────
const slides = [
  {
    id: 1,
    badge: "KEGIATAN",
    title: "Santunan Anak Yatim",
    detail: "12 Okt  •  Masjid Al-Ikhlas, Mulyoarjo",
    bg: "from-emerald-800 via-emerald-600 to-teal-700",
  },
  {
    id: 2,
    badge: "SOSIAL",
    title: "Pembagian Sembako Rutin",
    detail: "25 Okt  •  Balai Desa Mulyoarjo",
    bg: "from-teal-800 via-emerald-700 to-emerald-500",
  },
  {
    id: 3,
    badge: "KESEHATAN",
    title: "Bakti Sosial Kesehatan Desa",
    detail: "3 Nov  •  Puskesmas Mulyoarjo",
    bg: "from-emerald-900 via-teal-700 to-emerald-600",
  },
];

const stats = [
  { label: "Total Kaleng", value: "1.250", dark: false },
  { label: "Perolehan Bulan Ini", value: "Rp 2.450.000", dark: false, badge: true },
  { label: "Perolehan Tahun Ini", value: "Rp 18.750.000", dark: true, badge: true },
];

// ─────────────────────────────────────────────
// ICONS (inline SVG)
// ─────────────────────────────────────────────
const ArrowIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M7 17L17 7" />
    <path d="M7 7h10v10" />
  </svg>
);

const CalendarIcon = ({ size = 14, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const MapPinIcon = ({ size = 14, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────
export function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(true);

  const goTo = useCallback((idx: number) => {
    setFade(false);
    setTimeout(() => {
      setCurrent(idx);
      setFade(true);
    }, 300);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      goTo((current + 1) % slides.length);
    }, 4000);
    return () => clearInterval(t);
  }, [current, goTo]);

  const slide = slides[current];

  return (
    <div className="bg-white font-sans flex flex-col">
      <main className="max-w-6xl mx-auto w-full px-4 py-8 flex flex-col gap-6">

        {/* ── A. HERO TYPOGRAPHY ── */}
        <motion.div
          className="flex flex-col gap-1"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight uppercase">
            Transparansi Pengelolaan
            <br />
            <span className="text-emerald-700">Koin Amal</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-400 font-medium mt-1">
            Untuk Kesejahteraan Bersama
          </p>
        </motion.div>
        <motion.div
          className="relative w-full rounded-3xl overflow-hidden"
          style={{ minHeight: "280px" }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          <div
            className={`absolute inset-0 bg-gradient-to-br ${slide.bg} transition-opacity duration-300`}
            style={{ opacity: fade ? 1 : 0 }}
          >
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/5 rounded-full blur-xl" />
            <div className="absolute bottom-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-lg" />
            <div className="absolute top-10 left-1/3 w-24 h-24 bg-white/5 rounded-full blur-md" />
            <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 800 400" preserveAspectRatio="none">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="800" height="400" fill="url(#grid)" />
            </svg>
          </div>

          {/* Glass overlay at bottom */}
          <div
            className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 flex items-end justify-between gap-4"
            style={{
              background: "linear-gradient(to top, rgba(0,0,0,0.15) 0%, transparent 100%)",
            }}
          >
            <div
              className="flex-1 rounded-2xl px-5 py-4 flex flex-col gap-2"
              style={{
                background: "rgba(255,255,255,0.18)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.25)",
              }}
            >
              <span
                className="self-start text-[11px] font-bold tracking-widest uppercase text-white rounded-full px-3 py-0.5"
                style={{ background: "rgba(255,255,255,0.2)" }}
              >
                {slide.badge}
              </span>

              <h2
                className="text-base sm:text-lg font-bold text-white leading-snug"
                style={{ opacity: fade ? 1 : 0, transition: "opacity 0.3s" }}
              >
                {slide.title}
              </h2>

              <div className="flex items-center gap-3 text-white/80 text-[12px] font-medium">
                <span className="flex items-center gap-1">
                  <CalendarIcon size={13} />
                  {slide.detail.split("•")[0].trim()}
                </span>
                <span className="opacity-40">•</span>
                <span className="flex items-center gap-1">
                  <MapPinIcon size={13} />
                  {slide.detail.split("•")[1]?.trim()}
                </span>
              </div>
            </div>

            <button className="shrink-0 w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow">
              <ArrowIcon size={18} className="text-emerald-700" />
            </button>
          </div>

          {/* Dot indicators */}
          <div className="absolute top-4 right-4 flex gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === current ? "bg-white w-5" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </motion.div>
        {/* 
          Mobile:  2 kolom → card[0] & card[1] sejajar di baris pertama,
                               card[2] (Perolehan Tahun Ini) full-width di baris kedua.
          Desktop (sm+): 3 kolom sejajar seperti sebelumnya.
        */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              className={`rounded-2xl p-4 sm:p-5 flex flex-col gap-1.5 relative overflow-hidden ${
                i === 2 ? "col-span-2 sm:col-span-1" : ""
              } ${
                s.dark
                  ? "bg-emerald-700 text-white"
                  : "bg-emerald-50 text-gray-900"
              }`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
            >
              <div
                className={`absolute -bottom-4 -right-4 w-24 h-24 rounded-full opacity-10 ${
                  s.dark ? "bg-white" : "bg-emerald-600"
                }`}
              />

              {s.badge && (
                <span
                  className={`self-start text-[9px] font-bold tracking-wider uppercase border rounded-full px-2 py-0.5 ${
                    s.dark
                      ? "border-white/30 text-white/70"
                      : "border-emerald-300 text-emerald-600"
                  }`}
                >
                  UPDATED
                </span>
              )}

              <p
                className={`text-xl sm:text-2xl font-extrabold leading-tight relative z-10 ${
                  s.dark ? "text-white" : "text-gray-900"
                }`}
              >
                {s.value}
              </p>

              <p
                className={`text-[11px] font-semibold uppercase tracking-wide relative z-10 ${
                  s.dark ? "text-emerald-200" : "text-gray-500"
                }`}
              >
                {s.label}
              </p>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}