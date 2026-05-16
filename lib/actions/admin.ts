// =====================================================
// SERVER ACTIONS - Admin Operations
// For server-side data mutations (Create, Update, Delete)
// =====================================================

'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { Database } from '@/types/database.types';
import {
  organizationProfileSchema,
  structurePositionSchema,
  structureMemberSchema,
  financialYearSchema,
  kalengDistributionSchema,
  monthlyIncomeSchema,
  programCategorySchema,
  programSchema,
  articleSchema,
  homepageSlideSchema,
  financialTransactionSchema,
} from '@/lib/validations/admin';

type Tables = Database['public']['Tables'];

// Helper to format Zod errors
function formatError(error: any) {
  if (error && error.flatten) {
    return {
      success: false,
      errors: error.flatten().fieldErrors,
      message: 'Validation failed',
    };
  }
  return {
    success: false,
    message: error.message || 'An unexpected error occurred',
  };
}

// =====================================================
// ORGANIZATION PROFILE
// =====================================================

export async function updateOrganizationProfile(
  data: Tables['organization_profile']['Update']
) {
  const result = organizationProfileSchema.partial().safeParse(data);

  if (!result.success) {
    return formatError(result.error);
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from('organization_profile')
    .update(result.data)
    .eq('id', data.id!);

  if (error) {
    console.error('Error updating organization profile:', error);
    return { success: false, message: error.message };
  }

  revalidatePath('/profil');
  return { success: true };
}

// =====================================================
// STRUCTURE MANAGEMENT
// =====================================================

export async function createStructurePosition(
  data: Tables['structure_positions']['Insert']
) {
  const result = structurePositionSchema.safeParse(data);
  if (!result.success) return formatError(result.error);

  const supabase = await createClient();

  const { data: createdData, error } = await supabase
    .from('structure_positions')
    .insert(result.data as any) // Type assertion due to Zod vs Supabase type mismatch potential
    .select()
    .single();

  if (error) {
    console.error('Error creating structure position:', error);
    return { success: false, message: error.message };
  }

  revalidatePath('/admin/structure');
  revalidatePath('/profil');
  return { success: true, data: createdData };
}

export async function updateStructurePosition(
  id: string,
  data: Tables['structure_positions']['Update']
) {
  const result = structurePositionSchema.partial().safeParse(data);
  if (!result.success) return formatError(result.error);

  const supabase = await createClient();

  const { error } = await supabase
    .from('structure_positions')
    .update(result.data)
    .eq('id', id);

  if (error) {
    console.error('Error updating structure position:', error);
    return { success: false, message: error.message };
  }

  revalidatePath('/admin/structure');
  revalidatePath('/profil');
  return { success: true };
}

export async function deleteStructurePosition(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('structure_positions')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting structure position:', error);
    return { success: false, message: error.message };
  }

  revalidatePath('/admin/structure');
  revalidatePath('/profil');
  return { success: true };
}

export async function createStructureMember(
  data: Tables['structure_members']['Insert']
) {
  const result = structureMemberSchema.safeParse(data);
  if (!result.success) return formatError(result.error);

  const supabase = await createClient();

  const { error } = await supabase
    .from('structure_members')
    .insert(result.data as any);

  if (error) {
    console.error('Error creating structure member:', error);
    return { success: false, message: error.message };
  }

  revalidatePath('/admin/structure');
  revalidatePath('/profil');
  return { success: true };
}

export async function updateStructureMember(
  id: string,
  data: Tables['structure_members']['Update']
) {
  const result = structureMemberSchema.partial().safeParse(data);
  if (!result.success) return formatError(result.error);

  const supabase = await createClient();

  const { error } = await supabase
    .from('structure_members')
    .update(result.data)
    .eq('id', id);

  if (error) {
    console.error('Error updating structure member:', error);
    return { success: false, message: error.message };
  }

  revalidatePath('/admin/structure');
  revalidatePath('/profil');
  return { success: true };
}

export async function deleteStructureMember(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('structure_members')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting structure member:', error);
    return { success: false, message: error.message };
  }

  revalidatePath('/admin/structure');
  revalidatePath('/profil');
  return { success: true };
}

