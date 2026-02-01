"use client";

import { motion } from "framer-motion";
import { Coins, TrendingUp } from "lucide-react";
import { statsData } from "@/lib/dummy-data";

export function HeroSection() {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <section className="relative bg-gradient-to-br from-emerald-50 via-white to-emerald-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 py-12 md:py-20 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <motion.h1
            className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            LazisNU
            <span className="text-emerald-600"> Mulyoarjo</span>
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-gray-600 font-medium max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Transparansi Pengelolaan Koin Amal untuk Kesejahteraan Bersama
          </motion.p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="bg-white rounded-2xl shadow-xl p-6 border-2 border-emerald-100 hover:shadow-2xl transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="bg-emerald-100 rounded-full p-3">
                <Coins className="w-8 h-8 text-emerald-600" />
              </div>
              <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
                {statsData.currentMonth.percentage}
              </span>
            </div>
            <h3 className="text-sm font-semibold text-gray-500 mb-2">
              {statsData.currentMonth.label}
            </h3>
            <p className="text-3xl md:text-4xl font-extrabold text-gray-900">
              {formatCurrency(statsData.currentMonth.total)}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl shadow-xl p-6 text-white hover:shadow-2xl transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="bg-white/20 rounded-full p-3">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
                {statsData.currentYear.percentage}
              </span>
            </div>
            <h3 className="text-sm font-semibold text-emerald-100 mb-2">
              {statsData.currentYear.label}
            </h3>
            <p className="text-3xl md:text-4xl font-extrabold">
              {formatCurrency(statsData.currentYear.total)}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}