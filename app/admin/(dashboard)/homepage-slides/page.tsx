// =====================================================
// HOMEPAGE SLIDES MANAGEMENT PAGE - WITH IMAGE UPLOAD
// File: app/admin/(dashboard)/homepage-slides/page.tsx
// =====================================================

'use client';

import { useState, useEffect } from 'react';
import { motion, Reorder } from 'framer-motion';
import {
    Plus,
    Edit,
    Trash2,
    Save,
    X,
    GripVertical,
    Eye,
    EyeOff,
    Image as ImageIcon,
    AlertCircle,
    Upload,
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import {
    createHomepageSlide,
    updateHomepageSlide,
    deleteHomepageSlide,
    reorderHomepageSlides,
} from '@/lib/actions/admin';
import { uploadSlideImage, deleteFile } from '@/lib/utils/storage';
import { useToast } from '@/components/ui/toast-provider';
import { useConfirm } from '@/components/ui/confirmation-modal';
import Image from 'next/image';

interface HomepageSlide {
    id: string;
    badge: string;
    title: string;
    detail: string | null;
    background_gradient: string | null;
    image_url: string | null;
    link_url: string | null;
    slide_order: number;
    is_active: boolean;
    created_at: string;
}

const PREDEFINED_GRADIENTS = [
    {
        name: 'Emerald to Teal',
        value: 'from-emerald-800 via-emerald-600 to-teal-700',
        preview: 'linear-gradient(to bottom right, #065f46, #059669, #0f766e)',
    },
    {
        name: 'Blue to Cyan',
        value: 'from-blue-800 via-blue-600 to-cyan-700',
        preview: 'linear-gradient(to bottom right, #1e40af, #2563eb, #0e7490)',
    },
    {
        name: 'Purple to Pink',
        value: 'from-purple-800 via-purple-600 to-pink-700',
        preview: 'linear-gradient(to bottom right, #6b21a8, #9333ea, #be185d)',
    },
    {
        name: 'Orange to Red',
        value: 'from-orange-800 via-orange-600 to-red-700',
        preview: 'linear-gradient(to bottom right, #9a3412, #ea580c, #b91c1c)',
    },
    {
        name: 'Indigo to Blue',
        value: 'from-indigo-800 via-indigo-600 to-blue-700',
        preview: 'linear-gradient(to bottom right, #3730a3, #4f46e5, #1d4ed8)',
    },
];

const MAX_ACTIVE_SLIDES = 5;

export default function HomepageSlidesPage() {
    const [slides, setSlides] = useState<HomepageSlide[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        badge: '',
        title: '',
        detail: '',
        background_gradient: PREDEFINED_GRADIENTS[0].value,
        image_url: '',
        link_url: '',
        is_active: true,
    });
    const [submitting, setSubmitting] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const { toast, success, error } = useToast();
    const { confirm } = useConfirm();

    useEffect(() => {
        loadSlides();
    }, []);

    const loadSlides = async () => {
        setLoading(true);
        const supabase = createClient();

        const { data, error: fetchError } = await supabase
            .from('homepage_slides')
            .select('*')
            .order('slide_order', { ascending: true });

        if (fetchError) {
            console.error('Error loading slides:', fetchError);
            error('Gagal memuat data slides');
        } else {
            setSlides(data || []);
        }

        setLoading(false);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('File harus berupa gambar');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Ukuran file maksimal 5MB');
            return;
        }

        setUploadingImage(true);

        try {
            const { url, error: uploadError } = await uploadSlideImage(file);

            if (uploadError || !url) {
                error(`Gagal upload gambar: ${uploadError}`);
                return;
            }

            // If editing and there's an old image, delete it
            if (editingId && formData.image_url) {
                await deleteFile(formData.image_url);
            }

            setFormData({ ...formData, image_url: url });
            setImagePreview(url);
        } catch (err) {
            console.error('Error uploading image:', err);
            error('Terjadi kesalahan saat upload gambar');
        } finally {
            setUploadingImage(false);
        }
    };

    const handleRemoveImage = async () => {
        if (!formData.image_url) return;

        const isConfirmed = await confirm({
            title: 'Hapus Gambar',
            message: 'Hapus gambar ini?',
            confirmText: 'Hapus',
            variant: 'danger'
        });

        if (isConfirmed) {
            // If it's an existing slide, just remove from form (don't delete from storage yet)
            // Delete will happen on save
            setFormData({ ...formData, image_url: '' });
            setImagePreview(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (submitting) return;

        // Validation
        if (!formData.badge.trim() || !formData.title.trim()) {
            error('Badge dan Judul harus diisi');
            return;
        }

        // Check active slides limit when creating new active slide
        if (!editingId && formData.is_active) {
            const activeCount = slides.filter(s => s.is_active).length;
            if (activeCount >= MAX_ACTIVE_SLIDES) {
                error(`Maksimal ${MAX_ACTIVE_SLIDES} slide aktif. Nonaktifkan slide lain terlebih dahulu.`);
                return;
            }
        }

        setSubmitting(true);

        try {
            let result;
            if (editingId) {
                result = await updateHomepageSlide(editingId, formData);
            } else {
                // Set slide_order to next available
                const maxOrder = slides.reduce((max, s) => Math.max(max, s.slide_order), 0);
                result = await createHomepageSlide({
                    ...formData,
                    slide_order: maxOrder + 1,
                });
            }

            if (result.success) {
                await loadSlides();
                resetForm();
                success(editingId ? 'Slide berhasil diupdate!' : 'Slide berhasil ditambahkan!');
            } else {
                error(`Gagal menyimpan: ${(result as any).message}`);
            }
        } catch (err) {
            console.error('Submit error:', err);
            error('Terjadi kesalahan');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (slide: HomepageSlide) => {
        setEditingId(slide.id);
        setFormData({
            badge: slide.badge,
            title: slide.title,
            detail: slide.detail || '',
            background_gradient: slide.background_gradient || PREDEFINED_GRADIENTS[0].value,
            image_url: slide.image_url || '',
            link_url: slide.link_url || '',
            is_active: slide.is_active,
        });
        setImagePreview(slide.image_url);
        setShowForm(true);
    };

    const handleDelete = async (slide: HomepageSlide) => {
        const isConfirmed = await confirm({
            title: 'Hapus Slide',
            message: `Hapus slide "${slide.title}"?`,
            confirmText: 'Hapus',
            variant: 'danger'
        });

        if (!isConfirmed) return;

        setSubmitting(true);

        // Delete image if exists
        if (slide.image_url) {
            await deleteFile(slide.image_url);
        }

        const result = await deleteHomepageSlide(slide.id);

        if (result.success) {
            await loadSlides();
            success('Slide berhasil dihapus');
        } else {
            error(`Gagal menghapus: ${(result as any).message}`);
        }
        setSubmitting(false);
    };

    const handleToggleActive = async (slide: HomepageSlide) => {
        // Check limit when activating
        if (!slide.is_active) {
            const activeCount = slides.filter(s => s.is_active).length;
            if (activeCount >= MAX_ACTIVE_SLIDES) {
                error(`Maksimal ${MAX_ACTIVE_SLIDES} slide aktif`);
                return;
            }
        }

        setSubmitting(true);
        const result = await updateHomepageSlide(slide.id, {
            is_active: !slide.is_active,
        });

        if (result.success) {
            await loadSlides();
        } else {
            alert(`Gagal update: ${(result as any).message}`);
        }
        setSubmitting(false);
    };

    const handleReorder = async (newOrder: HomepageSlide[]) => {
        // Update local state immediately for smooth UX
        setSlides(newOrder);

        // Update slide_order in database
        const updates = newOrder.map((slide, index) => ({
            id: slide.id,
            slide_order: index,
        }));

        const result = await reorderHomepageSlides(updates);

        if (!result.success) {
            error('Gagal menyimpan urutan');
            await loadSlides(); // Reload to revert
        }
    };

    const resetForm = () => {
        setFormData({
            badge: '',
            title: '',
            detail: '',
            background_gradient: PREDEFINED_GRADIENTS[0].value,
            image_url: '',
            link_url: '',
            is_active: true,
        });
        setEditingId(null);
        setShowForm(false);
        setImagePreview(null);
    };

    const activeSlides = slides.filter(s => s.is_active);
    const inactiveSlides = slides.filter(s => !s.is_active);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Memuat data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Homepage Slides</h1>
                    <p className="text-gray-600 mt-1">
                        Kelola carousel homepage (max {MAX_ACTIVE_SLIDES} slide aktif) - Gunakan gambar 16:9 untuk hasil terbaik
                    </p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    disabled={!showForm && activeSlides.length >= MAX_ACTIVE_SLIDES}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Tambah Slide
                </button>
            </div>

            {/* Warning if limit reached */}
            {activeSlides.length >= MAX_ACTIVE_SLIDES && !showForm && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-semibold text-amber-900">
                            Batas Maksimal Tercapai
                        </p>
                        <p className="text-sm text-amber-700 mt-1">
                            Maksimal {MAX_ACTIVE_SLIDES} slide aktif. Nonaktifkan slide lain untuk menambah yang baru.
                        </p>
                    </div>
                </div>
            )}

            {/* Form */}
            {showForm && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-md p-6 border-2 border-emerald-200"
                >
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                        {editingId ? 'Edit Slide' : 'Tambah Slide Baru'}
                    </h3>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Image Upload Section */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Gambar Slide (16:9 Ratio) - Rekomendasi: 1920x1080px
                            </label>

                            {imagePreview ? (
                                <div className="relative w-full aspect-video rounded-lg overflow-hidden border-2 border-gray-200">
                                    <Image
                                        src={imagePreview}
                                        alt="Preview"
                                        fill
                                        className="object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <div className="relative">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        disabled={uploadingImage}
                                        className="hidden"
                                        id="image-upload"
                                    />
                                    <label
                                        htmlFor="image-upload"
                                        className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-emerald-500 transition-colors bg-gray-50"
                                    >
                                        {uploadingImage ? (
                                            <div className="text-center">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-2"></div>
                                                <p className="text-sm text-gray-600">Uploading...</p>
                                            </div>
                                        ) : (
                                            <>
                                                <Upload className="w-12 h-12 text-gray-400 mb-2" />
                                                <p className="text-sm text-gray-600">
                                                    Klik untuk upload gambar
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    PNG, JPG, WebP (max 5MB)
                                                </p>
                                            </>
                                        )}
                                    </label>
                                </div>
                            )}

                            <p className="text-xs text-gray-500 mt-2">
                                Jika tidak ada gambar, akan menggunakan background gradient sebagai fallback
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Badge */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Badge *
                                </label>
                                <input
                                    type="text"
                                    value={formData.badge}
                                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                    placeholder="KEGIATAN, SOSIAL, INFO"
                                    maxLength={50}
                                    required
                                />
                            </div>

                            {/* Background Gradient (Fallback) */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Background Gradient (Fallback) *
                                </label>
                                <select
                                    value={formData.background_gradient}
                                    onChange={(e) => setFormData({ ...formData, background_gradient: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                    required
                                >
                                    {PREDEFINED_GRADIENTS.map(gradient => (
                                        <option key={gradient.value} value={gradient.value}>
                                            {gradient.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Title */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Judul Slide *
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                placeholder="Contoh: Santunan Anak Yatim Ramadan 1446 H"
                                maxLength={200}
                                required
                            />
                        </div>

                        {/* Detail */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Detail (Tanggal • Lokasi)
                            </label>
                            <input
                                type="text"
                                value={formData.detail}
                                onChange={(e) => setFormData({ ...formData, detail: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                placeholder="15 Maret 2025 • Balai Desa Mulyoarjo"
                                maxLength={200}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Format: Tanggal • Lokasi (gunakan bullet • untuk pemisah)
                            </p>
                        </div>

                        {/* Link URL */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Link URL (Opsional)
                            </label>
                            <input
                                type="url"
                                value={formData.link_url}
                                onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                placeholder="https://... atau /kegiatan/slug-artikel"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Link untuk tombol "Selengkapnya". Kosongkan jika tidak perlu.
                            </p>
                        </div>

                        {/* Preview */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Preview Slide
                            </label>
                            <div className="relative h-48 rounded-lg overflow-hidden">
                                {imagePreview ? (
                                    <>
                                        <Image
                                            src={imagePreview}
                                            alt="Preview"
                                            fill
                                            className="object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
                                    </>
                                ) : (
                                    <div className={`absolute inset-0 bg-gradient-to-br ${formData.background_gradient}`} />
                                )}

                                <div className="relative h-full flex items-center p-6">
                                    <div>
                                        <span className="inline-block text-xs font-bold uppercase bg-white/20 px-3 py-1 rounded-full text-white mb-2">
                                            {formData.badge || 'BADGE'}
                                        </span>
                                        <p className="text-xl font-bold text-white drop-shadow-lg">
                                            {formData.title || 'Judul Slide'}
                                        </p>
                                        {formData.detail && (
                                            <p className="text-sm text-white/90 mt-2">
                                                {formData.detail}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Active Status */}
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="is_active"
                                checked={formData.is_active}
                                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                            />
                            <label htmlFor="is_active" className="text-sm font-semibold text-gray-700">
                                Aktif (tampilkan di homepage)
                            </label>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-2 pt-4">
                            <button
                                type="submit"
                                disabled={submitting || uploadingImage}
                                className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                            >
                                {submitting ? 'Menyimpan...' : editingId ? 'Update' : 'Simpan'}
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-semibold transition-colors"
                            >
                                Batal
                            </button>
                        </div>
                    </form>
                </motion.div>
            )}

            {/* Active Slides - Draggable */}
            <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Eye className="w-5 h-5 text-emerald-600" />
                    Slide Aktif ({activeSlides.length}/{MAX_ACTIVE_SLIDES})
                </h3>

                {activeSlides.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">
                        Belum ada slide aktif
                    </p>
                ) : (
                    <Reorder.Group
                        axis="y"
                        values={slides}
                        onReorder={handleReorder}
                        className="space-y-3"
                    >
                        {activeSlides.map(slide => (
                            <Reorder.Item
                                key={slide.id}
                                value={slide}
                                className="cursor-move"
                            >
                                <SlideCard
                                    slide={slide}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                    onToggleActive={handleToggleActive}
                                    disabled={submitting}
                                />
                            </Reorder.Item>
                        ))}
                    </Reorder.Group>
                )}
            </div>

            {/* Inactive Slides */}
            {inactiveSlides.length > 0 && (
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <EyeOff className="w-5 h-5 text-gray-400" />
                        Slide Nonaktif ({inactiveSlides.length})
                    </h3>

                    <div className="space-y-3">
                        {inactiveSlides.map(slide => (
                            <SlideCard
                                key={slide.id}
                                slide={slide}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onToggleActive={handleToggleActive}
                                disabled={submitting}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Instructions */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <h4 className="text-sm font-bold text-blue-900 mb-2">Petunjuk:</h4>
                <ul className="text-xs text-blue-800 space-y-1">
                    <li>• Upload gambar dengan rasio 16:9 (rekomendasi: 1920x1080px) untuk hasil terbaik</li>
                    <li>• Gambar akan otomatis di-crop dan di-scale untuk fit container</li>
                    <li>• Jika tidak ada gambar, akan menggunakan background gradient sebagai fallback</li>
                    <li>• Drag & drop slide aktif untuk mengubah urutan</li>
                    <li>• Maksimal {MAX_ACTIVE_SLIDES} slide dapat aktif bersamaan</li>
                    <li>• Badge: teks pendek untuk kategori (mis: KEGIATAN, SOSIAL)</li>
                    <li>• Detail: format tanggal dan lokasi dengan pemisah bullet (•)</li>
                    <li>• Link URL bersifat opsional untuk tombol "Selengkapnya"</li>
                </ul>
            </div>
        </div>
    );
}

// =====================================================
// SLIDE CARD COMPONENT
// =====================================================

interface SlideCardProps {
    slide: HomepageSlide;
    onEdit: (slide: HomepageSlide) => void;
    onDelete: (slide: HomepageSlide) => void;
    onToggleActive: (slide: HomepageSlide) => void;
    disabled: boolean;
}

function SlideCard({ slide, onEdit, onDelete, onToggleActive, disabled }: SlideCardProps) {
    return (
        <div
            className={`rounded-lg overflow-hidden border-2 ${slide.is_active ? 'border-emerald-300' : 'border-gray-300'
                } transition-all`}
        >
            <div className="flex items-start gap-4 p-4">
                {/* Drag Handle */}
                {slide.is_active && (
                    <div className="cursor-move text-gray-400 hover:text-gray-600 transition-colors pt-1">
                        <GripVertical className="w-6 h-6" />
                    </div>
                )}

                {/* Preview Image/Gradient */}
                <div className="relative w-48 aspect-video rounded overflow-hidden flex-shrink-0">
                    {slide.image_url ? (
                        <>
                            <Image
                                src={slide.image_url}
                                alt={slide.title}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
                        </>
                    ) : (
                        <div className={`absolute inset-0 bg-gradient-to-br ${slide.background_gradient}`} />
                    )}

                    <div className="absolute inset-0 flex items-center p-3">
                        <div>
                            <span className="inline-block text-[10px] font-bold uppercase bg-white/20 px-2 py-0.5 rounded-full text-white">
                                {slide.badge}
                            </span>
                            <p className="text-xs font-bold text-white mt-1 line-clamp-2">
                                {slide.title}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content Info */}
                <div className="flex-1">
                    <span className="inline-block text-xs font-bold uppercase bg-emerald-100 text-emerald-700 px-2 py-1 rounded mb-2">
                        {slide.badge}
                    </span>
                    <h4 className="text-base font-bold text-gray-900 mb-1">{slide.title}</h4>
                    {slide.detail && (
                        <p className="text-sm text-gray-600">{slide.detail}</p>
                    )}
                    {slide.link_url && (
                        <p className="text-xs text-gray-500 mt-2">
                            🔗 {slide.link_url}
                        </p>
                    )}
                    {slide.image_url && (
                        <p className="text-xs text-emerald-600 mt-1">
                            📸 Menggunakan gambar
                        </p>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                    <button
                        onClick={() => onToggleActive(slide)}
                        disabled={disabled}
                        className={`p-2 rounded-lg transition-colors ${slide.is_active
                            ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                            }`}
                        title={slide.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                    >
                        {slide.is_active ? (
                            <Eye className="w-4 h-4" />
                        ) : (
                            <EyeOff className="w-4 h-4" />
                        )}
                    </button>
                    <button
                        onClick={() => onEdit(slide)}
                        disabled={disabled}
                        className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
                        title="Edit"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onDelete(slide)}
                        disabled={disabled}
                        className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                        title="Hapus"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}