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