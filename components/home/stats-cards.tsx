"use client";

import { motion } from "framer-motion";
import { TrendingUp, DollarSign, Package } from "lucide-react";

interface StatsCardsProps {
  totalKaleng: number;
  currentMonthIncome: {
    gross_amount: number;
    month: number;
  } | null;
  activeYear: {
    year: number;
    total_income: number;
    total_expense: number;
  } | null;
}

export function StatsCards({ totalKaleng, currentMonthIncome, activeYear }: StatsCardsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getMonthName = (month: number) => {
    const months = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    return months[month - 1];
  };

  const stats = [
    {
      id: 1,
      label: "Total Kaleng Terdistribusi",
      value: totalKaleng.toLocaleString("id-ID"),
      subtext: `Tahun ${activeYear?.year || new Date().getFullYear()}`,
      icon: Package,
      color: "emerald",
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      id: 2,
      label: "Perolehan Bulan Ini",
      value: formatCurrency(currentMonthIncome?.gross_amount || 0),
      subtext: currentMonthIncome ? getMonthName(currentMonthIncome.month) : "Belum ada data",
      icon: DollarSign,
      color: "blue",
      gradient: "from-blue-500 to-cyan-500",
      badge: true,
    },
    {
      id: 3,
      label: "Total Tahun Ini",
      value: formatCurrency(activeYear?.total_income || 0),
      subtext: `Tahun ${activeYear?.year || new Date().getFullYear()}`,
      icon: TrendingUp,
      color: "purple",
      gradient: "from-purple-500 to-pink-500",
      badge: true,
    },
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
            Ringkasan Statistik
          </h2>
          <p className="text-gray-600 font-medium">
            Data real-time pengelolaan koin amal
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            
            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow overflow-hidden group"
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />

                {/* Icon */}
                <div className={`absolute top-4 right-4 w-16 h-16 bg-gradient-to-br ${stat.gradient} rounded-full flex items-center justify-center opacity-10`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>

                {/* Badge */}
                {stat.badge && (
                  <span className="inline-block text-[9px] font-bold tracking-wider uppercase border border-emerald-300 text-emerald-600 rounded-full px-2 py-0.5 mb-3">
                    UPDATED
                  </span>
                )}

                {/* Value */}
                <div className="relative z-10">
                  <p className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
                    {stat.value}
                  </p>
                  <p className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-xs text-gray-400 font-medium">
                    {stat.subtext}
                  </p>
                </div>

                {/* Decorative Circle */}
                <div className={`absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-br ${stat.gradient} rounded-full opacity-5`} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}