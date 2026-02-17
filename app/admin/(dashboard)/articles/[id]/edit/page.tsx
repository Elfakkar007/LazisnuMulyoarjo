// =====================================================
// EDIT ARTICLE PAGE
// File: app/admin/(dashboard)/articles/[id]/edit/page.tsx
// =====================================================

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Eye, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { RichTextEditor } from '@/components/admin/articles/rich-text-editor';
import { ImageUpload } from '@/components/admin/articles/image-upload';
import { GalleryImages, type GalleryImage } from '@/components/admin/articles/gallery-images';
import { getArticleById } from '@/lib/api/client-admin';
import { updateArticle } from '@/lib/actions/admin';
import { generateSlug } from '@/lib/utils/helpers';
import { createClient } from '@/utils/supabase/client';

const CATEGORIES = ['Sosial', 'Kesehatan', 'Keagamaan'];

import { useParams } from 'next/navigation';

export default function EditArticlePage() {
    const params = useParams();
    const id = params.id as string;
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        category: 'Sosial' as const,
        excerpt: '',
        content: '',
        featured_image_url: null as string | null,
        activity_date: '',
        location: '',
        is_published: false,
    });
    const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
    const [originalSlug, setOriginalSlug] = useState('');

    useEffect(() => {
        if (id) {
            loadArticle();
        }
    }, [id]);

    const loadArticle = async () => {
        const article = await getArticleById(id); // Use destructured id

        if (!article) {
            alert('Artikel tidak ditemukan');
            router.push('/admin/articles');
            return;
        }

        setFormData({
            title: article.title,
            slug: article.slug,
            category: article.category,
            excerpt: article.excerpt || '',
            content: article.content,
            featured_image_url: article.featured_image_url,
            activity_date: article.activity_date,
            location: article.location || '',
            is_published: article.is_published,
        });

        setOriginalSlug(article.slug);

        if (article.images) {
            setGalleryImages(article.images.sort((a: any, b: any) => a.image_order - b.image_order));
        }

        setLoading(false);
    };

    const handleTitleChange = (title: string) => {
        setFormData({
            ...formData,
            title,
            slug: generateSlug(title),
        });
    };

    const handleSubmit = async (e: React.FormEvent, publish?: boolean) => {
        e.preventDefault();

        if (saving) return;

        if (!formData.title.trim() || !formData.content.trim()) {
            alert('Judul dan konten harus diisi');
            return;
        }

        setSaving(true);

        try {
            const supabase = createClient();

            // Update article
            const articleData: any = {
                ...formData,
                is_published: publish !== undefined ? publish : formData.is_published,
            };

            const result = await updateArticle(id, articleData);

            if (!result.success) {
                alert(`Gagal menyimpan: ${(result as any).message}`);
                setSaving(false);
                return;
            }

            // Delete old gallery images
            await supabase
                .from('activity_images')
                .delete()
                .eq('article_id', id);

            // Save new gallery images
            if (galleryImages.length > 0) {
                const imagePromises = galleryImages.map(img =>
                    supabase.from('activity_images').insert({
                        article_id: id,
                        image_url: img.image_url,
                        caption: img.caption,
                        image_order: img.image_order,
                    })
                );

                await Promise.all(imagePromises);
            }

            alert('Artikel berhasil diupdate!');
            router.push('/admin/articles');
        } catch (error) {
            console.error('Submit error:', error);
            alert('Terjadi kesalahan');
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-emerald-600 mx-auto mb-4" />
                    <p className="text-gray-600">Memuat artikel...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/articles" className="p-2 hover:bg-gray-100 rounded-lg">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Edit Artikel</h1>
                        <p className="text-gray-600 mt-1">{formData.title}</p>
                    </div>
                </div>
            </div>

            <form onSubmit={(e) => handleSubmit(e)} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Judul Artikel *</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => handleTitleChange(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-lg font-semibold"
                                required
                            />
                            {formData.slug && (
                                <p className="text-sm text-gray-500 mt-2">Slug: <span className="font-mono text-emerald-600">{formData.slug}</span></p>
                            )}
                        </div>

                        <div className="bg-white rounded-xl shadow-md p-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Konten *</label>
                            <RichTextEditor
                                content={formData.content}
                                onChange={(html) => setFormData({ ...formData, content: html })}
                            />
                        </div>

                        <div className="bg-white rounded-xl shadow-md p-6">
                            <ImageUpload
                                value={formData.featured_image_url}
                                onChange={(url) => setFormData({ ...formData, featured_image_url: url })}
                                label="Gambar Utama"
                            />
                        </div>

                        <div className="bg-white rounded-xl shadow-md p-6">
                            <GalleryImages value={galleryImages} onChange={setGalleryImages} />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Kategori *</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                    required
                                >
                                    {CATEGORIES.map(cat => (<option key={cat} value={cat}>{cat}</option>))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Tanggal *</label>
                                <input
                                    type="date"
                                    value={formData.activity_date}
                                    onChange={(e) => setFormData({ ...formData, activity_date: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Lokasi</label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                />
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-md p-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Excerpt</label>
                            <textarea
                                value={formData.excerpt}
                                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                rows={4}
                                maxLength={200}
                            />
                            <p className="text-xs text-gray-500 mt-2">{formData.excerpt.length}/200</p>
                        </div>

                        <div className="bg-white rounded-xl shadow-md p-6 space-y-3">
                            <button type="submit" disabled={saving} className="w-full flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-300 text-white px-4 py-3 rounded-lg font-semibold">
                                <Save className="w-5 h-5" />
                                {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </button>

                            {!formData.is_published && (
                                <button type="button" onClick={(e) => handleSubmit(e, true)} disabled={saving} className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white px-4 py-3 rounded-lg font-semibold">
                                    <Eye className="w-5 h-5" />
                                    Publish
                                </button>
                            )}

                            <Link href="/admin/articles" className="block w-full text-center bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-4 py-3 rounded-lg font-semibold">
                                Batal
                            </Link>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}