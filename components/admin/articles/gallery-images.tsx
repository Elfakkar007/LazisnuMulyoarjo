'use client';

import { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { Upload, X, GripVertical, Plus } from 'lucide-react';
import Image from 'next/image';
import { uploadArticleImage, deleteFile } from '@/lib/utils/storage';

export interface GalleryImage {
    id: string;
    image_url: string;
    caption: string;
    image_order: number;
}

interface GalleryImagesProps {
    value: GalleryImage[];
    onChange: (images: GalleryImage[]) => void;
}

export function GalleryImages({ value, onChange }: GalleryImagesProps) {
    const [uploading, setUploading] = useState(false);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        setUploading(true);

        try {
            const uploadPromises = files.map(file => uploadArticleImage(file));
            const results = await Promise.all(uploadPromises);

            const newImages: GalleryImage[] = results
                .filter(result => result.url)
                .map((result, index) => ({
                    id: crypto.randomUUID(),
                    image_url: result.url!,
                    caption: '',
                    image_order: value.length + index,
                }));

            onChange([...value, ...newImages]);
        } catch (err) {
            console.error('Upload error:', err);
            alert('Gagal mengupload beberapa gambar');
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleRemove = async (index: number) => {
        const confirmed = confirm('Hapus gambar ini?');
        if (!confirmed) return;

        const image = value[index];
        await deleteFile(image.image_url);

        const newImages = value.filter((_, i) => i !== index);
        // Reorder
        newImages.forEach((img, i) => {
            img.image_order = i;
        });
        onChange(newImages);
    };

    const handleCaptionChange = (index: number, caption: string) => {
        const newImages = [...value];
        newImages[index].caption = caption;
        onChange(newImages);
    };

    const handleDragStart = (index: number) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (e: DragEvent, index: number) => {
        e.preventDefault();

        if (draggedIndex === null || draggedIndex === index) return;

        const newImages = [...value];
        const draggedItem = newImages[draggedIndex];

        newImages.splice(draggedIndex, 1);
        newImages.splice(index, 0, draggedItem);

        // Update order
        newImages.forEach((img, i) => {
            img.image_order = i;
        });

        onChange(newImages);
        setDraggedIndex(index);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-gray-700">
                    Galeri Foto
                </label>

                <div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                        disabled={uploading}
                    />

                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        {uploading ? 'Uploading...' : 'Tambah Foto'}
                    </button>
                </div>
            </div>

            {value.length === 0 ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <p className="text-sm text-gray-500">
                        Belum ada foto. Klik tombol "Tambah Foto" untuk upload.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {value
                        .sort((a, b) => a.image_order - b.image_order)
                        .map((image, index) => (
                            <div
                                key={image.id}
                                draggable
                                onDragStart={() => handleDragStart(index)}
                                onDragOver={(e) => handleDragOver(e, index)}
                                onDragEnd={handleDragEnd}
                                className={`bg-white border-2 rounded-lg overflow-hidden transition-all ${draggedIndex === index
                                    ? 'border-emerald-500 shadow-lg opacity-50'
                                    : 'border-gray-200'
                                    }`}
                            >
                                <div className="relative group">
                                    {/* Drag Handle */}
                                    <div className="absolute top-2 left-2 z-10 bg-black/50 text-white p-2 rounded cursor-move">
                                        <GripVertical className="w-4 h-4" />
                                    </div>

                                    {/* Remove Button */}
                                    <button
                                        type="button"
                                        onClick={() => handleRemove(index)}
                                        className="absolute top-2 right-2 z-10 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>

                                    {/* Image */}
                                    <div className="relative w-full h-48">
                                        <Image
                                            src={image.image_url}
                                            alt={image.caption || `Photo ${index + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </div>

                                {/* Caption Input */}
                                <div className="p-3">
                                    <input
                                        type="text"
                                        value={image.caption}
                                        onChange={(e) => handleCaptionChange(index, e.target.value)}
                                        placeholder="Caption (opsional)"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    />
                                </div>
                            </div>
                        ))}
                </div>
            )}

            <p className="text-xs text-gray-500">
                💡 Drag & drop untuk mengubah urutan foto
            </p>
        </div>
    );
}