// Combined create/update for core members (single-step workflow)
export async function upsertCoreMember(data: {
  memberId?: string; // if editing existing member
  position_name: string;
  position_order: number;
  tenure_period?: string | null;
  name: string;
  photo_url?: string | null;
  member_order?: number | null;
  bio?: string | null;
  motto?: string | null;
  social_links?: any;
}) {
  const supabase = await createClient();

  try {
    let positionId: string;

    if (data.memberId) {
      // Editing existing member - get existing position_id first
      const { data: existingMember, error: memberError } = await supabase
        .from('structure_members')
        .select('position_id')
        .eq('id', data.memberId)
        .single();

      if (memberError || !existingMember) {
        return { success: false, message: 'Anggota tidak ditemukan' };
      }

      positionId = existingMember.position_id;

      // Update the position name/order
      const { error: posUpdateError } = await supabase
        .from('structure_positions')
        .update({
          position_name: data.position_name,
          position_order: data.position_order,
          tenure_period: data.tenure_period || null,
        })
        .eq('id', positionId);

      if (posUpdateError) {
        console.error('Error updating position:', posUpdateError);
        return { success: false, message: posUpdateError.message };
      }

      // Update the member
      const { error: memUpdateError } = await supabase
        .from('structure_members')
        .update({
          name: data.name,
          photo_url: data.photo_url || null,
          member_order: data.member_order ?? 0,
          bio: data.bio || null,
          motto: data.motto || null,
          social_links: data.social_links || null,
        })
        .eq('id', data.memberId);

      if (memUpdateError) {
        console.error('Error updating member:', memUpdateError);
        return { success: false, message: memUpdateError.message };
      }
    } else {
      // Creating new member - create position first
      const { data: newPosition, error: posError } = await supabase
        .from('structure_positions')
        .insert({
          position_name: data.position_name,
          position_order: data.position_order,
          is_core: true,
          tenure_period: data.tenure_period || null,
        })
        .select()
        .single();

      if (posError || !newPosition) {
        console.error('Error creating position:', posError);
        return { success: false, message: posError?.message || 'Gagal membuat jabatan' };
      }

      positionId = newPosition.id;

      // Create the member
      const { error: memError } = await supabase
        .from('structure_members')
        .insert({
          position_id: positionId,
          name: data.name,
          photo_url: data.photo_url || null,
          member_order: data.member_order ?? 0,
          bio: data.bio || null,
          motto: data.motto || null,
          social_links: data.social_links || null,
        });

      if (memError) {
        console.error('Error creating member:', memError);
        // Rollback: delete the position we just created
        await supabase.from('structure_positions').delete().eq('id', positionId);
        return { success: false, message: memError.message };
      }
    }

    revalidatePath('/admin/structure');
    revalidatePath('/profil');
    return { success: true };
  } catch (err) {
    console.error('Error in upsertCoreMember:', err);
    return { success: false, message: 'Terjadi kesalahan tidak terduga' };
  }
}

// Delete a core member and its associated position
export async function deleteCoreMemberWithPosition(memberId: string) {
  const supabase = await createClient();

  try {
    // Get the member's position_id first
    const { data: member, error: memberError } = await supabase
      .from('structure_members')
      .select('position_id')
      .eq('id', memberId)
      .single();

    if (memberError || !member) {
      return { success: false, message: 'Anggota tidak ditemukan' };
    }

    // Check how many members are in this position
    const { count } = await supabase
      .from('structure_members')
      .select('*', { count: 'exact', head: true })
      .eq('position_id', member.position_id);

    // Delete the member
    const { error: deleteError } = await supabase
      .from('structure_members')
      .delete()
      .eq('id', memberId);

    if (deleteError) {
      return { success: false, message: deleteError.message };
    }

    // If this was the only member in the position, delete the position too
    if (count && count <= 1) {
      await supabase
        .from('structure_positions')
        .delete()
        .eq('id', member.position_id);
    }

    revalidatePath('/admin/structure');
    revalidatePath('/profil');
    return { success: true };
  } catch (err) {
    console.error('Error in deleteCoreMemberWithPosition:', err);
    return { success: false, message: 'Terjadi kesalahan tidak terduga' };
  }
}

