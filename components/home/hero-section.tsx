import { useState, useEffect, useCallback } from "react";

// ─────────────────────────────────────────────
// DUMMY DATA
// ─────────────────────────────────────────────
const slides = [
  {
    id: 1,
    badge: "KEGIATAN",
    title: "Santunan Anak Yatim",
    detail: "12 Okt  •  Masjid Al-Ikhlas, Mulyoarjo",
    // gradient simulates a charity-photo placeholder
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

const navLinks = ["Beranda", "Laporan", "Kegiatan", "Profil"];

// ─────────────────────────────────────────────
// ICONS (inline SVG via lucide-style)
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
export default function LazisNUHero() {
  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(true);

  const goTo = useCallback((idx) => {
    setFade(false);
    setTimeout(() => {
      setCurrent(idx);
      setFade(true);
    }, 300);
  }, []);

  // auto-play every 4 s
  useEffect(() => {
    const t = setInterval(() => {
      goTo((current + 1) % slides.length);
    }, 4000);
    return () => clearInterval(t);
  }, [current, goTo]);

  const slide = slides[current];

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      {/* ══════ A. STICKY NAV ══════ */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Logo inline */}
          <a href="#" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm leading-none">L</span>
            </div>
            <span className="text-sm font-bold text-emerald-700 tracking-tight">
              LazisNU <span className="text-gray-500 font-medium">Mulyoarjo</span>
            </span>
          </a>

          {/* Menu links */}
          <div className="flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link}
                href="#"
                className={`text-sm font-semibold relative transition-colors ${
                  link === "Beranda"
                    ? "text-emerald-700"
                    : "text-gray-500 hover:text-emerald-600"
                }`}
              >
                {link}
                {link === "Beranda" && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-emerald-600 rounded-full" />
                )}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* ══════ MAIN CONTENT ══════ */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8 flex flex-col gap-6">

        {/* ── B. HERO TYPOGRAPHY (above image) ── */}
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight uppercase">
            Transparansi Pengelolaan
            <br />
            <span className="text-emerald-700">Koin Amal</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-400 font-medium mt-1">
            Untuk Kesejahteraan Bersama
          </p>
        </div>

        {/* ── C. SLIDESHOW with glassmorphism overlay ── */}
        <div className="relative w-full rounded-3xl overflow-hidden" style={{ minHeight: "280px" }}>
          {/* Background gradient (simulated photo) */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${slide.bg} transition-opacity duration-300`}
            style={{ opacity: fade ? 1 : 0 }}
          >
            {/* Decorative shapes to give depth */}
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/5 rounded-full blur-xl" />
            <div className="absolute bottom-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-lg" />
            <div className="absolute top-10 left-1/3 w-24 h-24 bg-white/5 rounded-full blur-md" />
            {/* Geometric pattern overlay for visual interest */}
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
              {/* Badge */}
              <span
                className="self-start text-[11px] font-bold tracking-widest uppercase text-white rounded-full px-3 py-0.5"
                style={{ background: "rgba(255,255,255,0.2)" }}
              >
                {slide.badge}
              </span>

              {/* Title */}
              <h2
                className="text-base sm:text-lg font-bold text-white leading-snug"
                style={{ opacity: fade ? 1 : 0, transition: "opacity 0.3s" }}
              >
                {slide.title}
              </h2>

              {/* Time & Location */}
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

            {/* Arrow button */}
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
        </div>

        {/* ── D. STATS BENTO GRID ── */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {stats.map((s, i) => (
            <div
              key={i}
              className={`rounded-2xl p-4 sm:p-5 flex flex-col gap-1.5 relative overflow-hidden ${
                s.dark
                  ? "bg-emerald-700 text-white"
                  : "bg-emerald-50 text-gray-900"
              }`}
            >
              {/* subtle decorative circle */}
              <div
                className={`absolute -bottom-4 -right-4 w-24 h-24 rounded-full opacity-10 ${
                  s.dark ? "bg-white" : "bg-emerald-600"
                }`}
              />

              {/* Badge row */}
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

              {/* Value */}
              <p
                className={`text-xl sm:text-2xl font-extrabold leading-tight relative z-10 ${
                  s.dark ? "text-white" : "text-gray-900"
                }`}
              >
                {s.value}
              </p>

              {/* Label */}
              <p
                className={`text-[11px] font-semibold uppercase tracking-wide relative z-10 ${
                  s.dark ? "text-emerald-200" : "text-gray-500"
                }`}
              >
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}