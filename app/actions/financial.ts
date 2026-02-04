"use server"; // Wajib ada di baris pertama

import {
  getKalengDistribution,
  getMonthlyIncome,
  getPrograms,
  getProgramCategories,
  getFinancialTransactions,
} from "@/lib/api/public";

export async function fetchFinancialData(yearId: string) {
  try {
    // Kita jalankan semua request secara paralel agar lebih cepat
    const [kaleng, income, programs, categories, transactions] =
      await Promise.all([
        getKalengDistribution(yearId),
        getMonthlyIncome(yearId),
        getPrograms(yearId),
        getProgramCategories(),
        getFinancialTransactions(yearId),
      ]);

    // Kembalikan data sebagai object
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