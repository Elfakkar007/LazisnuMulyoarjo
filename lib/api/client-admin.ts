// lib/api/client-admin.ts
"use client";

import { createClient } from '@/utils/supabase/client';

export async function getFinancialYears() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('financial_years')
    .select('*')
    .order('year', { ascending: false });

  if (error) {
    console.error('Error fetching financial years:', error);
    return [];
  }

  return data;
}


export async function getProgramCategories() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('program_categories')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching program categories:', error);
    return [];
  }

  return data;
}

export async function getPrograms(yearId: string) {
  const supabase = createClient();

  // If no year selected, return empty
  if (!yearId) return [];

  const { data, error } = await supabase
    .from('programs')
    .select('*')
    .eq('year_id', yearId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching programs:', error);
    return [];
  }

  return data;
}

export async function getFinancialTransactions(yearId: string, categoryId: string) {
  const supabase = createClient();

  if (!yearId || !categoryId) return [];

  const { data, error } = await supabase
    .from('financial_transactions')
    .select('*')
    .eq('year_id', yearId)
    .eq('category_id', categoryId)
    .order('transaction_date', { ascending: true });

  if (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }

  return data;
}

export async function getKalengDistribution(yearId: string) {
  const supabase = createClient();

  if (!yearId) return [];

  const { data, error } = await supabase
    .from('kaleng_distribution')
    .select('*')
    .eq('year_id', yearId);

  if (error) {
    console.error('Error fetching kaleng distribution:', error);
    return [];
  }

  return data;
}

export async function getMonthlyIncome(yearId: string) {
  const supabase = createClient();

  if (!yearId) return [];

  const { data, error } = await supabase
    .from('monthly_income')
    .select('*')
    .eq('year_id', yearId)
    .order('month', { ascending: true });

  if (error) {
    console.error('Error fetching monthly income:', error);
    return [];
  }

  return data;
}

export async function getArticles() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('activity_articles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching articles:', error);
    return [];
  }

  return data;
}

