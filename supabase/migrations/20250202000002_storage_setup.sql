-- =====================================================
-- SUPABASE STORAGE SETUP
-- Run this after running the main migration files
-- =====================================================

-- =====================================================
-- 1. CREATE STORAGE BUCKET
-- =====================================================

-- Create the public-assets bucket for storing images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'public-assets',
  'public-assets',
  true,
  5242880, -- 5MB limit
  ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 2. STORAGE POLICIES FOR PUBLIC ACCESS
-- =====================================================

-- Policy: Anyone can view/download files (public bucket)
CREATE POLICY "Public can view files"
ON storage.objects FOR SELECT
USING ( bucket_id = 'public-assets' );

-- =====================================================
-- 3. STORAGE POLICIES FOR AUTHENTICATED USERS
-- =====================================================

-- Policy: Authenticated users can upload files
CREATE POLICY "Authenticated users can upload files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'public-assets' );

-- Policy: Authenticated users can update their files
CREATE POLICY "Authenticated users can update files"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'public-assets' );

-- Policy: Authenticated users can delete their files
CREATE POLICY "Authenticated users can delete files"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'public-assets' );

-- =====================================================
-- 4. FOLDER STRUCTURE (OPTIONAL)
-- These are logical paths, not physical folders
-- =====================================================

-- Folder paths to use in the application:
-- - logos/           : Organization logos
-- - slides/          : Homepage slide images
-- - articles/        : Article featured images and galleries
-- - structure/       : Structure member photos
-- - documents/       : PDF documents (future use)

-- =====================================================
-- 5. VERIFY SETUP
-- =====================================================

-- Check if bucket exists
SELECT * FROM storage.buckets WHERE id = 'public-assets';

-- Check storage policies
SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';

-- =====================================================
-- NOTES:
-- =====================================================

-- 1. The bucket is set to PUBLIC, meaning anyone can view/download files
--    This is intentional for a transparency-focused website

-- 2. Only authenticated users (admins) can upload/update/delete files
--    This prevents unauthorized modifications

-- 3. File size limit is set to 5MB per file
--    Adjust if needed for larger images

-- 4. Allowed MIME types are limited to images only
--    Add more types if you need to support PDFs or other documents

-- 5. To test upload functionality:
--    - Log in as admin
--    - Use the image upload components
--    - Check storage in Supabase dashboard

-- =====================================================
-- TROUBLESHOOTING:
-- =====================================================

-- If uploads fail, check:
-- 1. User is authenticated
-- 2. Bucket exists and is public
-- 3. Policies are active
-- 4. File size is within limit
-- 5. File type is allowed

-- To reset (WARNING: This deletes all files):
-- DELETE FROM storage.objects WHERE bucket_id = 'public-assets';
-- DELETE FROM storage.buckets WHERE id = 'public-assets';
