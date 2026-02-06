// =====================================================
// FIXED: app/actions/financial.ts
// Server Action untuk fetch data keuangan
// =====================================================

"use server";

import { createClient } from "@/utils/supabase/server";

interface FinancialData {
  kaleng: any[];
  income: any[];
  programs: any[];
  categories: any[];
  transactions: any[];
}

export async function fetchFinancialData(yearId: string): Promise<FinancialData> {
  const supabase = await createClient();

  try {
    // Fetch semua data secara parallel
    const [
      { data: kaleng = [], error: kalengError },
      { data: income = [], error: incomeError },
      { data: programs = [], error: programsError },
      { data: categories = [], error: categoriesError },
      { data: transactions = [], error: transactionsError },
    ] = await Promise.all([
      supabase
        .from("kaleng_distribution")
        .select("*")
        .eq("year_id", yearId)
        .order("month", { ascending: true }),
      
      supabase
        .from("monthly_income")
        .select("*")
        .eq("year_id", yearId)
        .order("month", { ascending: true }),
      
      supabase
        .from("programs")
        .select("*")
        .eq("year_id", yearId)
        .order("created_at", { ascending: true }),
      
      supabase
        .from("program_categories")
        .select("*")
        .order("created_at", { ascending: true }),
      
      supabase
        .from("financial_transactions")
        .select("*")
        .eq("year_id", yearId)
        .order("transaction_date", { ascending: true }),
    ]);

    // Log errors jika ada
    if (kalengError) console.error("Kaleng error:", kalengError);
    if (incomeError) console.error("Income error:", incomeError);
    if (programsError) console.error("Programs error:", programsError);
    if (categoriesError) console.error("Categories error:", categoriesError);
    if (transactionsError) console.error("Transactions error:", transactionsError);

    return {
      kaleng,
      income,
      programs,
      categories,
      transactions,
    };
  } catch (error) {
    console.error("Server Action Error:", error);
    throw new Error("Gagal mengambil data keuangan");
  }
}