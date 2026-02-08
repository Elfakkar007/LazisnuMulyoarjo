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
  ArrowRight
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
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
        <p className="text-gray-600 mt-1">Ringkasan data dan aktivitas terkini</p>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Pemasukan */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Total Pemasukan</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {formatCurrency(stats.totalIncome)}
                </p>
              </div>
              <div className="ml-4 p-3 bg-emerald-50 rounded-lg">
                <TrendingUp className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Pengeluaran */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Total Pengeluaran</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {formatCurrency(stats.totalExpense)}
                </p>
              </div>
              <div className="ml-4 p-3 bg-red-50 rounded-lg">
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sisa Saldo */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Sisa Saldo</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {formatCurrency(stats.balance)}
                </p>
              </div>
              <div className="ml-4 p-3 bg-blue-50 rounded-lg">
                <Wallet className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Artikel */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Artikel Published</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {stats.totalArticles}
                </p>
              </div>
              <div className="ml-4 p-3 bg-purple-50 rounded-lg">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Kaleng */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Kaleng Bulan Ini</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {stats.totalDistribution}
                </p>
              </div>
              <div className="ml-4 p-3 bg-orange-50 rounded-lg">
                <Package className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Perolehan 6 Bulan Terakhir</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={incomeChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value: number | undefined) => formatCurrency(value ?? 0)}
                  labelStyle={{ color: '#374151' }}
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: '#10b981' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Expense Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Distribusi Pengeluaran</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={expenseDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderPieLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {expenseDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Transaksi Terakhir</CardTitle>
              <Link href="/admin/transactions">
                <Button variant="ghost" size="sm">
                  Lihat Semua
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">Belum ada transaksi</p>
              ) : (
                recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between pb-4 border-b last:border-b-0">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{transaction.description}</p>
                      <p className="text-sm text-gray-500">
                        {transaction.category?.name} • {formatDate(transaction.transaction_date)}
                      </p>
                    </div>
                    <div className={`font-semibold ${transaction.transaction_type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                      {transaction.transaction_type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="mt-6">
              <Link href="/admin/transactions">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Transaksi
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Draft Articles */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Artikel Draft</CardTitle>
              <Link href="/admin/articles">
                <Button variant="ghost" size="sm">
                  Lihat Semua
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentDrafts.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">Belum ada artikel draft</p>
              ) : (
                recentDrafts.map((article) => (
                  <div key={article.id} className="pb-4 border-b last:border-b-0">
                    <Link href={`/admin/articles/${article.id}/edit`}>
                      <h3 className="font-medium text-gray-900 hover:text-emerald-600 transition-colors">
                        {article.title}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-500 mt-1">
                      {article.category} • {formatDate(article.created_at)}
                    </p>
                  </div>
                ))
              )}
            </div>
            <div className="mt-6">
              <Link href="/admin/articles/new">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
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