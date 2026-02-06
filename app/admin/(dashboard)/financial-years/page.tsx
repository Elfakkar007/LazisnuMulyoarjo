// =====================================================
// FINANCIAL YEARS MANAGEMENT PAGE
// File: app/admin/(dashboard)/financial-years/page.tsx
// =====================================================

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Check, X, TrendingUp, Calendar } from 'lucide-react';
import { getFinancialYears } from '@/lib/api/client-admin';
import { 
  createFinancialYear, 
  updateFinancialYear, 
  deleteFinancialYear 
} from '@/lib/actions/admin';
import { formatCurrency } from '@/lib/utils/helpers';

interface FinancialYear {
  id: string;
  year: number;
  is_active: boolean;
  total_income: number;
  total_expense: number;
  created_at: string;
}

export default function FinancialYearsPage() {
  const [years, setYears] = useState<FinancialYear[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingYear, setEditingYear] = useState<FinancialYear | null>(null);
  const [newYear, setNewYear] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadYears();
  }, []);

  const loadYears = async () => {
    setLoading(true);
    const data = await getFinancialYears();
    setYears(data);
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!newYear || submitting) return;
    
    const yearNum = parseInt(newYear);
    if (isNaN(yearNum) || yearNum < 2020 || yearNum > 2100) {
      alert('Tahun tidak valid');
      return;
    }

    setSubmitting(true);
    const result = await createFinancialYear({
      year: yearNum,
      is_active: years.length === 0,
      total_income: 0,
      total_expense: 0,
    });

    if (result.success) {
      await loadYears();
      setNewYear('');
      setShowForm(false);
    } else {
      alert(`Gagal membuat tahun: ${result.error}`);
    }
    setSubmitting(false);
  };

  const handleToggleActive = async (year: FinancialYear) => {
    if (submitting) return;
    
    setSubmitting(true);
    const result = await updateFinancialYear(year.id, {
      is_active: !year.is_active,
    });

    if (result.success) {
      await loadYears();
    } else {
      alert(`Gagal update: ${result.error}`);
    }
    setSubmitting(false);
  };

  const handleDelete = async (year: FinancialYear) => {
    if (!confirm(`Hapus tahun ${year.year}? Data terkait akan ikut terhapus.`)) {
      return;
    }

    setSubmitting(true);
    const result = await deleteFinancialYear(year.id);

    if (result.success) {
      await loadYears();
    } else {
      alert(`Gagal menghapus: ${result.error}`);
    }
    setSubmitting(false);
  };

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
          <h1 className="text-3xl font-bold text-gray-900">Tahun Keuangan</h1>
          <p className="text-gray-600 mt-1">Kelola periode tahun keuangan</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
        >
          <Plus className="w-5 h-5" />
          Tambah Tahun
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-md p-6 border-2 border-emerald-200"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4">Tambah Tahun Keuangan Baru</h3>
          <div className="flex gap-4">
            <input
              type="number"
              value={newYear}
              onChange={(e) => setNewYear(e.target.value)}
              placeholder="Contoh: 2025"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              min="2020"
              max="2100"
            />
            <button
              onClick={handleCreate}
              disabled={submitting || !newYear}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              {submitting ? 'Menyimpan...' : 'Simpan'}
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                setNewYear('');
              }}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              Batal
            </button>
          </div>
        </motion.div>
      )}

      {/* Years List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {years.map((year) => (
          <motion.div
            key={year.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`bg-white rounded-xl shadow-md p-6 border-2 transition-all ${
              year.is_active 
                ? 'border-emerald-500 shadow-emerald-100' 
                : 'border-gray-200'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  year.is_active ? 'bg-emerald-100' : 'bg-gray-100'
                }`}>
                  <Calendar className={`w-6 h-6 ${
                    year.is_active ? 'text-emerald-600' : 'text-gray-600'
                  }`} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{year.year}</h3>
                  {year.is_active && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full mt-1">
                      <Check className="w-3 h-3" />
                      Aktif
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleToggleActive(year)}
                disabled={submitting}
                className={`p-2 rounded-lg transition-colors ${
                  year.is_active
                    ? 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title={year.is_active ? 'Non-aktifkan' : 'Aktifkan'}
              >
                {year.is_active ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
              </button>
            </div>

            <div className="space-y-3 mb-4">
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg p-3">
                <p className="text-xs text-gray-600 mb-1">Total Pemasukan</p>
                <p className="text-lg font-bold text-emerald-700">
                  {formatCurrency(year.total_income)}
                </p>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-lg p-3">
                <p className="text-xs text-gray-600 mb-1">Total Pengeluaran</p>
                <p className="text-lg font-bold text-red-700">
                  {formatCurrency(year.total_expense)}
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3">
                <p className="text-xs text-gray-600 mb-1">Saldo</p>
                <p className="text-lg font-bold text-blue-700">
                  {formatCurrency(year.total_income - year.total_expense)}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleDelete(year)}
                disabled={submitting || year.is_active}
                className="flex-1 flex items-center justify-center gap-2 bg-red-100 hover:bg-red-200 disabled:bg-gray-100 disabled:text-gray-400 text-red-600 px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Hapus
              </button>
            </div>

            {year.is_active && (
              <p className="text-xs text-gray-500 text-center mt-3">
                Tahun aktif tidak bisa dihapus
              </p>
            )}
          </motion.div>
        ))}
      </div>

      {years.length === 0 && (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Belum Ada Tahun Keuangan
          </h3>
          <p className="text-gray-600 mb-4">
            Mulai dengan menambahkan tahun keuangan pertama
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            <Plus className="w-5 h-5" />
            Tambah Tahun
          </button>
        </div>
      )}
    </div>
  );
}