// =====================================================
// FINANCIAL YEARS
// =====================================================

export async function createFinancialYear(
  data: Tables['financial_years']['Insert']
) {
  const result = financialYearSchema.safeParse(data);
  if (!result.success) return formatError(result.error);

  const supabase = await createClient();

  const { error } = await supabase
    .from('financial_years')
    .insert(result.data as any);

  if (error) {
    console.error('Error creating financial year:', error);
    return { success: false, message: error.message };
  }

  revalidatePath('/admin/financial-years');
  return { success: true };
}

export async function updateFinancialYear(
  id: string,
  data: Tables['financial_years']['Update']
) {
  const result = financialYearSchema.partial().safeParse(data);
  if (!result.success) return formatError(result.error);

  const supabase = await createClient();

  const { error } = await supabase
    .from('financial_years')
    .update(result.data)
    .eq('id', id);

  if (error) {
    console.error('Error updating financial year:', error);
    return { success: false, message: error.message };
  }

  revalidatePath('/admin/financial-years');
  revalidatePath('/');
  return { success: true };
}

export async function deleteFinancialYear(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('financial_years')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting financial year:', error);
    return { success: false, message: error.message };
  }

  revalidatePath('/admin/financial-years');
  return { success: true };
}

// =====================================================
// KALENG DISTRIBUTION
// =====================================================

export async function upsertKalengDistribution(
  data: Tables['kaleng_distribution']['Insert']
) {
  const result = kalengDistributionSchema.safeParse(data);
  if (!result.success) return formatError(result.error);

  const supabase = await createClient();

  const { error } = await supabase
    .from('kaleng_distribution')
    .upsert(result.data as any, {
      onConflict: 'year_id,month,dusun',
    });

  if (error) {
    console.error('Error upserting kaleng distribution:', error);
    return { success: false, message: error.message };
  }

  revalidatePath('/admin/kaleng-distribution');
  revalidatePath('/laporan');
  return { success: true };
}

export async function bulkUpsertKalengDistribution(
  items: Tables['kaleng_distribution']['Insert'][]
) {
  // Validate all items
  const validItems = [];
  const errors = [];

  for (const item of items) {
    const result = kalengDistributionSchema.safeParse(item);
    if (!result.success) {
      errors.push(result.error.flatten().fieldErrors);
    } else {
      validItems.push(result.data);
    }
  }

  if (errors.length > 0) {
    return { success: false, message: 'Some items failed validation', errors: errors[0] }; // Simplified error return
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from('kaleng_distribution')
    .upsert(validItems as any, {
      onConflict: 'year_id,month,dusun',
    });

  if (error) {
    console.error('Error bulk upserting kaleng distribution:', error);
    return { success: false, message: error.message };
  }

  revalidatePath('/admin/kaleng-distribution');
  revalidatePath('/laporan');
  return { success: true };
}

// =====================================================
// MONTHLY INCOME
// =====================================================

export async function upsertMonthlyIncome(
  data: Tables['monthly_income']['Insert']
) {
  const result = monthlyIncomeSchema.safeParse(data);
  if (!result.success) return formatError(result.error);

  const supabase = await createClient();

  const { error } = await supabase
    .from('monthly_income')
    .upsert(result.data as any, {
      onConflict: 'year_id,month',
    });

  if (error) {
    console.error('Error upserting monthly income:', error);
    return { success: false, message: error.message };
  }

  revalidatePath('/admin/monthly-income');
  revalidatePath('/laporan');
  revalidatePath('/');
  return { success: true };
}

// =====================================================
// PROGRAM CATEGORIES
// =====================================================

export async function createProgramCategory(
  data: Tables['program_categories']['Insert']
) {
  const result = programCategorySchema.safeParse(data);
  if (!result.success) return formatError(result.error);

  const supabase = await createClient();

  const { error } = await supabase
    .from('program_categories')
    .insert(result.data as any);

  if (error) {
    console.error('Error creating program category:', error);
    return { success: false, message: error.message };
  }

  revalidatePath('/admin/program-categories');
  revalidatePath('/laporan');
  return { success: true };
}

export async function updateProgramCategory(
  id: string,
  data: Tables['program_categories']['Update']
) {
  const result = programCategorySchema.partial().safeParse(data);
  if (!result.success) return formatError(result.error);

  const supabase = await createClient();

  const { error } = await supabase
    .from('program_categories')
    .update(result.data)
    .eq('id', id);

  if (error) {
    console.error('Error updating program category:', error);
    return { success: false, message: error.message };
  }

  revalidatePath('/admin/program-categories');
  revalidatePath('/laporan');
  return { success: true };
}

export async function deleteProgramCategory(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('program_categories')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting program category:', error);
    return { success: false, message: error.message };
  }

  revalidatePath('/admin/program-categories');
  revalidatePath('/laporan');
  return { success: true };
}

