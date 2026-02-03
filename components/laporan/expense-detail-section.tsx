"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, ChevronDown, ChevronUp } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils/helpers";

interface ExpenseDetailSectionProps {
  year: number;
  transactionsData: any[];
  categoriesData: any[];
}

export function ExpenseDetailSection({ year, transactionsData, categoriesData }: ExpenseDetailSectionProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const categoryTransactions = categoriesData.map((category) => {
    const transactions = transactionsData.filter((t) => t.category_id === category.id && t.transaction_type === "expense");
    transactions.sort((a, b) => new Date(a.transaction_date).getTime() - new Date(b.transaction_date).getTime());
    let balance = 0;
    const transactionsWithBalance = transactions.map((t) => {
      balance += t.amount;
      return { ...t, runningBalance: balance };
    });
    return { category, transactions: transactionsWithBalance, total: balance };
  });

  const grandTotal = categoryTransactions.reduce((sum, ct) => sum + ct.total, 0);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white rounded-xl shadow-md p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-emerald-600 rounded-lg p-2"><FileText className="w-6 h-6 text-white" /></div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">E. Rincian Pengeluaran per Program</h2>
          <p className="text-sm text-gray-600">Detail transaksi dengan format Debet, Kredit, Saldo</p>
        </div>
      </div>

      <div className="mb-6 bg-gradient-to-br from-emerald-600 to-teal-600 text-white rounded-xl p-6">
        <p className="text-sm font-semibold uppercase tracking-wide mb-2">Total Pengeluaran Tahun {year}</p>
        <p className="text-4xl font-extrabold">{formatCurrency(grandTotal)}</p>
      </div>

      <div className="space-y-4">
        {categoryTransactions.map(({ category, transactions, total }) => (
          <div key={category.id} className="border-2 rounded-lg overflow-hidden" style={{ borderColor: category.color_code || "#6b7280" }}>
            <button onClick={() => toggleCategory(category.id)} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors" style={{ backgroundColor: expandedCategories.has(category.id) ? `${category.color_code}10` : "white" }}>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color_code }} />
                <div className="text-left">
                  <h3 className="text-lg font-bold text-gray-900">{category.name}</h3>
                  <p className="text-sm text-gray-600">{transactions.length} transaksi • Alokasi: {category.percentage}%</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs text-gray-600 mb-1">Total</p>
                  <p className="text-xl font-bold text-gray-900">{formatCurrency(total)}</p>
                </div>
                {expandedCategories.has(category.id) ? (<ChevronUp className="w-6 h-6 text-gray-600" />) : (<ChevronDown className="w-6 h-6 text-gray-600" />)}
              </div>
            </button>

            {expandedCategories.has(category.id) && (
              <div className="border-t-2" style={{ borderColor: category.color_code }}>
                {transactions.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">Belum ada transaksi dalam kategori ini</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-100 border-b border-gray-300">
                          <th className="px-4 py-3 text-left font-bold text-gray-700">Tanggal</th>
                          <th className="px-4 py-3 text-left font-bold text-gray-700">Keterangan</th>
                          <th className="px-4 py-3 text-right font-bold text-gray-700">Debet</th>
                          <th className="px-4 py-3 text-right font-bold text-gray-700">Kredit</th>
                          <th className="px-4 py-3 text-right font-bold text-gray-700 bg-gray-200">Saldo</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map((transaction, index) => (
                          <tr key={transaction.id} className={`border-b border-gray-200 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                            <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{formatDate(transaction.transaction_date)}</td>
                            <td className="px-4 py-3 text-gray-900">{transaction.description}</td>
                            <td className="px-4 py-3 text-right text-gray-400">-</td>
                            <td className="px-4 py-3 text-right font-semibold text-red-600">{formatCurrency(transaction.amount)}</td>
                            <td className="px-4 py-3 text-right font-bold text-gray-900 bg-gray-100">{formatCurrency(transaction.runningBalance)}</td>
                          </tr>
                        ))}
                        <tr className="bg-gray-200 border-t-2 border-gray-400 font-bold">
                          <td colSpan={2} className="px-4 py-4 text-gray-900">TOTAL {category.name.toUpperCase()}</td>
                          <td className="px-4 py-4 text-right text-gray-400">-</td>
                          <td className="px-4 py-4 text-right text-red-700">{formatCurrency(total)}</td>
                          <td className="px-4 py-4 text-right text-gray-900 bg-gray-300">{formatCurrency(total)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <h4 className="text-sm font-bold text-blue-900 mb-2">Catatan Format Pembukuan:</h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• <strong>Debet</strong>: Pemasukan dana (tidak ditampilkan di tabel pengeluaran ini)</li>
          <li>• <strong>Kredit</strong>: Pengeluaran untuk program/operasional</li>
          <li>• <strong>Saldo</strong>: Akumulasi pengeluaran dalam kategori</li>
          <li>• Klik header kategori untuk expand/collapse detail transaksi</li>
        </ul>
      </div>
    </motion.div>
  );
}