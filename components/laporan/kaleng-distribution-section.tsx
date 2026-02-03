"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Package, Filter } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { formatNumber, getMonthName, getDusunColor } from "@/lib/utils/helpers";

interface KalengDistributionSectionProps {
  year: number;
  kalengData: any[];
}

const MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const DUSUN = ["Pakutukan", "Watugel", "Paras", "Ampelgading"];

export function KalengDistributionSection({ year, kalengData }: KalengDistributionSectionProps) {
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  const filteredData = selectedMonth ? kalengData.filter((d) => d.month === selectedMonth) : kalengData;

  const monthlyData = MONTHS.map((month) => {
    const monthData = kalengData.filter((d) => d.month === month);
    return {
      month,
      data: DUSUN.map((dusun) => {
        const dusunData = monthData.find((d) => d.dusun === dusun);
        return {
          dusun,
          distributed: dusunData?.total_distributed || 0,
          collected: dusunData?.total_collected || 0,
          notCollected: dusunData?.total_not_collected || 0,
        };
      }),
    };
  });

  const dusunTotals = DUSUN.map((dusun) => {
    const dusunData = filteredData.filter((d) => d.dusun === dusun);
    const totalDistributed = dusunData.reduce((sum, d) => sum + d.total_distributed, 0);
    return { name: dusun, value: totalDistributed, color: getDusunColor(dusun) };
  });

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm font-semibold text-gray-900">{payload[0].name}</p>
          <p className="text-lg font-bold text-emerald-600">{formatNumber(payload[0].value)} kaleng</p>
        </div>
      );
    }
    return null;
  };

  const grandTotal = {
    distributed: filteredData.reduce((sum, d) => sum + d.total_distributed, 0),
    collected: filteredData.reduce((sum, d) => sum + d.total_collected, 0),
    notCollected: filteredData.reduce((sum, d) => sum + d.total_not_collected, 0),
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl shadow-md p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-emerald-600 rounded-lg p-2">
          <Package className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">B. Persebaran Kaleng</h2>
          <p className="text-sm text-gray-600">Data distribusi dan pengambilan kaleng per dusun</p>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <Filter className="w-5 h-5 text-gray-600" />
          <span className="text-sm font-semibold text-gray-700">Filter Bulan:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setSelectedMonth(null)} className={`px-4 py-2 rounded-lg font-semibold transition-colors ${selectedMonth === null ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
            Semua Bulan
          </button>
          {MONTHS.map((month) => (
            <button key={month} onClick={() => setSelectedMonth(month)} className={`px-4 py-2 rounded-lg font-semibold transition-colors ${selectedMonth === month ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
              {getMonthName(month)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">Distribusi per Dusun{selectedMonth && ` - ${getMonthName(selectedMonth)}`}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={dusunTotals} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, value }) => `${name}: ${formatNumber(value)}`}>
                {dusunTotals.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Ringkasan Total</h3>
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg p-4 border border-emerald-200">
            <p className="text-sm text-gray-600 mb-1">Total Terdistribusi</p>
            <p className="text-3xl font-extrabold text-emerald-700">{formatNumber(grandTotal.distributed)} <span className="text-lg">kaleng</span></p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200">
            <p className="text-sm text-gray-600 mb-1">Total Terkumpul</p>
            <p className="text-3xl font-extrabold text-blue-700">{formatNumber(grandTotal.collected)} <span className="text-lg">kaleng</span></p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-4 border border-orange-200">
            <p className="text-sm text-gray-600 mb-1">Belum Terkumpul</p>
            <p className="text-3xl font-extrabold text-orange-700">{formatNumber(grandTotal.notCollected)} <span className="text-lg">kaleng</span></p>
          </div>
          {grandTotal.distributed > 0 && (
            <div className="text-sm text-gray-600 pt-2">
              <p>Tingkat Pengumpulan: <span className="font-bold text-emerald-600">{Math.round((grandTotal.collected / grandTotal.distributed) * 100)}%</span></p>
            </div>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Tabel Bulanan per Dusun</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100 border-b-2 border-gray-300">
              <th className="px-4 py-3 text-left font-bold text-gray-700">Bulan</th>
              {DUSUN.map((dusun) => (
                <th key={dusun} className="px-4 py-3 text-center font-bold text-gray-700 border-l border-gray-300" colSpan={3}>{dusun}</th>
              ))}
            </tr>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600"></th>
              {DUSUN.map((dusun) => (
                <>
                  <th key={`${dusun}-dist`} className="px-2 py-2 text-center text-xs font-semibold text-gray-600 border-l border-gray-200">Distribusi</th>
                  <th key={`${dusun}-coll`} className="px-2 py-2 text-center text-xs font-semibold text-gray-600">Terkumpul</th>
                  <th key={`${dusun}-not`} className="px-2 py-2 text-center text-xs font-semibold text-gray-600">Belum</th>
                </>
              ))}
            </tr>
          </thead>
          <tbody>
            {monthlyData.map(({ month, data }) => (
              <tr key={month} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-3 font-semibold text-gray-900">{getMonthName(month)}</td>
                {data.map((d) => (
                  <>
                    <td key={`${d.dusun}-dist`} className="px-2 py-3 text-center text-gray-700 border-l border-gray-200">{formatNumber(d.distributed)}</td>
                    <td key={`${d.dusun}-coll`} className="px-2 py-3 text-center text-emerald-600 font-semibold">{formatNumber(d.collected)}</td>
                    <td key={`${d.dusun}-not`} className="px-2 py-3 text-center text-orange-600">{formatNumber(d.notCollected)}</td>
                  </>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}