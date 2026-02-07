// =====================================================
// API SERVICES - Public Data Fetching
// For server components (uses server client by default)
// =====================================================

import { createClient } from '@/utils/supabase/server';
import { Database } from '@/types/database.types';

type Tables = Database['public']['Tables'];

// =====================================================
// HOMEPAGE DATA
// =====================================================

export async function getHomepageSlides() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('homepage_slides')
    .select('*')
    .eq('is_active', true)
    .order('slide_order', { ascending: true });

  if (error) {
    console.error('Error fetching homepage slides:', error);
    return [];
  }

  return data;
}

export async function getActiveFinancialYear() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('financial_years')
    .select('*')
    .eq('is_active', true)
    .single();

  if (error) {
    console.error('Error fetching active financial year:', error);
    return null;
  }

  return data;
}

export async function getCurrentMonthIncome() {
  const supabase = await createClient();
  const currentMonth = new Date().getMonth() + 1; // 1-12

  const activeYear = await getActiveFinancialYear();
  if (!activeYear) return null;

  const { data, error } = await supabase
    .from('monthly_income')
    .select('*')
    .eq('year_id', activeYear.id)
    .eq('month', currentMonth)
    .single();

  if (error) {
    console.error('Error fetching current month income:', error);
    return null;
  }

  return data;
}

export async function getTotalKalengDistributed() {
  const supabase = await createClient();

  const activeYear = await getActiveFinancialYear();
  if (!activeYear) return 0;

  const { data, error } = await supabase
    .from('kaleng_distribution')
    .select('total_distributed')
    .eq('year_id', activeYear.id);

  if (error) {
    console.error('Error fetching kaleng distribution:', error);
    return 0;
  }

  const total = data.reduce((sum, item) => sum + item.total_distributed, 0);
  return total;
}

export async function getMonthlyTrendData(yearId?: string) {
  const supabase = await createClient();

  let targetYearId = yearId;
  if (!targetYearId) {
    const activeYear = await getActiveFinancialYear();
    if (!activeYear) return [];
    targetYearId = activeYear.id;
  }

  const { data, error } = await supabase
    .from('monthly_income')
    .select('*')
    .eq('year_id', targetYearId)
    .order('month', { ascending: true });

  if (error) {
    console.error('Error fetching monthly trend:', error);
    return [];
  }

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];

  return data.map(item => ({
    month: monthNames[item.month - 1],
    amount: item.gross_amount,
  }));
}

export async function getRecentActivities(limit: number = 5) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('activity_articles')
    .select('id, title, slug, category, excerpt, activity_date, location, featured_image_url')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching recent activities:', error);
    return [];
  }

  return data;
}

// =====================================================
// ORGANIZATION PROFILE
// =====================================================

export async function getOrganizationProfile() {
  const supabase = await createClient();

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



// =====================================================
// FINANCIAL REPORTS
// =====================================================

export async function getFinancialYears() {
  const supabase = await createClient();

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

export async function getKalengDistribution(yearId: string, month?: number) {
  const supabase = await createClient();

  let query = supabase
    .from('kaleng_distribution')
    .select('*')
    .eq('year_id', yearId);

  if (month) {
    query = query.eq('month', month);
  }

  const { data, error } = await query.order('month', { ascending: true });

  if (error) {
    console.error('Error fetching kaleng distribution:', error);
    return [];
  }

  return data;
}

export async function getMonthlyIncome(yearId: string) {
  const supabase = await createClient();

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

export async function getProgramCategories() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('program_categories')
    .select('*')
    .order('percentage', { ascending: false });

  if (error) {
    console.error('Error fetching program categories:', error);
    return [];
  }

  return data;
}

export async function getPrograms(yearId: string, categoryId?: string) {
  const supabase = await createClient();

  let query = supabase
    .from('programs')
    .select(`
      *,
      category:program_categories(*)
    `)
    .eq('year_id', yearId);

  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching programs:', error);
    return [];
  }

  return data;
}

export async function getFinancialTransactions(yearId: string, categoryId?: string) {
  const supabase = await createClient();

  let query = supabase
    .from('financial_transactions')
    .select(`
      *,
      category:program_categories(*)
    `)
    .eq('year_id', yearId);

  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }

  const { data, error } = await query.order('transaction_date', { ascending: true });

  if (error) {
    console.error('Error fetching financial transactions:', error);
    return [];
  }

  return data;
}

// =====================================================
// ACTIVITIES / ARTICLES
// =====================================================

export async function getArticles(filters?: {
  category?: string;
  search?: string;
  limit?: number;
  offset?: number;
}) {
  const supabase = await createClient();

  let query = supabase
    .from('activity_articles')
    .select('id, title, slug, category, excerpt, activity_date, location, featured_image_url, published_at', { count: 'exact' })
    .eq('is_published', true);

  if (filters?.category) {
    query = query.eq('category', filters.category);
  }

  if (filters?.search) {
    query = query.ilike('title', `%${filters.search}%`);
  }

  query = query.order('published_at', { ascending: false });

  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  if (filters?.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 12) - 1);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching articles:', error);
    return { articles: [], total: 0 };
  }

  return { articles: data || [], total: count || 0 };
}

export async function getArticleBySlug(slug: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('activity_articles')
    .select(`
      *,
      images:activity_images(*)
    `)
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (error) {
    console.error('Error fetching article:', error);
    return null;
  }

  return data;
}

export async function getRelatedArticles(category: string, currentSlug: string, limit: number = 3) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('activity_articles')
    .select('id, title, slug, category, excerpt, activity_date, featured_image_url')
    .eq('category', category)
    .eq('is_published', true)
    .neq('slug', currentSlug)
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching related articles:', error);
    return [];
  }

  return data || [];
}
// =====================================================
// UPDATED API - Public Data with Enhanced Structure
// File: lib/api/public.ts (ADDITIONS/UPDATES)
// =====================================================


// UPDATED: getStructureData dengan data lengkap
export async function getStructureData() {
  const supabase = await createClient();

  // Fetch positions with their members
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

// NEW: Get organization profile for admin
export async function getOrganizationProfileForAdmin() {
  const supabase = await createClient();

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