// =====================================================
// PROGRAMS
// =====================================================

export async function createProgram(data: Tables['programs']['Insert']) {
  const result = programSchema.safeParse(data);
  if (!result.success) return formatError(result.error);

  const supabase = await createClient();

  const { error } = await supabase.from('programs').insert(result.data as any);

  if (error) {
    console.error('Error creating program:', error);
    return { success: false, message: error.message };
  }

  revalidatePath('/admin/programs');
  revalidatePath('/laporan');
  return { success: true };
}

export async function updateProgram(
  id: string,
  data: Tables['programs']['Update']
) {
  const result = programSchema.partial().safeParse(data);
  if (!result.success) return formatError(result.error);

  const supabase = await createClient();

  const { error } = await supabase
    .from('programs')
    .update(result.data)
    .eq('id', id);

  if (error) {
    console.error('Error updating program:', error);
    return { success: false, message: error.message };
  }

  revalidatePath('/admin/programs');
  revalidatePath('/laporan');
  return { success: true };
}

export async function deleteProgram(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from('programs').delete().eq('id', id);

  if (error) {
    console.error('Error deleting program:', error);
    return { success: false, message: error.message };
  }

  revalidatePath('/admin/programs');
  revalidatePath('/laporan');
  return { success: true };
}

export async function bulkCreatePrograms(items: Tables['programs']['Insert'][]) {
  const validItems = [];
  // Basic validation only for bulk upload to prevent timeout, or iterate
  for (const item of items) {
    const result = programSchema.safeParse(item);
    if (result.success) validItems.push(result.data);
  }

  const supabase = await createClient();

  const { error } = await supabase.from('programs').insert(validItems as any);

  if (error) {
    console.error('Error bulk creating programs:', error);
    return { success: false, message: error.message };
  }

  revalidatePath('/admin/programs');
  revalidatePath('/laporan');
  return { success: true };
}

// =====================================================
// ARTICLES
// =====================================================

export async function createArticle(data: Tables['activity_articles']['Insert']) {
  const result = articleSchema.safeParse(data);
  if (!result.success) return formatError(result.error);

  const supabase = await createClient();

  const { error } = await supabase.from('activity_articles').insert(result.data as any);

  if (error) {
    console.error('Error creating article:', error);
    return { success: false, message: error.message };
  }

  revalidatePath('/admin/articles');
  revalidatePath('/kegiatan');
  return { success: true };
}

export async function updateArticle(
  id: string,
  data: Tables['activity_articles']['Update']
) {
  const result = articleSchema.partial().safeParse(data);
  if (!result.success) return formatError(result.error);

  const supabase = await createClient();

  const { error } = await supabase
    .from('activity_articles')
    .update(result.data)
    .eq('id', id);

  if (error) {
    console.error('Error updating article:', error);
    return { success: false, message: error.message };
  }

  revalidatePath('/admin/articles');
  revalidatePath('/kegiatan');
  if (data.slug) revalidatePath(`/kegiatan/${data.slug}`);
  return { success: true };
}

