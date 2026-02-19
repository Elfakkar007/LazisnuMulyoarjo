-- ==============================================================================
-- SCRIPT: CLEANUP SEEDER DATA (RESET DATABASE)
-- Description:
-- 1. Menghapus semua data transaksi, laporan, artikel, dan program (TRUNCATE).
-- 2. Mempertahankan akun admin (tabel `admins`).
-- 3. Mempertahankan profil organisasi (tabel `organization_profile`) agar tidak error di frontend.
--    Jika ingin reset profil juga, uncomment bagian TRUNCATE organization_profile.
--
-- CARA PENGGUNAAN:
-- 1. Buka Supabase Dashboard > SQL Editor.
-- 2. Copy-paste script ini.
-- 3. Jalankan (Run).
-- ==============================================================================

BEGIN;

-- 1. TRUNCATE DATA TABLES (CASCADE untuk menghapus data terkait di tabel lain)
-- Urutan tidak terlalu penting karena CASCADE, tapi kita mulai dari child tables untuk kejelasan.

-- Hapus data transaksi keuangan
TRUNCATE TABLE financial_transactions CASCADE;
TRUNCATE TABLE transaction_rows CASCADE;
TRUNCATE TABLE transaction_templates CASCADE;

-- Hapus data program dan kategori
TRUNCATE TABLE programs CASCADE;
TRUNCATE TABLE program_categories CASCADE;

-- Hapus data laporan bulanan
TRUNCATE TABLE monthly_income CASCADE;
TRUNCATE TABLE kaleng_distribution CASCADE;

-- Hapus tahun keuangan (akan menghapus data terkait via CASCADE jika ada yang tertinggal)
TRUNCATE TABLE financial_years CASCADE;

-- Hapus artikel dan slide
TRUNCATE TABLE activity_images CASCADE;
TRUNCATE TABLE activity_articles CASCADE;
TRUNCATE TABLE homepage_slides CASCADE;

-- Hapus struktur organisasi (selain admin)
TRUNCATE TABLE structure_members CASCADE;
TRUNCATE TABLE structure_positions CASCADE;

-- OPTIONAL: Reset Organization Profile ke default atau kosongkan?
-- Biasanya profil diedit sekali dan jarang berubah, jadi kita pertahankan.
-- Jika ingin dihapus, hilangkan comment di bawah:
-- TRUNCATE TABLE organization_profile CASCADE;

-- 2. VERIFIKASI
-- Pastikan tabel admin masih ada isinya
SELECT COUNT(*) as admin_count FROM admins;

COMMIT;

-- ==============================================================================
-- DATABASE BERHASIL DI-RESET (KECUALI ADMIN & PROFIL)
-- ==============================================================================
