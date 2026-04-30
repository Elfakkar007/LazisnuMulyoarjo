"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Download } from "lucide-react";
import { YearSummarySection } from "./year-summary-section";
import { KalengDistributionSection } from "./kaleng-distribution-section";
import { MonthlyIncomeSection } from "./monthly-income-section";
import { ProgramsSection } from "./programs-section";
import { ExpenseDetailSection } from "./expense-detail-section";

// Import fungsi API publik
import {
  getKalengDistribution,
  getMonthlyIncome,
  getPrograms,
  getProgramCategories,
  getFinancialTransactions
} from '@/lib/api/client-public';

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
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (selectedYear) {
      loadYearData(selectedYear.id);
    }
  }, [selectedYear]);

  const loadYearData = async (yearId: string) => {
    setLoading(true);
    try {
      const [kaleng, income, programs, categories, transactions] = await Promise.all([
        getKalengDistribution(yearId),
        getMonthlyIncome(yearId),
        getPrograms(yearId),
        getProgramCategories(),
        getFinancialTransactions(yearId, undefined),
      ]);

      setKalengData(kaleng);
      setIncomeData(income);
      setProgramsData(programs);
      setCategoriesData(categories);
      setTransactionsData(transactions);
      
      // Log loaded data
      console.log('✅ Data loaded:', {
        kaleng: kaleng.length,
        income: income.length,
        programs: programs.length,
        categories: categories.length,
        transactions: transactions.length,
      });
    } catch (error) {
      console.error("Error loading financial data:", error);
    } finally {
      setLoading(false);
    }
  };



  // ============================================
  // COMPUTE DYNAMIC DATA FROM TRANSACTIONS
  // ============================================
  const computedTotalIncome = transactionsData
    .filter(t => t.transaction_type === 'income')
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
    
  const computedTotalExpense = transactionsData
    .filter(t => t.transaction_type === 'expense')
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  const computedProgramsData = programsData.map(prog => ({
    ...prog,
    realization: transactionsData
      .filter(t => t.program_id === prog.id && t.transaction_type === 'expense')
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0)
  }));

  const computedYear = selectedYear ? {
    ...selectedYear,
    total_income: computedTotalIncome,
    total_expense: computedTotalExpense
  } : null;

  const handleDownloadPDF = async () => {
    if (!selectedYear || downloading) return;

    try {
      setDownloading(true);

      // Show loading notification
      const loadingToast = document.createElement('div');
      loadingToast.id = 'pdf-loading-toast';
      loadingToast.className = 'fixed bottom-4 right-4 bg-emerald-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2';
      loadingToast.innerHTML = `
        <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>Membuat PDF...</span>
      `;
      document.body.appendChild(loadingToast);

      // Prepare data
      const reportData = {
        year: selectedYear.year,
        totalIncome: computedTotalIncome,
        totalExpense: computedTotalExpense,
        balance: computedTotalIncome - computedTotalExpense,
        kalengData: kalengData || [],
        incomeData: incomeData || [],
        programsData: computedProgramsData || [],
        categoriesData: categoriesData || [],
        transactionsData: transactionsData || [],
      };

      // Log data before sending to PDF generator
      console.log('📤 Sending to PDF generator:', {
        year: reportData.year,
        totalIncome: reportData.totalIncome,
        totalExpense: reportData.totalExpense,
        balance: reportData.balance,
        kalengCount: reportData.kalengData.length,
        incomeCount: reportData.incomeData.length,
        programsCount: reportData.programsData.length,
        categoriesCount: reportData.categoriesData.length,
        transactionsCount: reportData.transactionsData.length,
      });

      // Dynamic import
      const { generateAndDownloadFinancialReport } = await import('@/lib/utils/pdf-generator');

      // Generate and download
      const result = await generateAndDownloadFinancialReport(reportData);

      // Remove loading toast
      const toast = document.getElementById('pdf-loading-toast');
      if (toast) document.body.removeChild(toast);

      if (result.success) {
        // Show success message
        const successToast = document.createElement('div');
        successToast.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2';
        successToast.innerHTML = `
          <svg class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span>PDF berhasil diunduh!</span>
        `;
        document.body.appendChild(successToast);
        setTimeout(() => {
          if (document.body.contains(successToast)) {
            document.body.removeChild(successToast);
          }
        }, 3000);
      } else {
        throw new Error(result.error || 'Gagal membuat PDF');
      }
    } catch (error) {
      console.error('❌ Error downloading PDF:', error);
      
      // Show error message
      const errorToast = document.createElement('div');
      errorToast.className = 'fixed bottom-4 right-4 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      errorToast.textContent = 'Gagal mengunduh PDF. Silakan coba lagi.';
      document.body.appendChild(errorToast);
      setTimeout(() => {
        if (document.body.contains(errorToast)) {
          document.body.removeChild(errorToast);
        }
      }, 3000);
    } finally {
      setDownloading(false);
    }
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

            <div className="flex items-center gap-2">
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
                disabled={downloading}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {downloading ? 'Membuat PDF...' : 'Download PDF'}
                </span>
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
              year={computedYear!}
              incomeData={incomeData}
              programsData={computedProgramsData}
              categoriesData={categoriesData}
              transactionsData={transactionsData}
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
              programsData={computedProgramsData}
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