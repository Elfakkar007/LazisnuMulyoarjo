// =====================================================
// MONTHLY INCOME MANAGEMENT PAGE
// File: app/admin/(dashboard)/monthly-income/page.tsx
// =====================================================

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Save, TrendingUp } from 'lucide-react';
import { getFinancialYears, getMonthlyIncome } from '@/lib/api/client-admin';
import { upsertMonthlyIncome } from '@/lib/actions/admin';
import { formatCurrency, getMonthName } from '@/lib/utils/helpers';

interface FinancialYear {
  id: string;
  year: number;
  is_active: boolean;
}

interface MonthlyIncome {
  id?: string;
  year_id: string;
  month: number;
  gross_amount: number;
  kaleng_wages: number;
  spb_cost: number;
  jpzis_25_percent: number;
  jpzis_75_percent: number;
}

const MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export default function MonthlyIncomePage() {
  const [years, setYears] = useState<FinancialYear[]>([]);
  const [selectedYearId, setSelectedYearId] = useState<string>('');
  const [incomeData, setIncomeData] = useState<Record<number, MonthlyIncome>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingMonth, setEditingMonth] = useState<number | null>(null);

  useEffect(() => {
    loadYears();
  }, []);

  useEffect(() => {
    if (selectedYearId) {
      loadIncomeData();
    }
  }, [selectedYearId]);

  const loadYears = async () => {
    const data = await getFinancialYears();
    setYears(data);
    if (data.length > 0) {
      const activeYear = data.find(y => y.is_active);
      setSelectedYearId(activeYear?.id || data[0].id);
    }
    setLoading(false);
  };

  const loadIncomeData = async () => {
    setLoading(true);
    const data = await getMonthlyIncome(selectedYearId);

    const dataMap: Record<number, MonthlyIncome> = {};
    data.forEach(item => {
      dataMap[item.month] = {
        id: item.id,
        year_id: item.year_id,
        month: item.month,
        gross_amount: item.gross_amount,
        kaleng_wages: item.kaleng_wages,
        spb_cost: item.spb_cost,
        jpzis_25_percent: item.jpzis_25_percent,
        jpzis_75_percent: item.jpzis_75_percent,
      };
    });

    setIncomeData(dataMap);
    setLoading(false);
  };

  const getValue = (month: number): MonthlyIncome => {
    return incomeData[month] || {
      year_id: selectedYearId,
      month,
      gross_amount: 0,
      kaleng_wages: 0,
      spb_cost: 0,
      jpzis_25_percent: 0,
      jpzis_75_percent: 0,
    };
  };

  const calculateNett = (gross: number, wages: number, spb: number): number => {
    return gross - wages - spb;
  };

  const handleSaveMonth = async (month: number) => {
    if (saving) return;

    const data = getValue(month);

    // Validation
    if (data.gross_amount < (data.kaleng_wages + data.spb_cost)) {
      alert('Perolehan Bruto harus lebih besar dari Upah Kaleng + SPB');
      return;
    }

    setSaving(true);
    const result = await upsertMonthlyIncome({
      year_id: selectedYearId,
      month: data.month,
      gross_amount: data.gross_amount,
      kaleng_wages: data.kaleng_wages,
      spb_cost: data.spb_cost,
    });

    if (result.success) {
      await loadIncomeData();
      setEditingMonth(null);
      alert('Data berhasil disimpan!');
    } else {
      alert(`Gagal menyimpan: ${(result as any).message}`);
    }
    setSaving(false);
  };

  const updateValue = (month: number, field: keyof MonthlyIncome, value: number) => {
    setIncomeData({
      ...incomeData,
      [month]: {
        ...getValue(month),
        [field]: value,
      },
    });
  };

  if (loading && years.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (years.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-12 text-center">
        <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          Belum Ada Tahun Keuangan
        </h3>
        <p className="text-gray-600">
          Silakan buat tahun keuangan terlebih dahulu
        </p>
      </div>
    );
  }

  const totals = MONTHS.reduce(
    (acc, month) => {
      const data = getValue(month);
      const nett = calculateNett(data.gross_amount, data.kaleng_wages, data.spb_cost);
      return {
        gross: acc.gross + data.gross_amount,
        wages: acc.wages + data.kaleng_wages,
        spb: acc.spb + data.spb_cost,
        nett: acc.nett + nett,
        jpzis25: acc.jpzis25 + (nett * 0.25),
        jpzis75: acc.jpzis75 + (nett * 0.75),
      };
    },
    { gross: 0, wages: 0, spb: 0, nett: 0, jpzis25: 0, jpzis75: 0 }
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pemasukan Bulanan</h1>
          <p className="text-gray-600 mt-1">Kelola data pemasukan per bulan</p>
        </div>
      </div>

      {/* Year Selector */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Pilih Tahun
        </label>
        <select
          value={selectedYearId}
          onChange={(e) => setSelectedYearId(e.target.value)}
          className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        >
          {years.map(year => (
            <option key={year.id} value={year.id}>
              {year.year} {year.is_active && '(Aktif)'}
            </option>
          ))}
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-6 text-white">
          <p className="text-sm font-semibold uppercase tracking-wide mb-1">Total Perolehan Bruto</p>
          <p className="text-3xl font-extrabold">{formatCurrency(totals.gross)}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-6 text-white">
          <p className="text-sm font-semibold uppercase tracking-wide mb-1">Total JPZIS 25%</p>
          <p className="text-3xl font-extrabold">{formatCurrency(totals.jpzis25)}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-6 text-white">
          <p className="text-sm font-semibold uppercase tracking-wide mb-1">Total JPZIS 75%</p>
          <p className="text-3xl font-extrabold">{formatCurrency(totals.jpzis75)}</p>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-emerald-600 text-white">
                <th className="px-4 py-3 text-left font-bold">Bulan</th>
                <th className="px-4 py-3 text-right font-bold">Perolehan Bruto</th>
                <th className="px-4 py-3 text-right font-bold">Upah Kaleng</th>
                <th className="px-4 py-3 text-right font-bold">SPB</th>
                <th className="px-4 py-3 text-right font-bold bg-emerald-700">Netto</th>
                <th className="px-4 py-3 text-right font-bold bg-blue-600">JPZIS 25%</th>
                <th className="px-4 py-3 text-right font-bold bg-purple-600">JPZIS 75%</th>
                <th className="px-4 py-3 text-center font-bold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {MONTHS.map(month => {
                const data = getValue(month);
                const nett = calculateNett(data.gross_amount, data.kaleng_wages, data.spb_cost);
                const jpzis25 = nett * 0.25;
                const jpzis75 = nett * 0.75;
                const isEditing = editingMonth === month;

                return (
                  <tr key={month} className={`border-b border-gray-200 ${isEditing ? 'bg-yellow-50' : 'hover:bg-gray-50'}`}>
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      {getMonthName(month)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {isEditing ? (
                        <input
                          type="number"
                          value={data.gross_amount || ''}
                          onChange={(e) => updateValue(month, 'gross_amount', e.target.value ? parseFloat(e.target.value) : 0)}
                          className="w-full px-2 py-1 border border-emerald-300 rounded text-right focus:ring-2 focus:ring-emerald-500"
                          min="0"
                          step="1000"
                        />
                      ) : (
                        <span className="font-semibold text-emerald-600">
                          {formatCurrency(data.gross_amount)}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {isEditing ? (
                        <input
                          type="number"
                          value={data.kaleng_wages || ''}
                          onChange={(e) => updateValue(month, 'kaleng_wages', e.target.value ? parseFloat(e.target.value) : 0)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-right focus:ring-2 focus:ring-emerald-500"
                          min="0"
                          step="1000"
                        />
                      ) : (
                        <span className="text-gray-700">{formatCurrency(data.kaleng_wages)}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {isEditing ? (
                        <input
                          type="number"
                          value={data.spb_cost || ''}
                          onChange={(e) => updateValue(month, 'spb_cost', e.target.value ? parseFloat(e.target.value) : 0)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-right focus:ring-2 focus:ring-emerald-500"
                          min="0"
                          step="1000"
                        />
                      ) : (
                        <span className="text-gray-700">{formatCurrency(data.spb_cost)}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right bg-emerald-50 font-semibold text-gray-900">
                      {formatCurrency(nett)}
                    </td>
                    <td className="px-4 py-3 text-right bg-blue-50 font-semibold text-blue-700">
                      {formatCurrency(jpzis25)}
                    </td>
                    <td className="px-4 py-3 text-right bg-purple-50 font-semibold text-purple-700">
                      {formatCurrency(jpzis75)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {isEditing ? (
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleSaveMonth(month)}
                            disabled={saving}
                            className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white px-3 py-1 rounded font-semibold text-xs transition-colors"
                          >
                            Simpan
                          </button>
                          <button
                            onClick={() => {
                              loadIncomeData();
                              setEditingMonth(null);
                            }}
                            disabled={saving}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-3 py-1 rounded font-semibold text-xs transition-colors"
                          >
                            Batal
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setEditingMonth(month)}
                          className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded font-semibold text-xs transition-colors"
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
              <tr className="bg-gray-100 border-t-2 border-gray-400 font-bold">
                <td className="px-4 py-4 text-gray-900">TOTAL</td>
                <td className="px-4 py-4 text-right text-emerald-700">{formatCurrency(totals.gross)}</td>
                <td className="px-4 py-4 text-right text-gray-900">{formatCurrency(totals.wages)}</td>
                <td className="px-4 py-4 text-right text-gray-900">{formatCurrency(totals.spb)}</td>
                <td className="px-4 py-4 text-right bg-emerald-100 text-gray-900">{formatCurrency(totals.nett)}</td>
                <td className="px-4 py-4 text-right bg-blue-100 text-blue-700">{formatCurrency(totals.jpzis25)}</td>
                <td className="px-4 py-4 text-right bg-purple-100 text-purple-700">{formatCurrency(totals.jpzis75)}</td>
                <td className="px-4 py-4"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <h4 className="text-sm font-bold text-blue-900 mb-2">Rumus Perhitungan:</h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• <strong>Netto</strong> = Perolehan Bruto - Upah Kaleng - SPB</li>
          <li>• <strong>JPZIS 25%</strong> = 25% dari Netto (untuk operasional)</li>
          <li>• <strong>JPZIS 75%</strong> = 75% dari Netto (untuk program)</li>
        </ul>
      </div>
    </div>
  );
}