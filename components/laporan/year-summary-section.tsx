"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { formatCurrency } from "@/lib/utils/helpers";

interface YearSummarySectionProps {
  year: {
    year: number;
    total_income: number;
    total_expense: number;
  };
  incomeData: any[];
  programsData: any[];
  categoriesData: any[];
}

export function YearSummarySection({
  year,
  incomeData,
  programsData,
  categoriesData,
}: YearSummarySectionProps) {
  const balance = year.total_income - year.total_expense;
  const expensePercentage = year.total_income > 0 
    ? Math.round((year.total_expense / year.total_income) * 100)
    : 0;

  const chartData = [
    { name: "Pemasukan", value: year.total_income, color: "#10b981" },
    { name: "Pengeluaran", value: year.total_expense, color: "#ef4444" },
  ];

  const categoryBreakdown = categoriesData.map((cat) => {
    const categoryPrograms = programsData.filter((p) => p.category_id === cat.id);
    const totalRealization = categoryPrograms.reduce((sum, p) => sum + (p.realization || 0), 0);
    return {
      name: cat.name,
      value: totalRealization,
      color: cat.color_code || "#6b7280",
      percentage: cat.percentage,
    };
  });

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm font-semibold text-gray-900">{payload[0].name}</p>
          <p className="text-lg font-bold text-emerald-600">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">A. Ringkasan Tahun {year.year}</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <TrendingUp className="w-8 h-8" />
            <div className="bg-white/20 rounded-full p-2">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-sm font-semibold uppercase tracking-wide mb-1">Total Pemasukan</p>
          <p className="text-3xl font-extrabold">{formatCurrency(year.total_income)}</p>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <TrendingDown className="w-8 h-8" />
            <div className="bg-white/20 rounded-full p-2">
              <span className="text-sm font-bold">{expensePercentage}%</span>
            </div>
          </div>
          <p className="text-sm font-semibold uppercase tracking-wide mb-1">Total Pengeluaran</p>
          <p className="text-3xl font-extrabold">{formatCurrency(year.total_expense)}</p>
        </div>

        <div className={`rounded-xl p-6 text-white shadow-lg ${
          balance >= 0 ? "bg-gradient-to-br from-blue-500 to-indigo-600" : "bg-gradient-to-br from-orange-500 to-red-600"
        }`}>
          <div className="flex items-center justify-between mb-3">
            <DollarSign className="w-8 h-8" />
            <div className="bg-white/20 rounded-full px-3 py-1">
              <span className="text-xs font-bold">{balance >= 0 ? "SURPLUS" : "DEFISIT"}</span>
            </div>
          </div>
          <p className="text-sm font-semibold uppercase tracking-wide mb-1">Sisa Saldo</p>
          <p className="text-3xl font-extrabold">{formatCurrency(Math.abs(balance))}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Perbandingan Pemasukan & Pengeluaran</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Rincian Pengeluaran per Kategori</h3>
          <div className="space-y-4">
            {categoryBreakdown.map((cat) => (
              <div key={cat.name}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">{cat.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">{cat.percentage}%</span>
                    <span className="text-sm font-bold text-gray-900">{formatCurrency(cat.value)}</span>
                  </div>
                </div>
                <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div className="absolute inset-y-0 left-0 rounded-full transition-all" style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }} />
                </div>
              </div>
            ))}
          </div>
          {categoryBreakdown.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-8">Belum ada data pengeluaran</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}