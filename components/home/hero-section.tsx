"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Slide {
  id: string;
  badge: string;
  title: string;
  detail: string | null;
  background_gradient: string | null;
  image_url: string | null;
  link_url: string | null;
}

interface HeroSectionProps {
  slides: Slide[];
}

export function HeroSection({ slides }: HeroSectionProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goToSlide = useCallback((index: number) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  }, [current]);

  // Handle touch swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    }
    if (isRightSwipe) {
      prevSlide();
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  // Auto-play carousel
  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  if (!slides || slides.length === 0) {
    return (
      <div className="bg-gradient-to-br from-emerald-800 via-emerald-600 to-teal-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Selamat Datang di LazisNU Mulyoarjo
          </h1>
          <p className="text-xl opacity-90">Platform Transparansi Pengelolaan Koin Amal</p>
        </div>
      </div>
    );
  }

  const slide = slides[current];
  const bgGradient = slide.background_gradient || "from-emerald-800 via-emerald-600 to-teal-700";

  // Parse detail untuk mendapatkan tanggal dan lokasi
  const detailParts = slide.detail?.split("•") || [];
  const date = detailParts[0]?.trim();
  const location = detailParts[1]?.trim();

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <section 
      className="relative overflow-hidden bg-gray-900 h-[500px] md:h-[600px]"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          className="absolute inset-0"
        >
          {/* Background - Image or Gradient */}
          {slide.image_url ? (
            <>
              {/* Background Image with 16:9 ratio */}
              <div className="absolute inset-0">
                <Image
                  src={slide.image_url}
                  alt={slide.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="100vw"
                />
              </div>
              
              {/* Dark overlay for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70 md:bg-gradient-to-r md:from-black/70 md:via-black/50 md:to-transparent" />
            </>
          ) : (
            /* Fallback to gradient if no image */
            <div className={`absolute inset-0 bg-gradient-to-br ${bgGradient}`}>
              {/* Decorative Elements for gradient backgrounds */}
              <div className="absolute -top-10 -right-10 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
              <div className="absolute bottom-20 left-10 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute top-20 left-1/3 w-32 h-32 bg-white/5 rounded-full blur-xl" />
            </div>
          )}

          {/* Grid Pattern Overlay (subtle) */}
          <svg className="absolute inset-0 w-full h-full opacity-5" viewBox="0 0 800 600" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="800" height="600" fill="url(#grid)" />
          </svg>

          {/* Content */}
          <div className="relative h-full flex items-center z-10">
            <div className="container mx-auto px-6 md:px-20 lg:px-24">
              <div className="max-w-3xl mx-auto md:mx-0 text-center md:text-left">
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-block text-xs font-bold tracking-widest uppercase text-white bg-white/20 rounded-full px-4 py-1.5 mb-4 backdrop-blur-sm border border-white/30"
                >
                  {slide.badge}
                </motion.span>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl md:text-6xl font-extrabold text-white leading-tight mb-4 drop-shadow-lg"
                >
                  {slide.title}
                </motion.h1>

                {slide.detail && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-white/90 text-sm md:text-base mb-6"
                  >
                    {date && (
                      <span className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
                        <Calendar className="w-4 h-4" />
                        {date}
                      </span>
                    )}
                    {location && (
                      <span className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
                        <MapPin className="w-4 h-4" />
                        {location}
                      </span>
                    )}
                  </motion.div>
                )}

                {slide.link_url && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Link
                      href={slide.link_url}
                      className="inline-flex items-center gap-2 bg-white text-emerald-700 font-bold px-6 py-3 rounded-full hover:bg-emerald-50 transition-colors shadow-lg hover:shadow-xl"
                    >
                      Selengkapnya
                      <ChevronRight className="w-5 h-5" />
                    </Link>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows - Hidden on Mobile */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full p-3 transition-all hover:scale-110"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextSlide}
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full p-3 transition-all hover:scale-110"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Dot Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                index === current
                  ? "bg-white w-8 h-2"
                  : "bg-white/50 w-2 h-2 hover:bg-white/75"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}