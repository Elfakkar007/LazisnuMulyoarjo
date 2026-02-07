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
