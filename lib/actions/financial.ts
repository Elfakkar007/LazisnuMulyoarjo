// =====================================================
// ADDITIONS TO lib/actions/admin.ts
// Tambahkan function-function berikut ke file lib/actions/admin.ts yang sudah ada
// =====================================================

// =====================================================
// FINANCIAL TRANSACTIONS (untuk Transaction Builder)
// =====================================================

export async function createFinancialTransaction(
  data: Tables['financial_transactions']['Insert']
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('financial_transactions')
    .insert(data);

  if (error) {
    console.error('Error creating transaction:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/transactions');
  revalidatePath('/laporan');
  return { success: true };
}

export async function updateFinancialTransaction(
  id: string,
  data: Tables['financial_transactions']['Update']
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('financial_transactions')
    .update(data)
    .eq('id', id);

  if (error) {
    console.error('Error updating transaction:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/transactions');
  revalidatePath('/laporan');
  return { success: true };
}

export async function deleteFinancialTransaction(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('financial_transactions')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting transaction:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/transactions');
  revalidatePath('/laporan');
  return { success: true };
}

export async function bulkUpsertFinancialTransactions(
  items: Tables['financial_transactions']['Insert'][]
) {
  const supabase = await createClient();

  // Delete existing transactions for this year/category first
  if (items.length > 0) {
    const { year_id, category_id } = items[0];
    await supabase
      .from('financial_transactions')
      .delete()
      .eq('year_id', year_id)
      .eq('category_id', category_id);
  }

  // Insert new transactions
  const { error } = await supabase
    .from('financial_transactions')
    .insert(items);

  if (error) {
    console.error('Error bulk upserting transactions:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/transactions');
  revalidatePath('/laporan');
  return { success: true };
}