// =====================================================
// KALENG DISTRIBUTION MANAGEMENT PAGE
// File: app/admin/(dashboard)/kaleng-distribution/page.tsx
// =====================================================

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Upload, Download, Save, Plus } from 'lucide-react';
import { getFinancialYears, getKalengDistribution } from '@/lib/api/public';
import { bulkUpsertKalengDistribution } from '@/lib/actions/admin';
import { formatNumber, getMonthName, DUSUN_LIST } from '@/lib/utils/helpers';

interface FinancialYear {
  id: string;
  year: number;
  is_active: boolean;
}

interface KalengData {
  month: number;
  dusun: string;
  total_distributed: number;
  total_collected: number;
  total_not_collected: number;
}

const MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export default function KalengDistributionPage() {
  const [years, setYears] = useState<FinancialYear[]>([]);
  const [selectedYearId, setSelectedYearId] = useState<string>('');
  const [kalengData, setKalengData] = useState<Record<string, KalengData>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadYears();
  }, []);

  useEffect(() => {
    if (selectedYearId) {
      loadKalengData();
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

  const loadKalengData = async () => {
    setLoading(true);
    const data = await getKalengDistribution(selectedYearId);
    
    // Convert array to keyed object for easier editing
    const dataMap: Record<string, KalengData> = {};
    data.forEach(item => {
      const key = `${item.month}-${item.dusun}`;
      dataMap[key] = {
        month: item.month,
        dusun: item.dusun,
        total_distributed: item.total_distributed,
        total_collected: item.total_collected,
        total_not_collected: item.total_not_collected,
      };
    });
    
    setKalengData(dataMap);
    setLoading(false);
  };

  const getKey = (month: number, dusun: string) => `${month}-${dusun}`;

  const getValue = (month: number, dusun: string, field: keyof KalengData) => {
    const key = getKey(month, dusun);
    return kalengData[key]?.[field] || 0;
  };

  const setValue = (month: number, dusun: string, field: keyof KalengData, value: number) => {
    const key = getKey(month, dusun);
    const existing = kalengData[key] || {
      month,
      dusun,
      total_distributed: 0,
      total_collected: 0,
      total_not_collected: 0,
    };

    setKalengData({
      ...kalengData,
      [key]: {
        ...existing,
        [field]: value,
      },
    });
  };

  const handleSave = async () => {
    if (!selectedYearId || saving) return;

    setSaving(true);
    const items = Object.values(kalengData).map(item => ({
      year_id: selectedYearId,
      month: item.month,
      dusun: item.dusun,
      total_distributed: item.total_distributed,
      total_collected: item.total_collected,
      total_not_collected: item.total_not_collected,
    }));

    const result = await bulkUpsertKalengDistribution(items);

    if (result.success) {
      alert('Data berhasil disimpan!');
      await loadKalengData();
    } else {
      alert(`Gagal menyimpan: ${result.error}`);
    }
    setSaving(false);
  };

  const handleExportTemplate = () => {
    // Create CSV template
    let csv = 'Bulan,Dusun,Terdistribusi,Terkumpul,BelumTerkumpul\n';
    
    MONTHS.forEach(month => {
      DUSUN_LIST.forEach(dusun => {
        const distributed = getValue(month, dusun, 'total_distributed');
        const collected = getValue(month, dusun, 'total_collected');
        const notCollected = getValue(month, dusun, 'total_not_collected');
        csv += `${month},${dusun},${distributed},${collected},${notCollected}\n`;
      });
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kaleng-distribution-${selectedYearId}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').slice(1); // Skip header
      
      const newData: Record<string, KalengData> = {};
      
      lines.forEach(line => {
        const [month, dusun, distributed, collected, notCollected] = line.split(',');
        if (month && dusun) {
          const key = getKey(parseInt(month), dusun.trim());
          newData[key] = {
            month: parseInt(month),
            dusun: dusun.trim(),
            total_distributed: parseInt(distributed) || 0,
            total_collected: parseInt(collected) || 0,
            total_not_collected: parseInt(notCollected) || 0,
          };
        }
      });
      
      setKalengData(newData);
      alert('Data berhasil diimport! Jangan lupa klik Simpan.');
    };
    
    reader.readAsText(file);
    event.target.value = ''; // Reset input
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
        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          Belum Ada Tahun Keuangan
        </h3>
        <p className="text-gray-600">
          Silakan buat tahun keuangan terlebih dahulu
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Distribusi Kaleng</h1>
          <p className="text-gray-600 mt-1">Kelola data distribusi kaleng per bulan dan dusun</p>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-wrap gap-4 items-end">
          {/* Year Selector */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Pilih Tahun
            </label>
            <select
              value={selectedYearId}
              onChange={(e) => setSelectedYearId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              {years.map(year => (
                <option key={year.id} value={year.id}>
                  {year.year} {year.is_active && '(Aktif)'}
                </option>
              ))}
            </select>
          </div>

          {/* Import Button */}
          <div>
            <label className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors cursor-pointer">
              <Upload className="w-5 h-5" />
              Import CSV
              <input
                type="file"
                accept=".csv"
                onChange={handleImportCSV}
                className="hidden"
              />
            </label>
          </div>

          {/* Export Button */}
          <button
            onClick={handleExportTemplate}
            className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            <Download className="w-5 h-5" />
            Export Template
          </button>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Menyimpan...' : 'Simpan Semua'}
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-emerald-600 text-white">
                <th className="px-4 py-3 text-left font-bold sticky left-0 bg-emerald-600 z-10">
                  Bulan
                </th>
                {DUSUN_LIST.map(dusun => (
                  <th
                    key={dusun}
                    className="px-4 py-3 text-center font-bold border-l border-emerald-700"
                    colSpan={3}
                  >
                    {dusun}
                  </th>
                ))}
              </tr>
              <tr className="bg-emerald-500 text-white text-xs">
                <th className="px-4 py-2 sticky left-0 bg-emerald-500 z-10"></th>
                {DUSUN_LIST.map(dusun => (
                  <React.Fragment key={dusun}>
                    <th className="px-2 py-2 border-l border-emerald-600">Distribusi</th>
                    <th className="px-2 py-2">Terkumpul</th>
                    <th className="px-2 py-2">Belum</th>
                  </React.Fragment>
                ))}
              </tr>
            </thead>
            <tbody>
              {MONTHS.map(month => (
                <tr key={month} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold text-gray-900 sticky left-0 bg-white z-10">
                    {getMonthName(month)}
                  </td>
                  {DUSUN_LIST.map(dusun => (
                    <React.Fragment key={dusun}>
                      <td className="px-2 py-2 border-l border-gray-200">
                        <input
                          type="number"
                          value={getValue(month, dusun, 'total_distributed')}
                          onChange={(e) => setValue(month, dusun, 'total_distributed', parseInt(e.target.value) || 0)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-center focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          min="0"
                        />
                      </td>
                      <td className="px-2 py-2">
                        <input
                          type="number"
                          value={getValue(month, dusun, 'total_collected')}
                          onChange={(e) => setValue(month, dusun, 'total_collected', parseInt(e.target.value) || 0)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          min="0"
                        />
                      </td>
                      <td className="px-2 py-2">
                        <input
                          type="number"
                          value={getValue(month, dusun, 'total_not_collected')}
                          onChange={(e) => setValue(month, dusun, 'total_not_collected', parseInt(e.target.value) || 0)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-center focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          min="0"
                        />
                      </td>
                    </React.Fragment>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <h4 className="text-sm font-bold text-blue-900 mb-2">Petunjuk:</h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Masukkan jumlah kaleng untuk setiap bulan dan dusun</li>
          <li>• Klik "Simpan Semua" untuk menyimpan perubahan</li>
          <li>• Gunakan "Export Template" untuk download data saat ini</li>
          <li>• Gunakan "Import CSV" untuk upload data dari Excel/CSV</li>
        </ul>
      </div>
    </div>
  );
}