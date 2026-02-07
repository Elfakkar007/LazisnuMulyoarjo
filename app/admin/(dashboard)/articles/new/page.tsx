// =====================================================
// CREATE ARTICLE PAGE
// File: app/admin/(dashboard)/articles/new/page.tsx
// =====================================================

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import Link from 'next/link';
import { RichTextEditor } from '@/components/admin/articles/rich-text-editor';
import { ImageUpload } from '@/components/admin/articles/image-upload';
import { GalleryImages, type GalleryImage } from '@/components/admin/articles/gallery-images';
import { createArticle } from '@/lib/actions/admin';
import { generateSlug } from '@/lib/utils/helpers';
import { createClient } from '@/utils/supabase/client';

const CATEGORIES = ['Sosial', 'Kesehatan', 'Keagamaan'];

export default function NewArticlePage() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        category: 'Sosial' as const,
        excerpt: '',
        content: '',
        featured_image_url: null as string | null,
        activity_date: new Date().toISOString().split('T')[0],
        location: '',
        is_published: false,
    });
    const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);

    const handleTitleChange = (title: string) => {
        setFormData({
            ...formData,
            title,
            slug: generateSlug(title),
        });
    };

    const handleSubmit = async (e: React.FormEvent, publish: boolean = false) => {
        e.preventDefault();

        if (saving) return;

        // Validation
        if (!formData.title.trim()) {
            alert('Judul harus diisi');
            return;
        }

        if (!formData.content.trim()) {
            alert('Konten harus diisi');
            return;
        }

        setSaving(true);

        try {
            // Create article
            const articleData = {
                ...formData,
                is_published: publish,
                published_at: publish ? new Date().toISOString() : null,
            };

            const result = await createArticle(articleData);

            if (!result.success) {
                alert(`Gagal menyimpan: ${result.error}`);
                setSaving(false);
                return;
            }

            // Get the created article ID
            // We need to fetch it since createArticle doesn't return the ID
            const supabase = createClient();
            const { data: article } = await supabase
                .from('activity_articles')
                .select('id')
                .eq('slug', formData.slug)
                .single();

            if (!article) {
                alert('Artikel tersimpan tapi gagal mendapatkan ID');
                router.push('/admin/articles');
                return;
            }

            // Save gallery images
            if (galleryImages.length > 0) {
                const imagePromises = galleryImages.map(img =>
                    supabase.from('activity_images').insert({
                        article_id: article.id,
                        image_url: img.image_url,
                        caption: img.caption,
                        image_order: img.image_order,
                    })
                );

                await Promise.all(imagePromises);
            }

            alert(publish ? 'Artikel berhasil dipublikasi!' : 'Artikel berhasil disimpan sebagai draft!');
            router.push('/admin/articles');
        } catch (error) {
            console.error('Submit error:', error);
            alert('Terjadi kesalahan saat menyimpan');
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/articles"
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Buat Artikel Baru</h1>
                        <p className="text-gray-600 mt-1">Tulis dan publikasikan artikel kegiatan</p>
                    </div>
                </div>
            </div>

            <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Main Fields */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Title */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Judul Artikel *
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => handleTitleChange(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-lg font-semibold"
                                placeholder="Masukkan judul artikel..."
                                required
                            />

                            {formData.slug && (
                                <p className="text-sm text-gray-500 mt-2">
                                    Slug: <span className="font-mono text-emerald-600">{formData.slug}</span>
                                </p>
                            )}
                        </div>

                        {/* Content */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Konten Artikel *
                            </label>
                            <RichTextEditor
                                content={formData.content}
                                onChange={(html) => setFormData({ ...formData, content: html })}
                                placeholder="Tulis konten artikel di sini..."
                            />
                        </div>

                        {/* Featured Image */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <ImageUpload
                                value={formData.featured_image_url}
                                onChange={(url) => setFormData({ ...formData, featured_image_url: url })}
                                label="Gambar Utama"
                                aspectRatio="16:9"
                            />
                        </div>

                        {/* Gallery */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <GalleryImages
                                value={galleryImages}
                                onChange={setGalleryImages}
                            />
                        </div>
                    </div>

                    {/* Right Column - Metadata */}
                    <div className="space-y-6">
                        {/* Category & Date */}
                        <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Kategori *
                                </label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                    required
                                >
                                    {CATEGORIES.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Tanggal Kegiatan *
                                </label>
                                <input
                                    type="date"
                                    value={formData.activity_date}
                                    onChange={(e) => setFormData({ ...formData, activity_date: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Lokasi Kegiatan
                                </label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                    placeholder="Contoh: Balai Desa Mulyoarjo"
                                />
                            </div>
                        </div>

                        {/* Excerpt */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Ringkasan (Excerpt)
                            </label>
                            <textarea
                                value={formData.excerpt}
                                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                rows={4}
                                maxLength={200}
                                placeholder="Tulis ringkasan singkat artikel (max 200 karakter)"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                {formData.excerpt.length}/200 karakter
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="bg-white rounded-xl shadow-md p-6 space-y-3">
                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-300 text-white px-4 py-3 rounded-lg font-semibold transition-colors"
                            >
                                <Save className="w-5 h-5" />
                                {saving ? 'Menyimpan...' : 'Simpan sebagai Draft'}
                            </button>

                            <button
                                type="button"
                                onClick={(e) => handleSubmit(e, true)}
                                disabled={saving}
                                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white px-4 py-3 rounded-lg font-semibold transition-colors"
                            >
                                <Eye className="w-5 h-5" />
                                {saving ? 'Menyimpan...' : 'Publish Artikel'}
                            </button>

                            <Link
                                href="/admin/articles"
                                className="block w-full text-center bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-4 py-3 rounded-lg font-semibold transition-colors"
                            >
                                Batal
                            </Link>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}