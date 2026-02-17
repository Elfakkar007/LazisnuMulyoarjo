import { z } from "zod";

// Helper for empty strings to null or undefined
const emptyStringToNull = (val: unknown) => 
  val === "" ? null : val;

export const organizationProfileSchema = z.object({
  id: z.string().uuid(),
  vision: z.string().min(1, "Visi harus diisi"),
  mission: z.string().min(1, "Misi harus diisi"),
  about: z.string().nullable().optional(),
  social_media_links: z.any().optional(), // Adjust if we have specific structure
  whatsapp_number: z.string().nullable().optional(),
  email: z.string().email("Email tidak valid").nullable().optional().or(z.literal("")),
  address: z.string().nullable().optional(),
  logo_url: z.string().url("URL Logo tidak valid").nullable().optional().or(z.literal("")),
  google_maps_url: z.string().url("URL Google Maps tidak valid").nullable().optional().or(z.literal("")),
});

export const structurePositionSchema = z.object({
  position_name: z.string().min(1, "Nama posisi harus diisi"),
  position_order: z.preprocess((val) => Number(val), z.number().int("Urutan harus angka bulat")),
  is_core: z.boolean().default(false),
  tenure_period: z.string().nullable().optional(),
});

export const structureMemberSchema = z.object({
  position_id: z.string().uuid("Position ID tidak valid"),
  name: z.string().min(1, "Nama harus diisi"),
  photo_url: z.string().nullable().optional(),
  dusun: z.string().nullable().optional(),
  member_order: z.preprocess((val) => val === "" ? null : Number(val), z.number().int().nullable().optional()),
  bio: z.string().nullable().optional(),
  motto: z.string().nullable().optional(),
  social_links: z.any().optional(),
});

export const financialYearSchema = z.object({
  year: z.preprocess((val) => Number(val), z.number().int().min(2000).max(2100)),
  is_active: z.boolean().default(false),
  total_income: z.preprocess((val) => Number(val), z.number().default(0)),
  total_expense: z.preprocess((val) => Number(val), z.number().default(0)),
});

export const kalengDistributionSchema = z.object({
  year_id: z.string().uuid(),
  month: z.preprocess((val) => Number(val), z.number().int().min(1).max(12)),
  dusun: z.string().min(1, "Dusun harus diisi"),
  total_distributed: z.preprocess((val) => Number(val), z.number().int().nonnegative()),
  total_collected: z.preprocess((val) => Number(val), z.number().int().nonnegative()),
  total_not_collected: z.preprocess((val) => Number(val), z.number().int().nonnegative()),
});

export const monthlyIncomeSchema = z.object({
  year_id: z.string().uuid(),
  month: z.preprocess((val) => Number(val), z.number().int().min(1).max(12)),
  gross_amount: z.preprocess((val) => Number(val), z.number().nonnegative()),
  kaleng_wages: z.preprocess((val) => Number(val), z.number().nonnegative().optional()),
  spb_cost: z.preprocess((val) => Number(val), z.number().nonnegative().optional()),
  jpzis_25_percent: z.preprocess((val) => Number(val), z.number().nonnegative().optional()),
  jpzis_75_percent: z.preprocess((val) => Number(val), z.number().nonnegative().optional()),
});

export const programCategorySchema = z.object({
  name: z.string().min(1, "Nama kategori harus diisi"),
  percentage: z.preprocess((val) => Number(val), z.number().min(0).max(100)),
  color_code: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Kode warna tidak valid").optional().or(z.literal("")),
});

export const programSchema = z.object({
  year_id: z.string().uuid(),
  category_id: z.string().uuid(),
  name: z.string().min(1, "Nama program harus diisi"),
  description: z.string().nullable().optional(),
  target_audience: z.string().nullable().optional(),
  quantity: z.string().nullable().optional(),
  budget: z.preprocess((val) => Number(val), z.number().nonnegative()),
  realization: z.preprocess((val) => Number(val), z.number().nonnegative().optional()),
  is_completed: z.boolean().default(false),
});

export const articleSchema = z.object({
  title: z.string().min(1, "Judul harus diisi"),
  slug: z.string().min(1, "Slug harus diisi").regex(/^[a-z0-9-]+$/, "Slug hanya boleh huruf kecil, angka, dan strip"),
  category: z.enum(['Sosial', 'Kesehatan', 'Keagamaan']),
  excerpt: z.string().optional(),
  content: z.string().min(1, "Konten harus diisi"),
  featured_image_url: z.string().nullable().optional(),
  activity_date: z.string().refine((val) => !isNaN(Date.parse(val)), "Tanggal tidak valid"),
  location: z.string().nullable().optional(),
  is_published: z.boolean().default(false),
});

export const homepageSlideSchema = z.object({
  badge: z.string().min(1, "Badge harus diisi"),
  title: z.string().min(1, "Judul harus diisi"),
  detail: z.string().nullable().optional(),
  background_gradient: z.string().nullable().optional(),
  image_url: z.string().nullable().optional(),
  link_url: z.string().nullable().optional(),
  slide_order: z.preprocess((val) => Number(val), z.number().int()),
  is_active: z.boolean().default(true),
});

export const financialTransactionSchema = z.object({
  year_id: z.string().uuid(),
  category_id: z.string().uuid().nullable().optional(), // Nullable for general income/expense?
  transaction_type: z.enum(['income', 'expense']),
  description: z.string().min(1, "Deskripsi harus diisi"),
  amount: z.preprocess((val) => Number(val), z.number().nonnegative("Jumlah tidak boleh negatif")),
  transaction_date: z.string().refine((val) => !isNaN(Date.parse(val)), "Tanggal tidak valid"),
});

export type ValidationResult<T> = {
  success: boolean;
  data?: T;
  errors?: Record<string, string[]>;
  message?: string;
};
