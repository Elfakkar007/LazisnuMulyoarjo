// =====================================================
// PROGRAM CATEGORIES MANAGEMENT PAGE
// File: app/admin/(dashboard)/program-categories/page.tsx
// =====================================================

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Save, X, GripVertical } from 'lucide-react';
import { getProgramCategories } from '@/lib/api/client-admin';
import {
  createProgramCategory,
  updateProgramCategory,
  deleteProgramCategory
} from '@/lib/actions/admin';
import { useToast } from '@/components/ui/toast-provider';
import { useConfirm } from '@/components/ui/confirmation-modal';

interface ProgramCategory {
  id: string;
  name: string;
  percentage: number;
  color_code: string;
  created_at: string;
}

const DEFAULT_COLORS = [
  '#10b981', // emerald
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#f59e0b', // amber
  '#ef4444', // red
  '#06b6d4', // cyan
  '#ec4899', // pink
  '#14b8a6', // teal
];

export default function ProgramCategoriesPage() {
  const [categories, setCategories] = useState<ProgramCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    percentage: 0,
    color_code: DEFAULT_COLORS[0],
  });
  const [submitting, setSubmitting] = useState(false);
  const { toast, success, error } = useToast();
  const { confirm } = useConfirm();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    const data = await getProgramCategories();
    setCategories(data);
    setLoading(false);
  };

  const totalPercentage = categories.reduce((sum, cat) =>
    cat.id !== editingId ? sum + cat.percentage : sum, 0
  ) + (editingId ? formData.percentage : 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    // Validation
    if (!formData.name.trim()) {
      error('Nama kategori harus diisi');
      return;
    }

    if (formData.percentage < 0 || formData.percentage > 100) {
      error('Persentase harus antara 0-100');
      return;
    }

    const newTotal = editingId
      ? totalPercentage
      : totalPercentage + formData.percentage;

    if (newTotal > 100) {
      error(`Total persentase akan melebihi 100% (${newTotal}%). Sesuaikan persentase.`);
      return;
    }

    setSubmitting(true);

    let result;
    if (editingId) {
      result = await updateProgramCategory(editingId, formData);
    } else {
      result = await createProgramCategory(formData);
    }

    if (result.success) {
      await loadCategories();
      resetForm();
      success(editingId ? 'Kategori berhasil diupdate' : 'Kategori berhasil dibuat');
    } else {
      error(`Gagal menyimpan: ${(result as any).message}`);
    }

    setSubmitting(false);
  };

  const handleEdit = (category: ProgramCategory) => {
    setEditingId(category.id);
    setFormData({
      name: category.name,
      percentage: category.percentage,
      color_code: category.color_code,
    });
    setShowForm(true);
  };

  const handleDelete = async (category: ProgramCategory) => {
    const isConfirmed = await confirm({
      title: 'Hapus Kategori',
      message: `Apakah Anda yakin ingin menghapus kategori "${category.name}"? Program terkait akan ikut terhapus.`,
      confirmText: 'Hapus',
      variant: 'danger'
    });

    if (!isConfirmed) return;

    setSubmitting(true);
    const result = await deleteProgramCategory(category.id);

    if (result.success) {
      await loadCategories();
      success('Kategori berhasil dihapus');
    } else {
      error(`Gagal menghapus: ${(result as any).message}`);
    }
    setSubmitting(false);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      percentage: 0,
      color_code: DEFAULT_COLORS[0],
    });
    setEditingId(null);
    setShowForm(false);
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
          <h1 className="text-3xl font-bold text-gray-900">Kategori Program</h1>
          <p className="text-gray-600 mt-1">Kelola kategori dan alokasi persentase</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          disabled={totalPercentage >= 100 && !showForm}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-semibold transition-colors"
        >
          <Plus className="w-5 h-5" />
          Tambah Kategori
        </button>
      </div>

      {/* Total Percentage Warning */}
      <div className={`p-4 rounded-lg border-2 ${totalPercentage === 100
        ? 'bg-green-50 border-green-500'
        : totalPercentage > 100
          ? 'bg-red-50 border-red-500'
          : 'bg-yellow-50 border-yellow-500'
        }`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-gray-900">Total Alokasi Persentase</p>
            <p className="text-sm text-gray-600">
              {totalPercentage === 100
                ? '✓ Total sudah 100%'
                : totalPercentage > 100
                  ? '⚠️ Total melebihi 100%!'
                  : `Masih tersisa ${100 - totalPercentage}%`
              }
            </p>
          </div>
          <div className="text-4xl font-extrabold">
            <span className={
              totalPercentage === 100
                ? 'text-green-600'
                : totalPercentage > 100
                  ? 'text-red-600'
                  : 'text-yellow-600'
            }>
              {totalPercentage}%
            </span>
          </div>
        </div>
        <div className="mt-3 h-4 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${totalPercentage === 100
              ? 'bg-green-500'
              : totalPercentage > 100
                ? 'bg-red-500'
                : 'bg-yellow-500'
              }`}
            style={{ width: `${Math.min(totalPercentage, 100)}%` }}
          />
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-md p-6 border-2 border-emerald-200"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            {editingId ? 'Edit Kategori' : 'Tambah Kategori Baru'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nama Kategori *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Contoh: NU Care Sosial"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Persentase Alokasi * (0-100)
                </label>
                <input
                  type="number"
                  value={formData.percentage}
                  onChange={(e) => setFormData({ ...formData, percentage: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  min="0"
                  max="100"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Warna
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.color_code}
                    onChange={(e) => setFormData({ ...formData, color_code: e.target.value })}
                    className="w-16 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.color_code}
                    onChange={(e) => setFormData({ ...formData, color_code: e.target.value })}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="#10b981"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2">
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

      {/* Categories List */}
      <div className="space-y-4">
        {categories.map((category) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-md p-6 border-2 hover:shadow-lg transition-all"
            style={{ borderColor: category.color_code }}
          >
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-lg flex items-center justify-center text-white font-bold text-xl"
                style={{ backgroundColor: category.color_code }}
              >
                {category.percentage}%
              </div>

              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900">{category.name}</h3>
                <div className="flex items-center gap-3 mt-2">
                  <div className="h-3 flex-1 bg-gray-200 rounded-full overflow-hidden max-w-xs">
                    <div
                      className="h-full transition-all"
                      style={{
                        width: `${category.percentage}%`,
                        backgroundColor: category.color_code
                      }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-600">
                    {category.percentage}% dari total
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(category)}
                  disabled={submitting}
                  className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(category)}
                  disabled={submitting}
                  className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors"
                  title="Hapus"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Belum Ada Kategori Program
          </h3>
          <p className="text-gray-600 mb-4">
            Mulai dengan menambahkan kategori program pertama
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            <Plus className="w-5 h-5" />
            Tambah Kategori
          </button>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <h4 className="text-sm font-bold text-blue-900 mb-2">Catatan:</h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Total persentase semua kategori harus = 100%</li>
          <li>• Persentase akan digunakan untuk menghitung alokasi dana dari JPZIS 75%</li>
          <li>• Warna akan digunakan untuk visualisasi chart dan tabel</li>
          <li>• Menghapus kategori akan menghapus semua program terkait</li>
        </ul>
      </div>
    </div>
  );
}