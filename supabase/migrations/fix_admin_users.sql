-- ==============================================================================
-- SCRIPT: FIX ADMIN USERS
-- Description:
-- 1. Merapikan data admin ganda (duplikat).
-- 2. Mengisi user_id yang kosong (NULL) dengan mencocokkan email di auth.users.
--
-- CARA MENGGUNAKAN:
-- 1. Buka Supabase Dashboard > SQL Editor.
-- 2. New Query.
-- 3. Copy-paste seluruh isi file ini.
-- 4. Klik RUN.
-- ==============================================================================

BEGIN;

-- 1. CLEANUP DUPLICATES
-- Menghapus baris admin duplicate jika ada.
-- Prioritas yang dipertahankan:
-- a. Yang sudah punya user_id (valid).
-- b. Yang paling baru dibuat (created_at desc).

DELETE FROM public.admins
WHERE id IN (
  SELECT id
  FROM (
    SELECT id,
           ROW_NUMBER() OVER (
             PARTITION BY email
             ORDER BY (user_id IS NOT NULL) DESC, created_at DESC
           ) as rn
    FROM public.admins
  ) t
  WHERE t.rn > 1
);

-- 2. LINK AUTH USERS (SYNC)
-- Mengisi user_id yang masih NULL dengan ID dari tabel auth.users berdasarkan email.

UPDATE public.admins pa
SET user_id = au.id
FROM auth.users au
WHERE pa.email = au.email
  AND pa.user_id IS NULL;

-- 3. VERIFIKASI HASIL
-- Tampilkan daftar admin sekarang untuk memastikan data sudah benar.

SELECT 
    pa.email, 
    pa.role, 
    pa.name, 
    pa.user_id,
    CASE WHEN pa.user_id IS NOT NULL THEN 'TIED TO AUTH' ELSE 'ORPHAN (NO LOGIN)' END as status
FROM public.admins pa;

COMMIT;