export async function deleteArticle(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('activity_articles')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting article:', error);
    return { success: false, message: error.message };
  }

  revalidatePath('/admin/articles');
  revalidatePath('/kegiatan');
  return { success: true };
}

export async function publishArticle(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('activity_articles')
    .update({ is_published: true })
    .eq('id', id);

  if (error) {
    console.error('Error publishing article:', error);
    return { success: false, message: error.message };
  }

  revalidatePath('/admin/articles');
  revalidatePath('/kegiatan');
  revalidatePath('/');
  return { success: true };
}

export async function unpublishArticle(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('activity_articles')
    .update({ is_published: false })
    .eq('id', id);

  if (error) {
    console.error('Error unpublishing article:', error);
    return { success: false, message: error.message };
  }

  revalidatePath('/admin/articles');
  revalidatePath('/kegiatan');
  return { success: true };
}

// =====================================================
// HOMEPAGE SLIDES
// =====================================================

export async function createHomepageSlide(
  data: Tables['homepage_slides']['Insert']
) {
  const result = homepageSlideSchema.safeParse(data);
  if (!result.success) return formatError(result.error);

  const supabase = await createClient();

  const { error } = await supabase.from('homepage_slides').insert(result.data as any);

  if (error) {
    console.error('Error creating homepage slide:', error);
    return { success: false, message: error.message };
  }

  revalidatePath('/admin/homepage-slides');
  revalidatePath('/');
  return { success: true };
}

export async function updateHomepageSlide(
  id: string,
  data: Tables['homepage_slides']['Update']
) {
  const result = homepageSlideSchema.partial().safeParse(data);
  if (!result.success) return formatError(result.error);

  const supabase = await createClient();

  const { error } = await supabase
    .from('homepage_slides')
    .update(result.data)
    .eq('id', id);

  if (error) {
    console.error('Error updating homepage slide:', error);
    return { success: false, message: error.message };
  }

  revalidatePath('/admin/homepage-slides');
  revalidatePath('/');
  return { success: true };
}

export async function deleteHomepageSlide(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('homepage_slides')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting homepage slide:', error);
    return { success: false, message: error.message };
  }

  revalidatePath('/admin/homepage-slides');
  revalidatePath('/');
  return { success: true };
}

export async function reorderHomepageSlides(
  slides: { id: string; slide_order: number }[]
) {
  const supabase = await createClient();

  const updates = slides.map(slide =>
    supabase
      .from('homepage_slides')
      .update({ slide_order: slide.slide_order })
      .eq('id', slide.id)
  );

  const results = await Promise.all(updates);
  const hasError = results.some(result => result.error);

  if (hasError) {
    console.error('Error reordering homepage slides');
    return { success: false, message: 'Failed to reorder slides' };
  }

  revalidatePath('/admin/homepage-slides');
  revalidatePath('/');
  return { success: true };
}


// =====================================================
// FINANCIAL TRANSACTIONS (untuk Transaction Builder)
// =====================================================

export async function createFinancialTransaction(data: {
  year_id: string;
  category_id: string;
  program_id?: string | null;
  transaction_type: 'income' | 'expense';
  description: string;
  amount: number;
  transaction_date: string;
}) {
  const result = financialTransactionSchema.safeParse(data);
  if (!result.success) return formatError(result.error);

  const supabase = await createClient();

  const { error } = await supabase
    .from('financial_transactions')
    .insert(result.data as any);

  if (error) {
    console.error('Error creating transaction:', error);
    return { success: false, message: error.message };
  }

  revalidatePath('/admin/transactions');
  revalidatePath('/laporan');
  return { success: true };
}

export async function updateFinancialTransaction(
  id: string,
  data: {
    description?: string;
    amount?: number;
    transaction_date?: string;
  }
) {
  const result = financialTransactionSchema.partial().safeParse(data);
  if (!result.success) return formatError(result.error);

  const supabase = await createClient();

  const { error } = await supabase
    .from('financial_transactions')
    .update(result.data)
    .eq('id', id);

  if (error) {
    console.error('Error updating transaction:', error);
    return { success: false, message: error.message };
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
    return { success: false, message: error.message };
  }

  revalidatePath('/admin/transactions');
  revalidatePath('/laporan');
  return { success: true };
}

