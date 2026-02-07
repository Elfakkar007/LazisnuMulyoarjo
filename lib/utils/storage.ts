// =====================================================
// SUPABASE STORAGE HELPERS
// For uploading and managing files in Supabase Storage
// =====================================================

import { createClient } from '@/utils/supabase/client';

const BUCKET_NAME = 'public-assets';

// Storage paths
export const STORAGE_PATHS = {
  LOGOS: 'logos',
  SLIDES: 'slides',
  ARTICLES: 'articles',
  STRUCTURE: 'structure',
} as const;

// =====================================================
// UPLOAD FUNCTIONS
// =====================================================

export async function uploadFile(
  file: File,
  path: string,
  fileName?: string
): Promise<{ url: string | null; error: string | null }> {
  const supabase = createClient();

  try {
    // Generate unique filename if not provided
    const timestamp = Date.now();
    const finalFileName = fileName || `${timestamp}-${file.name}`;
    const filePath = `${path}/${finalFileName}`;

    // Upload file
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Error uploading file:', error);
      return { url: null, error: error.message };
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    return { url: publicUrl, error: null };
  } catch (error) {
    console.error('Error uploading file:', error);
    return { url: null, error: 'Failed to upload file' };
  }
}

export async function uploadImage(
  file: File,
  path: string,
  maxSizeMB: number = 2
): Promise<{ url: string | null; error: string | null }> {
  // Validate file type
  if (!file.type.startsWith('image/')) {
    return { url: null, error: 'File harus berupa gambar' };
  }

  // Validate file size
  const fileSizeMB = file.size / (1024 * 1024);
  if (fileSizeMB > maxSizeMB) {
    return { url: null, error: `Ukuran file maksimal ${maxSizeMB}MB` };
  }

  return uploadFile(file, path);
}

// =====================================================
// DELETE FUNCTIONS
// =====================================================

export async function deleteFile(
  fileUrl: string
): Promise<{ success: boolean; error: string | null }> {
  const supabase = createClient();

  try {
    // Extract file path from URL
    const url = new URL(fileUrl);
    const pathParts = url.pathname.split(`/${BUCKET_NAME}/`);

    if (pathParts.length < 2) {
      return { success: false, error: 'Invalid file URL' };
    }

    const filePath = pathParts[1];

    // Delete file
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (error) {
      console.error('Error deleting file:', error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Error deleting file:', error);
    return { success: false, error: 'Failed to delete file' };
  }
}

// =====================================================
// SPECIFIC UPLOAD FUNCTIONS
// =====================================================

export async function uploadLogo(file: File) {
  return uploadImage(file, STORAGE_PATHS.LOGOS, 1);
}

export async function uploadSlideImage(file: File) {
  return uploadImage(file, STORAGE_PATHS.SLIDES, 2);
}

export async function uploadArticleImage(file: File) {
  return uploadImage(file, STORAGE_PATHS.ARTICLES, 2);
}

export async function uploadStructurePhoto(file: File) {
  return uploadImage(file, STORAGE_PATHS.STRUCTURE, 2);
}

// =====================================================
// IMAGE OPTIMIZATION
// =====================================================

export function getOptimizedImageUrl(
  url: string,
  options?: {
    width?: number;
    height?: number;
    quality?: number;
  }
): string {
  if (!url) return '';

  // If using Supabase Storage, we can add transformation params
  // Note: This requires Supabase Pro plan for image transformations
  // For free tier, return original URL

  const { width, height, quality = 80 } = options || {};

  // Example transformation URL (if using Pro plan):
  // return `${url}?width=${width}&height=${height}&quality=${quality}`;

  return url;
}

// =====================================================
// BATCH OPERATIONS
// =====================================================

export async function uploadMultipleFiles(
  files: File[],
  path: string
): Promise<{ urls: string[]; errors: string[] }> {
  const results = await Promise.all(
    files.map(file => uploadFile(file, path))
  );

  const urls = results
    .filter(result => result.url !== null)
    .map(result => result.url!);

  const errors = results
    .filter(result => result.error !== null)
    .map(result => result.error!);

  return { urls, errors };
}

export async function deleteMultipleFiles(
  fileUrls: string[]
): Promise<{ successCount: number; errorCount: number }> {
  const results = await Promise.all(
    fileUrls.map(url => deleteFile(url))
  );

  const successCount = results.filter(result => result.success).length;
  const errorCount = results.filter(result => !result.success).length;

  return { successCount, errorCount };
}

// =====================================================
// FILE VALIDATION
// =====================================================

export function validateImageFile(file: File): {
  valid: boolean;
  error?: string;
} {
  // Check file type
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'File harus berupa gambar' };
  }

  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return { valid: false, error: 'Ukuran file maksimal 5MB' };
  }

  // Check file extension
  const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
  const extension = file.name.split('.').pop()?.toLowerCase();

  if (!extension || !allowedExtensions.includes(extension)) {
    return {
      valid: false,
      error: 'Format file harus JPG, PNG, GIF, atau WebP'
    };
  }

  return { valid: true };
}

// =====================================================
// HELPER TO CREATE BUCKET (Run once during setup)
// =====================================================

export async function setupStorageBucket() {
  const supabase = createClient();

  // Create bucket if it doesn't exist
  const { data, error } = await supabase.storage.createBucket(BUCKET_NAME, {
    public: true,
    fileSizeLimit: 5242880, // 5MB
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
  });

  if (error && error.message !== 'Bucket already exists') {
    console.error('Error creating bucket:', error);
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}
