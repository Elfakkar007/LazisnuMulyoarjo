"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Target, CheckCircle, XCircle, Filter } from "lucide-react";
import { formatCurrency, calculateProgramProgress } from "@/lib/utils/helpers";

interface ProgramsSectionProps {
  year: number;
  programsData: any[];
  categoriesData: any[];
}

type FilterType = "all" | "completed" | "incomplete";

export function ProgramsSection({ year, programsData, categoriesData }: ProgramsSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(categoriesData[0]?.id || null);
  const [filter, setFilter] = useState<FilterType>("all");

  const categoryPrograms = programsData.filter((p) => p.category_id === activeCategory);
  const filteredPrograms = categoryPrograms.filter((p) => {
    if (filter === "completed") return p.is_completed;
    if (filter === "incomplete") return !p.is_completed;
    return true;
  });

  const categoryTotals = {
    budget: categoryPrograms.reduce((sum, p) => sum + p.budget, 0),
    realization: categoryPrograms.reduce((sum, p) => sum + p.realization, 0),
    completed: categoryPrograms.filter((p) => p.is_completed).length,
    total: categoryPrograms.length,
  };

  const activeTab = categoriesData.find((c) => c.id === activeCategory);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-xl shadow-md p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-emerald-600 rounded-lg p-2"><Target className="w-6 h-6 text-white" /></div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">D. Program Kerja & Realisasi</h2>
          <p className="text-sm text-gray-600">Rincian program dan pencapaian per kategori</p>
        </div>
      </div>

      <div className="mb-6">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {categoriesData.map((category) => (
              <button key={category.id} onClick={() => setActiveCategory(category.id)} className={`px-6 py-3 font-semibold whitespace-nowrap transition-colors border-b-2 ${activeCategory === category.id ? "border-emerald-600 text-emerald-600" : "border-transparent text-gray-600 hover:text-emerald-600"}`}>
                {category.name}<span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded-full">{category.percentage}%</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <Filter className="w-5 h-5 text-gray-600" />
        <div className="flex gap-2">
          <button onClick={() => setFilter("all")} className={`px-4 py-2 rounded-lg font-semibold transition-colors ${filter === "all" ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>Semua ({categoryPrograms.length})</button>
          <button onClick={() => setFilter("completed")} className={`px-4 py-2 rounded-lg font-semibold transition-colors ${filter === "completed" ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>Terlaksana ({categoryTotals.completed})</button>
          <button onClick={() => setFilter("incomplete")} className={`px-4 py-2 rounded-lg font-semibold transition-colors ${filter === "incomplete" ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>Belum Terlaksana ({categoryTotals.total - categoryTotals.completed})</button>
        </div>
      </div>

      {activeTab && (
        <div className="mb-6 p-4 rounded-lg border-2" style={{ borderColor: activeTab.color_code }}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-600 mb-1 font-semibold uppercase">Total Anggaran</p>
              <p className="text-xl font-bold" style={{ color: activeTab.color_code }}>{formatCurrency(categoryTotals.budget)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1 font-semibold uppercase">Total Realisasi</p>
              <p className="text-xl font-bold text-emerald-600">{formatCurrency(categoryTotals.realization)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1 font-semibold uppercase">Persentase</p>
              <p className="text-xl font-bold text-blue-600">{categoryTotals.budget > 0 ? Math.round((categoryTotals.realization / categoryTotals.budget) * 100) : 0}%</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1 font-semibold uppercase">Program Selesai</p>
              <p className="text-xl font-bold text-gray-900">{categoryTotals.completed} / {categoryTotals.total}</p>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100 border-b-2 border-gray-300">
              <th className="px-4 py-3 text-left font-bold text-gray-700">Nama Program</th>
              <th className="px-4 py-3 text-left font-bold text-gray-700">Target Sasaran</th>
              <th className="px-4 py-3 text-left font-bold text-gray-700">Kuantitas</th>
              <th className="px-4 py-3 text-right font-bold text-gray-700">Anggaran</th>
              <th className="px-4 py-3 text-right font-bold text-gray-700">Realisasi</th>
              <th className="px-4 py-3 text-center font-bold text-gray-700">Progress</th>
              <th className="px-4 py-3 text-center font-bold text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredPrograms.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-500">Tidak ada program dalam filter ini</td></tr>
            ) : (
              filteredPrograms.map((program) => {
                const progress = calculateProgramProgress(program.realization, program.budget);
                return (
                  <tr key={program.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-semibold text-gray-900">{program.name}</p>
                        {program.description && (<p className="text-xs text-gray-600 mt-1">{program.description}</p>)}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{program.target_audience || "-"}</td>
                    <td className="px-4 py-3 text-gray-700">{program.quantity || "-"}</td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900">{formatCurrency(program.budget)}</td>
                    <td className="px-4 py-3 text-right font-semibold text-emerald-600">{formatCurrency(program.realization)}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-xs font-bold text-gray-700">{progress}%</span>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all" style={{ width: `${progress}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {program.is_completed ? (
                        <div className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">
                          <CheckCircle className="w-4 h-4" /><span className="text-xs font-semibold">Selesai</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 px-3 py-1 rounded-full">
                          <XCircle className="w-4 h-4" /><span className="text-xs font-semibold">Proses</span>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}