"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Download } from "lucide-react";
import { YearSummarySection } from "./year-summary-section";
import { KalengDistributionSection } from "./kaleng-distribution-section";
import { MonthlyIncomeSection } from "./monthly-income-section";
import { ProgramsSection } from "./programs-section";
import { ExpenseDetailSection } from "./expense-detail-section";
import { fetchFinancialData } from "@/app/actions/financial"; 

interface FinancialYear {
  id: string;
  year: number;
  is_active: boolean;
  total_income: number;
  total_expense: number;
  created_at: string;
}

interface FinancialReportContentProps {
  financialYears: FinancialYear[];
}

export function FinancialReportContent({
  financialYears,
}: FinancialReportContentProps) {
  const activeYear = financialYears.find((y) => y.is_active);
  const [selectedYear, setSelectedYear] = useState<FinancialYear | null>(
    activeYear || financialYears[0] || null
  );

  const [kalengData, setKalengData] = useState<any[]>([]);
  const [incomeData, setIncomeData] = useState<any[]>([]);
  const [programsData, setProgramsData] = useState<any[]>([]);
  const [categoriesData, setCategoriesData] = useState<any[]>([]);
  const [transactionsData, setTransactionsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedYear) {
      loadYearData(selectedYear.id);
    }
  }, [selectedYear]);

  // --- FUNGSI INI KITA SEDERHANAKAN ---
  const loadYearData = async (yearId: string) => {
    setLoading(true);
    try {
      // Panggil Server Action (ini aman dijalankan di client)
      const data = await fetchFinancialData(yearId);

      // Masukkan data ke state
      setKalengData(data.kaleng);
      setIncomeData(data.income);
      setProgramsData(data.programs);
      setCategoriesData(data.categories);
      setTransactionsData(data.transactions);
    } catch (error) {
      console.error("Error loading financial data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    alert("Fitur download PDF akan segera tersedia");
  };

  if (!selectedYear) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-600">Belum ada data tahun keuangan</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Year Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-emerald-600" />
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Pilih Tahun Laporan
                </h2>
                <p className="text-sm text-gray-600">
                  Lihat detail keuangan per tahun
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={selectedYear.id}
                onChange={(e) => {
                  const year = financialYears.find((y) => y.id === e.target.value);
                  if (year) setSelectedYear(year);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-gray-900 font-semibold"
              >
                {financialYears.map((year) => (
                  <option key={year.id} value={year.id}>
                    Tahun {year.year}
                    {year.is_active ? " (Aktif)" : ""}
                  </option>
                ))}
              </select>

              <button
                onClick={handleDownloadPDF}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                <Download className="w-4 h-4" />
                <span className="hidden md:inline">Download PDF</span>
              </button>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <LoadingSections />
        ) : (
          <>
            {/* A. Year Summary */}
            <YearSummarySection
              year={selectedYear}
              incomeData={incomeData}
              programsData={programsData}
              categoriesData={categoriesData}
            />

            {/* B. Kaleng Distribution */}
            <KalengDistributionSection
              year={selectedYear.year}
              kalengData={kalengData}
            />

            {/* C. Monthly Income */}
            <MonthlyIncomeSection
              year={selectedYear.year}
              incomeData={incomeData}
            />

            {/* D. Programs & Realization */}
            <ProgramsSection
              year={selectedYear.year}
              programsData={programsData}
              categoriesData={categoriesData}
            />

            {/* E. Expense Detail */}
            <ExpenseDetailSection
              year={selectedYear.year}
              transactionsData={transactionsData}
              categoriesData={categoriesData}
            />
          </>
        )}
      </div>
    </div>
  );
}

function LoadingSections() {
  return (
    <div className="space-y-8">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="bg-white rounded-xl shadow-md p-8">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6 animate-pulse" />
          <div className="h-64 bg-gray-100 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}