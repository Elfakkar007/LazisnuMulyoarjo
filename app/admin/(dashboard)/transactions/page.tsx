// =====================================================
// FIXED TRANSACTIONS MANAGEMENT PAGE
// File: app/admin/(dashboard)/transactions/page.tsx
// =====================================================

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Save, Trash2, GripVertical, Download } from 'lucide-react';
import { getFinancialYears, getProgramCategories, getFinancialTransactions } from '@/lib/api/client-admin';
import { bulkUpsertFinancialTransactions } from '@/lib/actions/admin';
import { formatCurrency, formatDate } from '@/lib/utils/helpers';
import { useToast } from '@/components/ui/toast-provider';
import { useConfirm } from '@/components/ui/confirmation-modal';

interface FinancialYear {
  id: string;
  year: number;
  is_active: boolean;
}

interface ProgramCategory {
  id: string;
  name: string;
  percentage: number;
  color_code: string;
}

interface TransactionRow {
  id: string;
  description: string;
  transaction_type: 'income' | 'expense';
  amount: number;
  transaction_date: string;
  balance?: number;
}

export default function TransactionsPage() {
  const [years, setYears] = useState<FinancialYear[]>([]);
  const [categories, setCategories] = useState<ProgramCategory[]>([]);
  const [selectedYearId, setSelectedYearId] = useState<string>('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [transactions, setTransactions] = useState<TransactionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast, success, error } = useToast();
  const { confirm } = useConfirm();

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedYearId && selectedCategoryId) {
      loadTransactions();
    }
  }, [selectedYearId, selectedCategoryId]);

  const loadInitialData = async () => {
    setLoading(true);
    const [yearsData, categoriesData] = await Promise.all([
      getFinancialYears(),
      getProgramCategories(),
    ]);

    setYears(yearsData);
    setCategories(categoriesData);

    if (yearsData.length > 0) {
      const activeYear = yearsData.find(y => y.is_active);
      setSelectedYearId(activeYear?.id || yearsData[0].id);
    }

    if (categoriesData.length > 0) {
      setSelectedCategoryId(categoriesData[0].id);
    }

    setLoading(false);
  };

  const loadTransactions = async () => {
    const data = await getFinancialTransactions(selectedYearId, selectedCategoryId);

    // Convert to editable format and calculate running balance
    let balance = 0;
    const rows: TransactionRow[] = data.map(item => {
      if (item.transaction_type === 'income') {
        balance += item.amount;
      } else {
        balance -= item.amount;
      }

      return {
        id: item.id || crypto.randomUUID(),
        description: item.description,
        transaction_type: item.transaction_type,
        amount: item.amount,
        transaction_date: item.transaction_date,
        balance: balance,
      };
    });

    setTransactions(rows);
  };

  const addRow = () => {
    const newRow: TransactionRow = {
      id: crypto.randomUUID(),
      description: '',
      transaction_type: 'expense',
      amount: 0,
      transaction_date: new Date().toISOString().split('T')[0],
    };
    setTransactions([...transactions, newRow]);
  };

  const addIncomeRow = () => {
    const category = categories.find(c => c.id === selectedCategoryId);

    const newRow: TransactionRow = {
      id: crypto.randomUUID(),
      description: `Total Dana ${category?.name} ${years.find(y => y.id === selectedYearId)?.year || ''}`,
      transaction_type: 'income',
      amount: 0,
      transaction_date: new Date().toISOString().split('T')[0],
    };
    setTransactions([newRow, ...transactions]);
  };

  const updateRow = (id: string, field: keyof TransactionRow, value: any) => {
    setTransactions(transactions.map(row =>
      row.id === id ? { ...row, [field]: value } : row
    ));
  };

  const deleteRow = async (id: string) => {
    const isConfirmed = await confirm({
      title: 'Hapus Transaksi',
      message: 'Apakah Anda yakin ingin menghapus transaksi ini?',
      confirmText: 'Hapus',
      variant: 'danger'
    });

    if (!isConfirmed) return;
    setTransactions(transactions.filter(row => row.id !== id));
  };

  const recalculateBalances = () => {
    let balance = 0;
    return transactions.map(row => {
      if (row.transaction_type === 'income') {
        balance += row.amount;
      } else {
        balance -= row.amount;
      }
      return { ...row, balance };
    });
  };

  const handleSave = async () => {
    if (saving) return;

    setSaving(true);

    try {
      // Prepare data for bulk upsert
      const items = transactions.map(row => ({
        year_id: selectedYearId,
        category_id: selectedCategoryId,
        transaction_type: row.transaction_type,
        description: row.description,
        amount: row.amount,
        transaction_date: row.transaction_date,
      }));

      const result = await bulkUpsertFinancialTransactions(items);

      if (result.success) {
        success('Data transaksi berhasil disimpan!');
        await loadTransactions();
      } else {
        error(`Gagal menyimpan: ${(result as any).message}`);
      }
    } catch (err: any) {
      console.error('Save error:', err);
      error('Terjadi kesalahan saat menyimpan');
    } finally {
      setSaving(false);
    }
  };

  const handleExportPDF = () => {
    toast('Fitur export PDF akan segera tersedia', 'info');
  };

  const calculatedTransactions = recalculateBalances();
  const totalIncome = calculatedTransactions
    .filter(t => t.transaction_type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = calculatedTransactions
    .filter(t => t.transaction_type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  const finalBalance = totalIncome - totalExpense;

  const selectedCategory = categories.find(c => c.id === selectedCategoryId);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rincian Pengeluaran</h1>
          <p className="text-gray-600 mt-1">Kelola transaksi dengan format Debet-Kredit-Saldo</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            <Download className="w-5 h-5" />
            Export PDF
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </div>

      {/* Selectors */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Pilih Tahun</label>
            <select
              value={selectedYearId}
              onChange={(e) => setSelectedYearId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            >
              {years.map(year => (
                <option key={year.id} value={year.id}>
                  {year.year} {year.is_active && '(Aktif)'}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Pilih Kategori</label>
            <select
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Summary */}
      {selectedCategory && (
        <div
          className="rounded-xl p-6 text-white"
          style={{ backgroundColor: selectedCategory.color_code }}
        >
          <h3 className="text-lg font-semibold mb-3">{selectedCategory.name}</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm opacity-90">Total Pemasukan (Debet)</p>
              <p className="text-2xl font-bold">{formatCurrency(totalIncome)}</p>
            </div>
            <div>
              <p className="text-sm opacity-90">Total Pengeluaran (Kredit)</p>
              <p className="text-2xl font-bold">{formatCurrency(totalExpense)}</p>
            </div>
            <div>
              <p className="text-sm opacity-90">Saldo Akhir</p>
              <p className="text-2xl font-bold">{formatCurrency(finalBalance)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Add Buttons */}
      <div className="flex gap-2">
        <button
          onClick={addIncomeRow}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Tambah Debet (Pemasukan)
        </button>
        <button
          onClick={addRow}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Tambah Kredit (Pengeluaran)
        </button>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-900 text-white">
                <th className="px-2 py-3 w-8"></th>
                <th className="px-4 py-3 text-left font-bold">Tanggal</th>
                <th className="px-4 py-3 text-left font-bold">Keterangan</th>
                <th className="px-4 py-3 text-right font-bold">Debet</th>
                <th className="px-4 py-3 text-right font-bold">Kredit</th>
                <th className="px-4 py-3 text-right font-bold bg-gray-800">Saldo</th>
                <th className="px-4 py-3 text-center font-bold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {calculatedTransactions.map((row, index) => (
                <tr key={row.id} className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <td className="px-2 py-3">
                    <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="date"
                      value={row.transaction_date}
                      onChange={(e) => updateRow(row.id, 'transaction_date', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-emerald-500"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={row.description}
                      onChange={(e) => updateRow(row.id, 'description', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-emerald-500"
                      placeholder="Keterangan transaksi..."
                    />
                  </td>
                  <td className="px-4 py-3 text-right">
                    {row.transaction_type === 'income' ? (
                      <input
                        type="number"
                        value={row.amount || ''}
                        onChange={(e) => updateRow(row.id, 'amount', e.target.value ? parseFloat(e.target.value) : 0)}
                        className="w-full px-2 py-1 border border-blue-300 bg-blue-50 rounded text-sm text-right font-semibold text-blue-700 focus:ring-2 focus:ring-blue-500"
                        min="0"
                        step="1000"
                      />
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {row.transaction_type === 'expense' ? (
                      <input
                        type="number"
                        value={row.amount || ''}
                        onChange={(e) => updateRow(row.id, 'amount', e.target.value ? parseFloat(e.target.value) : 0)}
                        className="w-full px-2 py-1 border border-red-300 bg-red-50 rounded text-sm text-right font-semibold text-red-700 focus:ring-2 focus:ring-red-500"
                        min="0"
                        step="1000"
                      />
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-gray-900 bg-gray-100">
                    {formatCurrency(row.balance || 0)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => deleteRow(row.id)}
                      className="p-1 bg-red-100 hover:bg-red-200 text-red-600 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}

              {/* Total Row */}
              <tr className="bg-gray-200 border-t-2 border-gray-900 font-bold">
                <td colSpan={3} className="px-4 py-4 text-gray-900">TOTAL</td>
                <td className="px-4 py-4 text-right text-blue-700">
                  {formatCurrency(totalIncome)}
                </td>
                <td className="px-4 py-4 text-right text-red-700">
                  {formatCurrency(totalExpense)}
                </td>
                <td className="px-4 py-4 text-right text-gray-900 bg-gray-300">
                  {formatCurrency(finalBalance)}
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>

        {calculatedTransactions.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-gray-500 mb-4">Belum ada transaksi</p>
            <p className="text-sm text-gray-400">Klik tombol di atas untuk menambah transaksi</p>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <h4 className="text-sm font-bold text-blue-900 mb-2">Petunjuk Format Pembukuan:</h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• <strong>Debet</strong>: Pemasukan dana (awal saldo dari alokasi kategori)</li>
          <li>• <strong>Kredit</strong>: Pengeluaran untuk program atau operasional</li>
          <li>• <strong>Saldo</strong>: Dihitung otomatis (Saldo sebelumnya + Debet - Kredit)</li>
          <li>• Baris pertama biasanya "Total Dana [Kategori] [Tahun]" sebagai Debet</li>
          <li>• Urutkan transaksi berdasarkan tanggal untuk akurasi saldo</li>
        </ul>
      </div>
    </div>
  );
}