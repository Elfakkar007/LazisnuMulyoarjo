"use client";

import { motion } from "framer-motion";
import { DollarSign, Download, TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { formatCurrency, formatCurrencyCompact, getMonthName } from "@/lib/utils/helpers";

interface MonthlyIncomeSectionProps {
  year: number;
  incomeData: any[];
}

export function MonthlyIncomeSection({ year, incomeData }: MonthlyIncomeSectionProps) {
  const chartData = incomeData.map((item) => ({
    month: getMonthName(item.month).substring(0, 3),
    amount: item.gross_amount,
  }));

  const handleExportExcel = () => {
    const headers = ["Bulan", "Perolehan Bruto", "Upah Kaleng", "SPB", "Netto", "JPZIS 25%", "JPZIS 75%"];
    const rows = incomeData.map((item) => {
      const netto = item.gross_amount - item.kaleng_wages - item.spb_cost;
      return [getMonthName(item.month), item.gross_amount, item.kaleng_wages, item.spb_cost, netto, item.jpzis_25_percent, item.jpzis_75_percent];
    });
    const totals = ["TOTAL", incomeData.reduce((sum, item) => sum + item.gross_amount, 0), incomeData.reduce((sum, item) => sum + item.kaleng_wages, 0), incomeData.reduce((sum, item) => sum + item.spb_cost, 0), incomeData.reduce((sum, item) => { const netto = item.gross_amount - item.kaleng_wages - item.spb_cost; return sum + netto; }, 0), incomeData.reduce((sum, item) => sum + item.jpzis_25_percent, 0), incomeData.reduce((sum, item) => sum + item.jpzis_75_percent, 0)];
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += headers.join(",") + "\n";
    rows.forEach((row) => { csvContent += row.join(",") + "\n"; });
    csvContent += totals.join(",") + "\n";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `laporan-pemasukan-${year}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="text-xs text-gray-600 mb-1 font-semibold">{payload[0].payload.month}</p>
          <p className="text-lg font-bold text-emerald-600">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  const totals = {
    gross: incomeData.reduce((sum, item) => sum + item.gross_amount, 0),
    wages: incomeData.reduce((sum, item) => sum + item.kaleng_wages, 0),
    spb: incomeData.reduce((sum, item) => sum + item.spb_cost, 0),
    jpzis25: incomeData.reduce((sum, item) => sum + item.jpzis_25_percent, 0),
    jpzis75: incomeData.reduce((sum, item) => sum + item.jpzis_75_percent, 0),
  };
  const nettoTotal = totals.gross - totals.wages - totals.spb;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-xl shadow-md p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-600 rounded-lg p-2"><DollarSign className="w-6 h-6 text-white" /></div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">C. Laporan Pemasukan Bulanan</h2>
            <p className="text-sm text-gray-600">Detail perolehan dan distribusi per bulan</p>
          </div>
        </div>
        <button onClick={handleExportExcel} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
          <Download className="w-4 h-4" />Export Excel
        </button>
      </div>

      <div className="mb-8">
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-200">
          <div className="flex items-center gap-2 mb-4"><TrendingUp className="w-5 h-5 text-emerald-600" /><h3 className="text-lg font-bold text-gray-900">Tren Perolehan Bruto</h3></div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#6b7280" }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} stroke="#9ca3af" tickFormatter={formatCurrencyCompact} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="amount" stroke="#059669" strokeWidth={3} dot={{ fill: "#059669", r: 5 }} activeDot={{ r: 7 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-emerald-600 text-white">
              <th className="px-4 py-3 text-left font-bold">Bulan</th>
              <th className="px-4 py-3 text-right font-bold">Perolehan Bruto</th>
              <th className="px-4 py-3 text-right font-bold">Upah Kaleng</th>
              <th className="px-4 py-3 text-right font-bold">SPB</th>
              <th className="px-4 py-3 text-right font-bold">Netto</th>
              <th className="px-4 py-3 text-right font-bold bg-emerald-700">JPZIS 25%</th>
              <th className="px-4 py-3 text-right font-bold bg-emerald-700">JPZIS 75%</th>
            </tr>
          </thead>
          <tbody>
            {incomeData.map((item) => {
              const netto = item.gross_amount - item.kaleng_wages - item.spb_cost;
              return (
                <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold text-gray-900">{getMonthName(item.month)}</td>
                  <td className="px-4 py-3 text-right font-semibold text-emerald-600">{formatCurrency(item.gross_amount)}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{formatCurrency(item.kaleng_wages)}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{formatCurrency(item.spb_cost)}</td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-900">{formatCurrency(netto)}</td>
                  <td className="px-4 py-3 text-right font-semibold text-blue-600 bg-blue-50">{formatCurrency(item.jpzis_25_percent)}</td>
                  <td className="px-4 py-3 text-right font-semibold text-purple-600 bg-purple-50">{formatCurrency(item.jpzis_75_percent)}</td>
                </tr>
              );
            })}
            <tr className="bg-gray-100 border-t-2 border-gray-400 font-bold">
              <td className="px-4 py-4 text-gray-900">TOTAL</td>
              <td className="px-4 py-4 text-right text-emerald-700">{formatCurrency(totals.gross)}</td>
              <td className="px-4 py-4 text-right text-gray-900">{formatCurrency(totals.wages)}</td>
              <td className="px-4 py-4 text-right text-gray-900">{formatCurrency(totals.spb)}</td>
              <td className="px-4 py-4 text-right text-gray-900">{formatCurrency(nettoTotal)}</td>
              <td className="px-4 py-4 text-right text-blue-700 bg-blue-100">{formatCurrency(totals.jpzis25)}</td>
              <td className="px-4 py-4 text-right text-purple-700 bg-purple-100">{formatCurrency(totals.jpzis75)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <h4 className="text-sm font-bold text-blue-900 mb-2">Catatan:</h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• <strong>Netto</strong> = Perolehan Bruto - Upah Kaleng - SPB</li>
          <li>• <strong>JPZIS 25%</strong> = 25% dari Netto (untuk operasional)</li>
          <li>• <strong>JPZIS 75%</strong> = 75% dari Netto (untuk program)</li>
        </ul>
      </div>
    </motion.div>
  );
}