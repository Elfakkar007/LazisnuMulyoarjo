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
  const result = organizationProfileSchema.safeParse(data);

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

export async function bulkUpsertFinancialTransactions(items: {
  year_id: string;
  category_id: string;
  program_id?: string | null;
  transaction_type: 'income' | 'expense';
  description: string;
  amount: number;
  transaction_date: string;
}[]) {

  const validItems = [];
  for (const item of items) {
    const result = financialTransactionSchema.safeParse(item);
    if (result.success) validItems.push(result.data);
  }

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
    .insert(validItems as any);

  if (error) {
    console.error('Error bulk upserting transactions:', error);
    return { success: false, message: error.message };
  }

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