export async function bulkUpsertFinancialTransactions(
  year_id: string,
  category_id: string,
  items: {
    id: string;
    year_id: string;
    category_id: string;
    program_id?: string | null;
    transaction_type: 'income' | 'expense';
    description: string;
    amount: number;
    transaction_date: string;
  }[]
) {

  const validItems = [];
  const formattingErrors: string[] = [];

  for (let i = 0; i < items.length; i++) {
    // Pastikan string kosong pada program_id dan description ditangani
    const rawItem = { ...items[i] };
    if (rawItem.program_id === "") rawItem.program_id = null;
    if (rawItem.description === "") rawItem.description = rawItem.transaction_type === 'expense' ? 'Pengeluaran' : 'Pemasukan';

    const result = financialTransactionSchema.safeParse(rawItem);
    if (result.success) {
      validItems.push(result.data);
    } else {
      formattingErrors.push(`Baris ${i + 1} (${rawItem.transaction_type}): ${Object.values(result.error.flatten().fieldErrors).flat().join(', ')}`);
    }
  }

  if (formattingErrors.length > 0) {
    return { success: false, message: `Validasi gagal: ${formattingErrors.join(' | ')}` };
  }

  const supabase = await createClient();
  const validIds = validItems.map(item => item.id).filter(Boolean) as string[];

  // 1. Dapatkan daftar ID transaksi yang sudah ada di database untuk kategori & tahun ini
  const { data: existingRecords } = await supabase
    .from('financial_transactions')
    .select('id')
    .eq('year_id', year_id)
    .eq('category_id', category_id);

  // 2. Hapus transaksi yang ada di DB tapi TIDAK ada di list validIds (berarti dihapus oleh admin di UI)
  if (existingRecords) {
    const idsToDelete = existingRecords
      .map(row => row.id)
      .filter(id => !validIds.includes(id));
      
    if (idsToDelete.length > 0) {
      await supabase
        .from('financial_transactions')
        .delete()
        .in('id', idsToDelete);
    }
  }

  // 3. Upsert (Update jika ada, Insert jika baru) transaksi yang valid
  if (validItems.length > 0) {
    const { error } = await supabase
      .from('financial_transactions')
      .upsert(validItems as any, { onConflict: 'id' });

    if (error) {
      console.error('Error bulk upserting transactions:', error);
      return { success: false, message: error.message };
    }
  }

  // Recalculate total_expense from transactions
  const { data: allYearTransactions } = await supabase
    .from('financial_transactions')
    .select('transaction_type, amount')
    .eq('year_id', year_id);

  // Recalculate total_income from monthly_income (the authoritative source)
  const { data: monthlyIncomeData } = await supabase
    .from('monthly_income')
    .select('gross_amount')
    .eq('year_id', year_id);

  const totalIncome = monthlyIncomeData
    ?.reduce((sum, t) => sum + Number(t.gross_amount || 0), 0) || 0;

  const totalExpense = allYearTransactions
    ?.filter(t => t.transaction_type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0) || 0;

  await supabase
    .from('financial_years')
    .update({ total_income: totalIncome, total_expense: totalExpense })
    .eq('id', year_id);

  revalidatePath('/admin/transactions');
  revalidatePath('/laporan');
  return { success: true };
}

// =====================================================
// TRANSACTION TEMPLATES
// =====================================================

export async function createTransactionTemplate(data: {
  category_id: string;
  template_name: string;
  columns: any;
}) {
  // Skipping Zod for templates as columns is JSON/any
  const supabase = await createClient();

  const { error } = await supabase
    .from('transaction_templates')
    .insert(data);

  if (error) {
    console.error('Error creating template:', error);
    return { success: false, message: error.message };
  }

  revalidatePath('/admin/transactions');
  return { success: true };
}

export async function getTransactionTemplates(categoryId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('transaction_templates')
    .select('*')
    .eq('category_id', categoryId);

  if (error) {
    console.error('Error fetching templates:', error);
    return [];
  }

  return data || [];
}