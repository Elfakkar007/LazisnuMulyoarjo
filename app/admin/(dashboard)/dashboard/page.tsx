// app/admin/(dashboard)/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  FileText,
  Package,
  Plus,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import {
  getDashboardStats,
  getRecentTransactions,
  getRecentDraftArticles,
  getMonthlyIncomeChart,
  getExpenseDistribution,
} from '@/lib/api/client-admin';
import Link from 'next/link';

interface ExpenseDistributionItem {
  name: string;
  value: number;
}

import type { PieLabelRenderProps } from 'recharts';

const renderPieLabel = ({ name, percent }: PieLabelRenderProps) => {
  const safePercent = typeof percent === 'number' ? percent : 0;
  return `${name}: ${(safePercent * 100).toFixed(0)}%`;
};

// Colors for pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

// Format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

// Format number with separator
const formatNumber = (num: number) => {
  return new Intl.NumberFormat('id-ID').format(num);
};

// Format date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    totalArticles: 0,
    totalDistribution: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [recentDrafts, setRecentDrafts] = useState<any[]>([]);
  const [incomeChart, setIncomeChart] = useState<any[]>([]);
  const [expenseDistribution, setExpenseDistribution] = useState<ExpenseDistributionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const [statsData, transactions, drafts, chartData, expenseData] = await Promise.all([
          getDashboardStats(),
          getRecentTransactions(5),
          getRecentDraftArticles(3),
          getMonthlyIncomeChart(6),
          getExpenseDistribution(),
        ]);

        setStats(statsData);
        setRecentTransactions(transactions);
        setRecentDrafts(drafts);
        setIncomeChart(chartData);
        setExpenseDistribution(expenseData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard Admin</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">Ringkasan data dan aktivitas terkini</p>
      </div>

      {/* Quick Stats Cards - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {/* Total Pemasukan */}
        <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Total Pemasukan</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 break-words">
                  {formatCurrency(stats.totalIncome)}
                </p>
                <p className="text-xs text-gray-400 mt-1">Bulan ini</p>
              </div>
              <div className="ml-3 p-2 sm:p-2.5 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex-shrink-0">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Pengeluaran */}
        <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Total Pengeluaran</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 break-words">
                  {formatCurrency(stats.totalExpense)}
                </p>
                <p className="text-xs text-gray-400 mt-1">Bulan ini</p>
              </div>
              <div className="ml-3 p-2 sm:p-2.5 bg-gradient-to-br from-red-400 to-red-600 rounded-lg flex-shrink-0">
                <TrendingDown className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sisa Saldo */}
        <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Sisa Saldo</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 break-words">
                  {formatCurrency(stats.balance)}
                </p>
                <p className="text-xs text-gray-400 mt-1">-</p>
              </div>
              <div className="ml-3 p-2 sm:p-2.5 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex-shrink-0">
                <Wallet className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Artikel */}
        <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Artikel Published</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                  {formatNumber(stats.totalArticles)}
                </p>
                <p className="text-xs text-gray-400 mt-1">Total artikel</p>
              </div>
              <div className="ml-3 p-2 sm:p-2.5 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex-shrink-0">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Kaleng */}
        <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Kaleng Bulan Ini</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                  {formatNumber(stats.totalDistribution)}
                </p>
                <p className="text-xs text-gray-400 mt-1">Unit kaleng</p>
              </div>
              <div className="ml-3 p-2 sm:p-2.5 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex-shrink-0">
                <Package className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section - Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Income Trend Chart */}
        <Card className="bg-white shadow-sm border border-gray-100">
          <CardHeader className="border-b border-gray-100 pb-4">
            <CardTitle className="text-base sm:text-lg font-semibold text-gray-900">
              Perolehan 6 Bulan Terakhir
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="w-full h-[250px] sm:h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={incomeChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12 }}
                    stroke="#9ca3af"
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    stroke="#9ca3af"
                  />
                  <Tooltip
                    formatter={(value: number | undefined) => formatCurrency(value ?? 0)}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ fill: '#10b981', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Expense Distribution Chart */}
        <Card className="bg-white shadow-sm border border-gray-100">
          <CardHeader className="border-b border-gray-100 pb-4">
            <CardTitle className="text-base sm:text-lg font-semibold text-gray-900">
              Distribusi Pengeluaran
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="w-full h-[250px] sm:h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderPieLabel}
                    outerRadius="70%"
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {expenseDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any) => formatCurrency(value)}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities Section - Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Transactions */}
        <Card className="bg-white shadow-sm border border-gray-100">
          <CardHeader className="border-b border-gray-100 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base sm:text-lg font-semibold text-gray-900">
                Transaksi Terakhir
              </CardTitle>
              <Link href="/admin/transactions">
                <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50">
                  Lihat Semua
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-3">
              {recentTransactions.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="h-6 w-6 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500">Belum ada transaksi</p>
                </div>
              ) : (
                recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-start justify-between py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 px-2 rounded-lg transition-colors"
                  >
                    <div className="flex-1 min-w-0 mr-4">
                      <p className="font-medium text-sm text-gray-900 truncate">
                        {transaction.description}
                      </p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                          {transaction.category?.name}
                        </span>
                        <span className="text-xs text-gray-400">
                          {formatDate(transaction.transaction_date)}
                        </span>
                      </div>
                    </div>
                    <div className={`font-semibold text-sm whitespace-nowrap flex-shrink-0 ${transaction.transaction_type === 'income' ? 'text-emerald-600' : 'text-red-600'
                      }`}>
                      {transaction.transaction_type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="mt-6">
              <Link href="/admin/transactions">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Transaksi
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Draft Articles */}
        <Card className="bg-white shadow-sm border border-gray-100">
          <CardHeader className="border-b border-gray-100 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base sm:text-lg font-semibold text-gray-900">
                Artikel Draft
              </CardTitle>
              <Link href="/admin/articles">
                <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50">
                  Lihat Semua
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-3">
              {recentDrafts.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FileText className="h-6 w-6 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500">Belum ada artikel draft</p>
                </div>
              ) : (
                recentDrafts.map((article) => (
                  <div
                    key={article.id}
                    className="py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 px-2 rounded-lg transition-colors"
                  >
                    <Link href={`/admin/articles/${article.id}/edit`}>
                      <h3 className="font-medium text-sm text-gray-900 hover:text-emerald-600 transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                        {article.category}
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatDate(article.created_at)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="mt-6">
              <Link href="/admin/articles/new">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Buat Artikel
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}