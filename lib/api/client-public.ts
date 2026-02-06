// lib/api/client-public.ts
"use client";

import { createClient } from '@/utils/supabase/client';

// Fungsi-fungsi ini akan dipanggil dari Client Component
export async function getKalengDistribution(yearId: string, month?: number) {
  const supabase = createClient();
  
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
  const supabase = createClient();
  
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
  const supabase = createClient();
  
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
  const supabase = createClient();
  
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
  const supabase = createClient();
  
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