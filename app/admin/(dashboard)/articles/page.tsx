// =====================================================
// ARTICLES MANAGEMENT PAGE
// File: app/admin/(dashboard)/articles/page.tsx
// =====================================================

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {
    Plus,
    Edit,
    Trash2,
    Search,
    Filter,
    Eye,
    EyeOff,
    Calendar,
    Image as ImageIcon,
    MoreVertical
} from 'lucide-react';
import { getArticles as getArticlesFromDB } from '@/lib/api/client-admin';
import { deleteArticle, publishArticle, unpublishArticle } from '@/lib/actions/admin';
import { formatDate, getCategoryColor } from '@/lib/utils/helpers';

const CATEGORIES = ['Sosial', 'Kesehatan', 'Keagamaan'];

interface Article {
    id: string;
    title: string;
    slug: string;
    category: string;
    excerpt: string | null;
    featured_image_url: string | null;
    activity_date: string;
    location: string | null;
    is_published: boolean;
    published_at: string | null;
    created_at: string;
}

export default function ArticlesPage() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [selectedArticles, setSelectedArticles] = useState<Set<string>>(new Set());
    const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);

    useEffect(() => {
        loadArticles();
    }, []);

    const loadArticles = async () => {
        setLoading(true);
        const data = await getArticlesFromDB();
        setArticles(data);
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Hapus artikel ini? Data tidak bisa dikembalikan.')) return;

        const result = await deleteArticle(id);
        if (result.success) {
            await loadArticles();
            alert('Artikel berhasil dihapus');
        } else {
            alert(`Gagal menghapus: ${(result as any).message}`);
        }
    };

    const handleTogglePublish = async (article: Article) => {
        const result = article.is_published
            ? await unpublishArticle(article.id)
            : await publishArticle(article.id);

        if (result.success) {
            await loadArticles();
        } else {
            alert(`Gagal: ${(result as any).message}`);
        }
    };

    const handleSelectArticle = (id: string) => {
        const newSelected = new Set(selectedArticles);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedArticles(newSelected);
    };

    const handleSelectAll = () => {
        if (selectedArticles.size === filteredArticles.length) {
            setSelectedArticles(new Set());
        } else {
            setSelectedArticles(new Set(filteredArticles.map(a => a.id)));
        }
    };

    const handleBulkDelete = async () => {
        if (selectedArticles.size === 0) return;

        if (!confirm(`Hapus ${selectedArticles.size} artikel?`)) return;

        const promises = Array.from(selectedArticles).map(id => deleteArticle(id));
        await Promise.all(promises);

        setSelectedArticles(new Set());
        await loadArticles();
        alert('Artikel berhasil dihapus');
    };

    const handleBulkPublish = async () => {
        if (selectedArticles.size === 0) return;

        const promises = Array.from(selectedArticles).map(id => {
            const article = articles.find(a => a.id === id);
            if (!article?.is_published) {
                return publishArticle(id);
            }
            return Promise.resolve({ success: true });
        });

        await Promise.all(promises);
        setSelectedArticles(new Set());
        await loadArticles();
        alert('Artikel berhasil dipublikasi');
    };

    // Filter articles
    const filteredArticles = articles.filter(article => {
        const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
        const matchesStatus =
            selectedStatus === 'all' ||
            (selectedStatus === 'published' && article.is_published) ||
            (selectedStatus === 'draft' && !article.is_published);

        return matchesSearch && matchesCategory && matchesStatus;
    });

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
                    <h1 className="text-3xl font-bold text-gray-900">Artikel Kegiatan</h1>
                    <p className="text-gray-600 mt-1">Kelola artikel dan dokumentasi kegiatan</p>
                </div>
                <Link
                    href="/admin/articles/new"
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Buat Artikel
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-md p-6">
                {/* Search */}
                <div className="mb-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari artikel..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                    </div>
                </div>

                {/* Category & Status Filters */}
                <div className="flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            <Filter className="w-4 h-4 inline mr-1" />
                            Kategori
                        </label>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                        >
                            <option value="all">Semua Kategori</option>
                            {CATEGORIES.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Status
                        </label>
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                        >
                            <option value="all">Semua Status</option>
                            <option value="published">Published</option>
                            <option value="draft">Draft</option>
                        </select>
                    </div>
                </div>

                {/* Bulk Actions */}
                {selectedArticles.size > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-semibold text-gray-700">
                                {selectedArticles.size} artikel dipilih
                            </span>
                            <button
                                onClick={handleBulkPublish}
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold transition-colors"
                            >
                                Publish
                            </button>
                            <button
                                onClick={handleBulkDelete}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Articles Table */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-emerald-600 text-white">
                                <th className="px-4 py-3 text-left">
                                    <input
                                        type="checkbox"
                                        checked={selectedArticles.size === filteredArticles.length && filteredArticles.length > 0}
                                        onChange={handleSelectAll}
                                        className="w-4 h-4"
                                    />
                                </th>
                                <th className="px-4 py-3 text-left font-bold">Thumbnail</th>
                                <th className="px-4 py-3 text-left font-bold">Judul</th>
                                <th className="px-4 py-3 text-left font-bold">Kategori</th>
                                <th className="px-4 py-3 text-left font-bold">Tanggal</th>
                                <th className="px-4 py-3 text-center font-bold">Status</th>
                                <th className="px-4 py-3 text-center font-bold">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredArticles.map((article) => {
                                const categoryColor = getCategoryColor(article.category);

                                return (
                                    <tr key={article.id} className="border-b border-gray-200 hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <input
                                                type="checkbox"
                                                checked={selectedArticles.has(article.id)}
                                                onChange={() => handleSelectArticle(article.id)}
                                                className="w-4 h-4"
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="relative w-20 h-12 bg-gray-100 rounded overflow-hidden">
                                                {article.featured_image_url ? (
                                                    <Image
                                                        src={article.featured_image_url}
                                                        alt={article.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full">
                                                        <ImageIcon className="w-6 h-6 text-gray-400" />
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div>
                                                <p className="font-semibold text-gray-900 line-clamp-1">
                                                    {article.title}
                                                </p>
                                                {article.excerpt && (
                                                    <p className="text-xs text-gray-500 line-clamp-1 mt-1">
                                                        {article.excerpt}
                                                    </p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full ${categoryColor.bg} ${categoryColor.text} border ${categoryColor.border}`}>
                                                {article.category}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Calendar className="w-4 h-4" />
                                                <span className="text-xs">{formatDate(article.activity_date, 'short')}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <button
                                                onClick={() => handleTogglePublish(article)}
                                                className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full transition-colors ${article.is_published
                                                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                    }`}
                                            >
                                                {article.is_published ? (
                                                    <>
                                                        <Eye className="w-3 h-3" />
                                                        Published
                                                    </>
                                                ) : (
                                                    <>
                                                        <EyeOff className="w-3 h-3" />
                                                        Draft
                                                    </>
                                                )}
                                            </button>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <div className="flex gap-2 justify-center">
                                                <Link
                                                    href={`/admin/articles/${article.id}/edit`}
                                                    className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(article.id)}
                                                    className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {filteredArticles.length === 0 && (
                    <div className="p-12 text-center text-gray-500">
                        {searchQuery || selectedCategory !== 'all' || selectedStatus !== 'all'
                            ? 'Tidak ada artikel yang sesuai filter'
                            : 'Belum ada artikel. Klik "Buat Artikel" untuk memulai.'}
                    </div>
                )}
            </div>
        </div>
    );
}