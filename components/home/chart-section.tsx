"use client";

import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp } from "lucide-react";

interface ChartData {
  month: string;
  amount: number;
}

interface ChartSectionProps {
  data: ChartData[];
  yearLabel?: string;
}

export function ChartSection({ data, yearLabel }: ChartSectionProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatCompactCurrency = (value: number) => {
    if (value >= 1000000) {
      return `Rp ${(value / 1000000).toFixed(1)}jt`;
    }
    return formatCurrency(value);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="text-xs text-gray-600 mb-1 font-semibold">
            {payload[0].payload.month}
          </p>
          <p className="text-lg font-bold text-emerald-600">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  // Calculate total and average
  const total = data.reduce((sum, item) => sum + item.amount, 0);
  const average = data.length > 0 ? total / data.length : 0;
  const highest = Math.max(...data.map(item => item.amount));

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
            Tren Perolehan Bulanan
          </h2>
          <p className="text-gray-600 font-medium">
            Grafik perkembangan koin amal {yearLabel || "tahun ini"}
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl shadow-lg p-6 md:p-8 border border-emerald-100"
          >
            {/* Header with Icon */}
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-emerald-600 rounded-lg p-2.5">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Perolehan Per Bulan
                </h3>
                <p className="text-sm text-gray-600">
                  Total: {formatCurrency(total)}
                </p>
              </div>
            </div>

            {/* Chart */}
            <div className="mb-6">
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#059669" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                    stroke="#9ca3af"
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                    stroke="#9ca3af"
                    tickFormatter={formatCompactCurrency}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#059669"
                    strokeWidth={3}
                    fill="url(#colorAmount)"
                    fillOpacity={1}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-emerald-200">
              <div className="text-center">
                <p className="text-xs text-gray-600 mb-1 font-semibold uppercase">
                  Rata-rata
                </p>
                <p className="text-lg font-bold text-emerald-700">
                  {formatCompactCurrency(average)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-600 mb-1 font-semibold uppercase">
                  Tertinggi
                </p>
                <p className="text-lg font-bold text-emerald-700">
                  {formatCompactCurrency(highest)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-600 mb-1 font-semibold uppercase">
                  Total Bulan
                </p>
                <p className="text-lg font-bold text-emerald-700">
                  {data.length}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}