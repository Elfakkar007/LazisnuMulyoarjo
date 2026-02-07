'use client';

import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { uploadArticleImage, deleteFile } from '@/lib/utils/storage';

interface ImageUploadProps {
    value: string | null;
    onChange: (url: string | null) => void;
    label?: string;
    aspectRatio?: string;
    maxSizeMB?: number;
}

export function ImageUpload({
    value,
    onChange,
    label = 'Upload Image',
    aspectRatio = '16:9',
    maxSizeMB = 2
}: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setError(null);
        setUploading(true);

        try {
            // Validate file size
            const fileSizeMB = file.size / (1024 * 1024);
            if (fileSizeMB > maxSizeMB) {
                setError(`Ukuran file maksimal ${maxSizeMB}MB`);
                setUploading(false);
                return;
            }

            // Upload to Supabase
            const { url, error: uploadError } = await uploadArticleImage(file);

            if (uploadError || !url) {
                setError(uploadError || 'Gagal mengupload gambar');
                setUploading(false);
                return;
            }

            // Delete old image if exists
            if (value) {
                await deleteFile(value);
            }

            onChange(url);
        } catch (err) {
            console.error('Upload error:', err);
            setError('Terjadi kesalahan saat upload');
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleRemove = async () => {
        if (!value) return;

        const confirmed = confirm('Hapus gambar ini?');
        if (!confirmed) return;

        await deleteFile(value);
        onChange(null);
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
                {label}
            </label>

            {value ? (
                <div className="relative group">
                    <div className={`relative w-full overflow-hidden rounded-lg border-2 border-gray-200`}
                        style={{ paddingBottom: aspectRatio === '16:9' ? '56.25%' : '100%' }}
                    >
                        <Image
                            src={value}
                            alt="Preview"
                            fill
                            className="object-cover"
                        />
                    </div>

                    <button
                        type="button"
                        onClick={handleRemove}
                        className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ) : (
                <div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        disabled={uploading}
                    />

                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-emerald-500 hover:bg-emerald-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <div className="flex flex-col items-center gap-3">
                            {uploading ? (
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600" />
                            ) : (
                                <Upload className="w-12 h-12 text-gray-400" />
                            )}

                            <div className="text-center">
                                <p className="text-sm font-semibold text-gray-700">
                                    {uploading ? 'Mengupload...' : 'Klik untuk upload'}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    PNG, JPG, WebP (max {maxSizeMB}MB)
                                </p>
                                {aspectRatio && (
                                    <p className="text-xs text-gray-500">
                                        Rekomendasi: Ratio {aspectRatio}
                                    </p>
                                )}
                            </div>
                        </div>
                    </button>
                </div>
            )}

            {error && (
                <p className="text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}