export async function getArticleById(id: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('activity_articles')
    .select(`
      *,
      images:activity_images(*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching article:', error);
    return null;
  }

  return data;
}
// =====================================================
// CLIENT ADMIN API - ADDITIONS
// File: lib/api/client-admin.ts (ADD THESE FUNCTIONS)
// =====================================================

// ... (keep all existing functions)

// NEW: Get organization profile (client-side)
export async function getOrganizationProfile() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('organization_profile')
    .select('*')
    .single();

  if (error) {
    console.error('Error fetching organization profile:', error);
    return null;
  }

  return data;
}

// NEW: Get structure positions
export async function getStructurePositions() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('structure_positions')
    .select('*')
    .order('position_order', { ascending: true });

  if (error) {
    console.error('Error fetching structure positions:', error);
    return [];
  }

  return data;
}

// NEW: Get structure members
export async function getStructureMembers() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('structure_members')
    .select('*')
    .order('member_order', { ascending: true });

  if (error) {
    console.error('Error fetching structure members:', error);
    return [];
  }

  return data;
}

// NEW: Get complete structure data for admin
export async function getStructureData() {
  const supabase = createClient();

  const { data: positions, error: positionsError } = await supabase
    .from('structure_positions')
    .select(`
      *,
      structure_members (*)
    `)
    .order('position_order', { ascending: true });

  if (positionsError) {
    console.error('Error fetching structure data:', positionsError);
    return { core: [], dusun: [] };
  }

  // Group by core and dusun
  const core = positions
    .filter(p => p.is_core)
    .map(p => ({
      position_data: p,
      position: p.position_name,
      members: (p.structure_members || []).sort((a: any, b: any) =>
        (a.member_order || 0) - (b.member_order || 0)
      ),
    }));

  const dusun = positions
    .filter(p => !p.is_core)
    .map(p => ({
      position_data: p,
      dusun: p.position_name.replace('Koordinator ', ''),
      members: (p.structure_members || []).sort((a: any, b: any) =>
        (a.member_order || 0) - (b.member_order || 0)
      ),
    }));

  return { core, dusun };
}
// =====================================================
// DASHBOARD FUNCTIONS - ADD TO lib/api/client-admin.ts
// Tambahkan fungsi-fungsi ini ke file lib/api/client-admin.ts
// =====================================================

// NEW: Get dashboard stats (Quick Stats Cards)
export async function getDashboardStats() {
  const supabase = createClient();

  // Get active year
  const { data: activeYear } = await supabase
    .from('financial_years')
    .select('*')
    .eq('is_active', true)
    .single();

  if (!activeYear) {
    return {
      totalIncome: 0,
      totalExpense: 0,
      balance: 0,
      totalArticles: 0,
      totalDistribution: 0,
    };
  }

  // Get total income for the year
  const { data: incomeData } = await supabase
    .from('monthly_income')
    .select('gross_amount')
    .eq('year_id', activeYear.id);

  const totalIncome = incomeData?.reduce((sum, item) => sum + (item.gross_amount || 0), 0) || 0;

  // Get total expenses for the year
  const { data: expenseData } = await supabase
    .from('financial_transactions')
    .select('amount')
    .eq('year_id', activeYear.id)
    .eq('transaction_type', 'expense');

  const totalExpense = expenseData?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0;

  // Calculate balance
  const balance = totalIncome - totalExpense;

  // Get total published articles
  const { count: totalArticles } = await supabase
    .from('activity_articles')
    .select('*', { count: 'exact', head: true })
    .eq('is_published', true);

  // Get total kaleng distribution for current month
  const currentMonth = new Date().getMonth() + 1;
  const { data: distributionData } = await supabase
    .from('kaleng_distribution')
    .select('total_distributed')
    .eq('year_id', activeYear.id)
    .eq('month', currentMonth);

  const totalDistribution = distributionData?.reduce((sum, item) => sum + (item.total_distributed || 0), 0) || 0;

  return {
    totalIncome,
    totalExpense,
    balance,
    totalArticles: totalArticles || 0,
    totalDistribution,
  };
}

// NEW: Get recent transactions
export async function getRecentTransactions(limit: number = 5) {
  const supabase = createClient();

  const { data: activeYear } = await supabase
    .from('financial_years')
    .select('*')
    .eq('is_active', true)
    .single();

  if (!activeYear) return [];

  const { data, error } = await supabase
    .from('financial_transactions')
    .select(`
      *,
      category:program_categories(name)
    `)
    .eq('year_id', activeYear.id)
    .order('transaction_date', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching recent transactions:', error);
    return [];
  }

  return data || [];
}

// NEW: Get recent draft articles
export async function getRecentDraftArticles(limit: number = 3) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('activity_articles')
    .select('id, title, category, created_at')
    .eq('is_published', false)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching recent draft articles:', error);
    return [];
  }

  return data || [];
}

// NEW: Get monthly income chart data (6 months)
export async function getMonthlyIncomeChart(months: number = 6) {
  const supabase = createClient();

  const { data: activeYear } = await supabase
    .from('financial_years')
    .select('*')
    .eq('is_active', true)
    .single();

  if (!activeYear) return [];

  const { data, error } = await supabase
    .from('monthly_income')
    .select('month, gross_amount')
    .eq('year_id', activeYear.id)
    .order('month', { ascending: true });

  if (error) {
    console.error('Error fetching monthly income chart:', error);
    return [];
  }

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];

  // Get last N months
  const allMonths = data || [];
  const lastMonths = allMonths.slice(-months);

  return lastMonths.map(item => ({
    month: monthNames[item.month - 1],
    amount: item.gross_amount || 0,
  }));
}

// NEW: Get expense distribution by category
export async function getExpenseDistribution() {
  const supabase = createClient();

  const { data: activeYear } = await supabase
    .from('financial_years')
    .select('*')
    .eq('is_active', true)
    .single();

  if (!activeYear) return [];

  const { data, error } = await supabase
    .from('financial_transactions')
    .select(`
      category_id,
      amount,
      category:program_categories(name)
    `)
    .eq('year_id', activeYear.id)
    .eq('transaction_type', 'expense');

  if (error) {
    console.error('Error fetching expense distribution:', error);
    return [];
  }

  // Group by category
  const categoryMap = new Map<string, { name: string; value: number }>();

  data?.forEach(transaction => {
    const categoryData = transaction.category as any;
    const categoryName = (Array.isArray(categoryData) ? categoryData[0]?.name : categoryData?.name) || 'Lainnya';
    const current = categoryMap.get(categoryName) || { name: categoryName, value: 0 };
    current.value += transaction.amount || 0;
    categoryMap.set(categoryName, current);
  });

  return Array.from(categoryMap.values());
}