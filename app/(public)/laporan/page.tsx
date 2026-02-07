import { Suspense } from "react";
import { FinancialReportContent } from "@/components/laporan/financial-report-content";
import { getFinancialYears } from "@/lib/api/public";

export default async function LaporanPage() {
  const financialYears = await getFinancialYears();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-700 to-teal-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
              Laporan Keuangan
            </h1>
            <p className="text-lg text-emerald-50">
              Transparansi pengelolaan dana koin amal untuk kesejahteraan bersama
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <Suspense fallback={<LoadingState />}>
        <FinancialReportContent financialYears={financialYears} />
      </Suspense>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Year selector skeleton */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4 animate-pulse" />
          <div className="h-12 bg-gray-100 rounded animate-pulse" />
        </div>

        {/* Cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-md p-6">
              <div className="h-16 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>

        {/* Chart skeleton */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="h-80 bg-gray-100 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}