-- =====================================================
-- SUPABASE AUTH SETUP FOR ADMIN
-- Migration untuk setup autentikasi admin
-- =====================================================

-- =====================================================
-- 1. UPDATE ADMINS TABLE
-- Hapus password_hash, gunakan Supabase Auth
-- =====================================================

-- Drop old password_hash column
ALTER TABLE admins DROP COLUMN IF EXISTS password_hash;

-- Add user_id reference to auth.users
ALTER TABLE admins ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE admins ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'admin';

-- Make user_id unique (one admin record per auth user)
CREATE UNIQUE INDEX IF NOT EXISTS admins_user_id_unique ON admins(user_id);

-- =====================================================
-- 2. CREATE ADMIN ROLE FUNCTION
-- Function untuk cek apakah user adalah admin
-- =====================================================

CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admins WHERE admins.user_id = $1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 3. UPDATE RLS POLICIES
-- Admin hanya bisa akses jika sudah login dan terdaftar di table admins
-- =====================================================

-- Drop existing policies untuk admins table
DROP POLICY IF EXISTS "Authenticated users can manage admins" ON admins;

-- Policy: Admin bisa view semua admin
CREATE POLICY "Admin can view admins" ON admins
FOR SELECT
USING (is_admin(auth.uid()));

-- Policy: Super admin bisa manage admins (untuk future development)
CREATE POLICY "Admin can manage admins" ON admins
FOR ALL
USING (is_admin(auth.uid()));

-- =====================================================
-- 4. UPDATE RLS POLICIES UNTUK TABLES LAIN
-- Ganti auth.role() dengan is_admin()
-- =====================================================

-- Organization Profile
DROP POLICY IF EXISTS "Authenticated users can manage organization profile" ON organization_profile;
CREATE POLICY "Admin can manage organization profile" ON organization_profile
FOR ALL USING (is_admin(auth.uid()));

-- Structure Positions
DROP POLICY IF EXISTS "Authenticated users can manage structure positions" ON structure_positions;
CREATE POLICY "Admin can manage structure positions" ON structure_positions
FOR ALL USING (is_admin(auth.uid()));

-- Structure Members
DROP POLICY IF EXISTS "Authenticated users can manage structure members" ON structure_members;
CREATE POLICY "Admin can manage structure members" ON structure_members
FOR ALL USING (is_admin(auth.uid()));

-- Financial Years
DROP POLICY IF EXISTS "Authenticated users can manage financial years" ON financial_years;
CREATE POLICY "Admin can manage financial years" ON financial_years
FOR ALL USING (is_admin(auth.uid()));

-- Kaleng Distribution
DROP POLICY IF EXISTS "Authenticated users can manage kaleng distribution" ON kaleng_distribution;
CREATE POLICY "Admin can manage kaleng distribution" ON kaleng_distribution
FOR ALL USING (is_admin(auth.uid()));

-- Monthly Income
DROP POLICY IF EXISTS "Authenticated users can manage monthly income" ON monthly_income;
CREATE POLICY "Admin can manage monthly income" ON monthly_income
FOR ALL USING (is_admin(auth.uid()));

-- Program Categories
DROP POLICY IF EXISTS "Authenticated users can manage program categories" ON program_categories;
CREATE POLICY "Admin can manage program categories" ON program_categories
FOR ALL USING (is_admin(auth.uid()));

-- Programs
DROP POLICY IF EXISTS "Authenticated users can manage programs" ON programs;
CREATE POLICY "Admin can manage programs" ON programs
FOR ALL USING (is_admin(auth.uid()));

-- Financial Transactions
DROP POLICY IF EXISTS "Authenticated users can manage financial transactions" ON financial_transactions;
CREATE POLICY "Admin can manage financial transactions" ON financial_transactions
FOR ALL USING (is_admin(auth.uid()));

-- Transaction Templates
DROP POLICY IF EXISTS "Authenticated users can manage transaction templates" ON transaction_templates;
CREATE POLICY "Admin can manage transaction templates" ON transaction_templates
FOR ALL USING (is_admin(auth.uid()));

-- Transaction Rows
DROP POLICY IF EXISTS "Authenticated users can manage transaction rows" ON transaction_rows;
CREATE POLICY "Admin can manage transaction rows" ON transaction_rows
FOR ALL USING (is_admin(auth.uid()));

-- Articles
DROP POLICY IF EXISTS "Authenticated users can manage articles" ON activity_articles;
CREATE POLICY "Admin can manage articles" ON activity_articles
FOR ALL USING (is_admin(auth.uid()));

-- Article Images
DROP POLICY IF EXISTS "Authenticated users can manage article images" ON activity_images;
CREATE POLICY "Admin can manage article images" ON activity_images
FOR ALL USING (is_admin(auth.uid()));

-- Homepage Slides
DROP POLICY IF EXISTS "Authenticated users can manage homepage slides" ON homepage_slides;
CREATE POLICY "Admin can manage homepage slides" ON homepage_slides
FOR ALL USING (is_admin(auth.uid()));

-- =====================================================
-- 5. STORAGE POLICIES UPDATE
-- =====================================================

-- Drop old policies
DROP POLICY IF EXISTS "Authenticated users can upload files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete files" ON storage.objects;

-- New policies untuk admin only
CREATE POLICY "Admin can upload files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'public-assets' AND
  is_admin(auth.uid())
);

CREATE POLICY "Admin can update files"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'public-assets' AND
  is_admin(auth.uid())
);

CREATE POLICY "Admin can delete files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'public-assets' AND
  is_admin(auth.uid())
);

-- =====================================================
-- 6. TRIGGER: AUTO CREATE ADMIN RECORD
-- Otomatis buat record di admins table saat signup
-- (Optional - untuk development/testing)
-- =====================================================

CREATE OR REPLACE FUNCTION public.handle_new_admin_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create admin record if email ends with @lazisnu-mulyoarjo.org
  -- atau email ada di whitelist
  IF NEW.email LIKE '%@lazisnu-mulyoarjo.org' THEN
    INSERT INTO public.admins (user_id, email, name)
    VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', 'Admin'))
    ON CONFLICT (user_id) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger untuk auto-create admin record
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_admin_user();

-- =====================================================
-- 7. MANUAL ADMIN CREATION FUNCTION
-- Function untuk manually add admin
-- =====================================================

CREATE OR REPLACE FUNCTION create_admin_manually(
  admin_email TEXT,
  admin_password TEXT,
  admin_name TEXT
)
RETURNS JSON AS $$
DECLARE
  new_user_id UUID;
BEGIN
  -- Note: Dalam production, ini harus dipanggil dari server-side
  -- atau menggunakan Supabase Admin API
  
  RETURN json_build_object(
    'success', false,
    'message', 'Use Supabase Dashboard or Admin API to create users'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- NOTES & INSTRUCTIONS
-- =====================================================

-- 1. Untuk membuat admin pertama:
--    a. Via Supabase Dashboard:
--       - Go to Authentication > Users > Add User
--       - Email: admin@lazisnu-mulyoarjo.org
--       - Password: (your secure password)
--       - Confirm email automatically
--    
--    b. Record akan otomatis dibuat di admins table via trigger
--
-- 2. Untuk testing, buat user dengan email @lazisnu-mulyoarjo.org
--
-- 3. Untuk production, disable auto-create trigger dan
--    manually insert ke admins table setelah user signup
--
-- 4. Rate limiting dihandle di aplikasi level (Next.js middleware)
--    dan Supabase sudah punya built-in rate limiting