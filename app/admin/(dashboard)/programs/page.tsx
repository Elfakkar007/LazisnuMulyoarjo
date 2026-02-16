// =====================================================
// PROGRAMS MANAGEMENT PAGE
// File: app/admin/(dashboard)/programs/page.tsx
// =====================================================

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Upload, Download, Check, X, Filter } from 'lucide-react';
import { getFinancialYears, getPrograms, getProgramCategories } from '@/lib/api/client-admin';
import { createProgram, updateProgram, deleteProgram, bulkCreatePrograms } from '@/lib/actions/admin';
import { formatCurrency, calculateProgramProgress } from '@/lib/utils/helpers';

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

interface Program {
  id?: string;
  year_id: string;
  category_id: string;
  name: string;
  description: string;
  target_audience: string;
  quantity: string;
  budget: number;
  realization: number;
  is_completed: boolean;
}

export default function ProgramsPage() {
  const [years, setYears] = useState<FinancialYear[]>([]);
  const [categories, setCategories] = useState<ProgramCategory[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [selectedYearId, setSelectedYearId] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'incomplete'>('all');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Program>({
    year_id: '',
    category_id: '',
    name: '',
    description: '',
    target_audience: '',
    quantity: '',
    budget: 0,
    realization: 0,
    is_completed: false,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedYearId) {
      loadPrograms();
    }
  }, [selectedYearId]);

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
      setFormData(prev => ({ ...prev, year_id: activeYear?.id || yearsData[0].id }));
    }
    
    setLoading(false);
  };

  const loadPrograms = async () => {
    const data = await getPrograms(selectedYearId);
    setPrograms(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    // Validation
    if (!formData.name.trim()) {
      alert('Nama program harus diisi');
      return;
    }

    if (!formData.category_id) {
      alert('Kategori harus dipilih');
      return;
    }

    if (formData.budget < 0) {
      alert('Anggaran tidak valid');
      return;
    }

    setSubmitting(true);
    
    let result;
    if (editingId) {
      result = await updateProgram(editingId, formData);
    } else {
      result = await createProgram({
        ...formData,
        year_id: selectedYearId,
      });
    }

    if (result.success) {
      await loadPrograms();
      resetForm();
    } else {
      alert(`Gagal menyimpan: ${result.error}`);
    }
    
    setSubmitting(false);
  };

  const handleEdit = (program: any) => {
    setEditingId(program.id);
    setFormData({
      year_id: program.year_id,
      category_id: program.category_id,
      name: program.name,
      description: program.description || '',
      target_audience: program.target_audience || '',
      quantity: program.quantity || '',
      budget: program.budget,
      realization: program.realization,
      is_completed: program.is_completed,
    });
    setShowForm(true);
  };

  const handleDelete = async (program: any) => {
    if (!confirm(`Hapus program "${program.name}"?`)) {
      return;
    }

    setSubmitting(true);
    const result = await deleteProgram(program.id);

    if (result.success) {
      await loadPrograms();
    } else {
      alert(`Gagal menghapus: ${result.error}`);
    }
    setSubmitting(false);
  };

  const resetForm = () => {
    setFormData({
      year_id: selectedYearId,
      category_id: categories[0]?.id || '',
      name: '',
      description: '',
      target_audience: '',
      quantity: '',
      budget: 0,
      realization: 0,
      is_completed: false,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleExportTemplate = () => {
    let csv = 'Kategori,Nama Program,Deskripsi,Target Sasaran,Kuantitas,Anggaran,Realisasi,Status\n';
    
    const filteredPrograms = programs.filter(p => {
      if (filterCategory !== 'all' && p.category_id !== filterCategory) return false;
      if (filterStatus === 'completed' && !p.is_completed) return false;
      if (filterStatus === 'incomplete' && p.is_completed) return false;
      return true;
    });

    filteredPrograms.forEach(program => {
      const category = categories.find(c => c.id === program.category_id);
      csv += `${category?.name || ''},${program.name},"${program.description || ''}",${program.target_audience || ''},${program.quantity || ''},${program.budget},${program.realization},${program.is_completed ? 'Selesai' : 'Proses'}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `programs-${selectedYearId}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredPrograms = programs.filter(p => {
    if (filterCategory !== 'all' && p.category_id !== filterCategory) return false;
    if (filterStatus === 'completed' && !p.is_completed) return false;
    if (filterStatus === 'incomplete' && p.is_completed) return false;
    return true;
  });

  const categoryStats = categories.map(cat => {
    const catPrograms = programs.filter(p => p.category_id === cat.id);
    return {
      ...cat,
      totalPrograms: catPrograms.length,
      totalBudget: catPrograms.reduce((sum, p) => sum + p.budget, 0),
      totalRealization: catPrograms.reduce((sum, p) => sum + p.realization, 0),
      completedCount: catPrograms.filter(p => p.is_completed).length,
    };
  });

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
          <h1 className="text-3xl font-bold text-gray-900">Program Kerja</h1>
          <p className="text-gray-600 mt-1">Kelola program dan realisasi anggaran</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
        >
          <Plus className="w-5 h-5" />
          Tambah Program
        </button>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
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

          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Filter Kategori</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">Semua Kategori</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Filter Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">Semua Status</option>
              <option value="completed">Terlaksana</option>
              <option value="incomplete">Belum Terlaksana</option>
            </select>
          </div>

          <button
            onClick={handleExportTemplate}
            className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            <Download className="w-5 h-5" />
            Export
          </button>
        </div>
      </div>

      {/* Category Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {categoryStats.map(cat => (
          <div 
            key={cat.id}
            className="bg-white rounded-xl shadow-md p-4 border-2"
            style={{ borderColor: cat.color_code }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: cat.color_code }}
              />
              <h4 className="font-bold text-gray-900 text-sm">{cat.name}</h4>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600">Program:</span>
                <span className="font-semibold">{cat.totalPrograms}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Anggaran:</span>
                <span className="font-semibold">{formatCurrency(cat.totalBudget)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Realisasi:</span>
                <span className="font-semibold text-emerald-600">{formatCurrency(cat.totalRealization)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Selesai:</span>
                <span className="font-semibold">{cat.completedCount}/{cat.totalPrograms}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-md p-6 border-2 border-emerald-200"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            {editingId ? 'Edit Program' : 'Tambah Program Baru'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Kategori *
                </label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  required
                >
                  <option value="">Pilih Kategori</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nama Program *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Deskripsi</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Target Sasaran</label>
                <input
                  type="text"
                  value={formData.target_audience}
                  onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  placeholder="Contoh: Dhuafa (4 Dusun)"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Kuantitas</label>
                <input
                  type="text"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  placeholder="Contoh: ± 80 orang atau Kondisional"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Anggaran *</label>
                <input
                  type="number"
                  value={formData.budget || ''}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value ? parseFloat(e.target.value) : 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  min="0"
                  step="1000"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Realisasi</label>
                <input
                  type="number"
                  value={formData.realization || ''}
                  onChange={(e) => setFormData({ ...formData, realization: e.target.value ? parseFloat(e.target.value) : 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  min="0"
                  step="1000"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={formData.is_completed}
                    onChange={(e) => setFormData({ ...formData, is_completed: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Terlaksana</span>
                </label>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                {submitting ? 'Menyimpan...' : editingId ? 'Update' : 'Simpan'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                Batal
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Programs Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-emerald-600 text-white">
                <th className="px-4 py-3 text-left font-bold">Nama Program</th>
                <th className="px-4 py-3 text-left font-bold">Kategori</th>
                <th className="px-4 py-3 text-left font-bold">Target</th>
                <th className="px-4 py-3 text-right font-bold">Anggaran</th>
                <th className="px-4 py-3 text-right font-bold">Realisasi</th>
                <th className="px-4 py-3 text-center font-bold">Progress</th>
                <th className="px-4 py-3 text-center font-bold">Status</th>
                <th className="px-4 py-3 text-center font-bold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredPrograms.map(program => {
                const category = categories.find(c => c.id === program.category_id);
                const progress = calculateProgramProgress(program.realization, program.budget);
                
                return (
                  <tr key={program.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-semibold text-gray-900">{program.name}</p>
                        {program.description && (
                          <p className="text-xs text-gray-600 mt-1">{program.description}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category?.color_code }}
                        />
                        <span className="text-xs">{category?.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      <div className="text-xs">
                        <div>{program.target_audience || '-'}</div>
                        <div className="text-gray-500">{program.quantity || '-'}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900">
                      {formatCurrency(program.budget)}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-emerald-600">
                      {formatCurrency(program.realization)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-xs font-bold">{progress}%</span>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {program.is_completed ? (
                        <div className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs">
                          <Check className="w-3 h-3" />
                          Selesai
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs">
                          <X className="w-3 h-3" />
                          Proses
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleEdit(program)}
                          className="p-1 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(program)}
                          className="p-1 bg-red-100 hover:bg-red-200 text-red-600 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredPrograms.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            Tidak ada program yang sesuai filter
          </div>
        )}
      </div>
    </div>
  );
}