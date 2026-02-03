"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Calendar, MapPin, ArrowRight, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

interface Article {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string | null;
  activity_date: string;
  location: string | null;
  featured_image_url: string | null;
  published_at: string | null;
}

interface KegiatanContentProps {
  articles: Article[];
  total: number;
  currentPage: number;
  totalPages: number;
  currentCategory?: string;
  currentSearch?: string;
  currentSort?: string;
}

const CATEGORIES = ["Sosial", "Kesehatan", "Keagamaan"];

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  Sosial: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    border: "border-blue-300",
  },
  Kesehatan: {
    bg: "bg-green-100",
    text: "text-green-700",
    border: "border-green-300",
  },
  Keagamaan: {
    bg: "bg-purple-100",
    text: "text-purple-700",
    border: "border-purple-300",
  },
};

export function KegiatanContent({
  articles,
  total,
  currentPage,
  totalPages,
  currentCategory,
  currentSearch,
  currentSort,
}: KegiatanContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchInput, setSearchInput] = useState(currentSearch || "");

  const updateFilters = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams);
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    // Reset to page 1 when filters change
    if (updates.category !== undefined || updates.search !== undefined || updates.sort !== undefined) {
      params.delete("page");
    }

    router.push(`/kegiatan?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search: searchInput || undefined });
  };

  const handleCategoryFilter = (category: string) => {
    if (currentCategory === category) {
      updateFilters({ category: undefined });
    } else {
      updateFilters({ category });
    }
  };

  const handleSortChange = (sort: string) => {
    updateFilters({ sort });
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`/kegiatan?${params.toString()}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Filters Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-md p-6 mb-8"
        >
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Cari kegiatan..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </form>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Category Filter */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Filter className="w-4 h-4" />
                <span>Kategori:</span>
              </div>
              <button
                onClick={() => updateFilters({ category: undefined })}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  !currentCategory
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Semua ({total})
              </button>
              {CATEGORIES.map((category) => {
                const categoryColor = categoryColors[category];
                const categoryCount = articles.filter((a) => a.category === category).length;
                
                return (
                  <button
                    key={category}
                    onClick={() => handleCategoryFilter(category)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                      currentCategory === category
                        ? `${categoryColor.bg} ${categoryColor.text} border ${categoryColor.border}`
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-gray-700">Urutkan:</span>
              <select
                value={currentSort}
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
              >
                <option value="newest">Terbaru</option>
                <option value="oldest">Terlama</option>
              </select>
            </div>
          </div>

          {/* Active Filters Display */}
          {(currentCategory || currentSearch) && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-gray-600">Filter aktif:</span>
                {currentCategory && (
                  <span className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm">
                    Kategori: {currentCategory}
                    <button
                      onClick={() => updateFilters({ category: undefined })}
                      className="hover:text-emerald-900"
                    >
                      ×
                    </button>
                  </span>
                )}
                {currentSearch && (
                  <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                    Pencarian: "{currentSearch}"
                    <button
                      onClick={() => {
                        setSearchInput("");
                        updateFilters({ search: undefined });
                      }}
                      className="hover:text-blue-900"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </motion.div>

        {/* Results Info */}
        <div className="mb-6">
          <p className="text-gray-600">
            Menampilkan <span className="font-semibold">{articles.length}</span> dari{" "}
            <span className="font-semibold">{total}</span> kegiatan
          </p>
        </div>

        {/* Articles Grid */}
        {articles.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">Tidak ada kegiatan yang ditemukan</p>
            <p className="text-gray-400 mt-2">Coba ubah filter atau kata kunci pencarian</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {articles.map((article, index) => {
              const categoryColor = categoryColors[article.category] || {
                bg: "bg-gray-100",
                text: "text-gray-700",
                border: "border-gray-300",
              };

              return (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={`/kegiatan/${article.slug}`}
                    className="group block bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-xl transition-all h-full"
                  >
                    {/* Featured Image */}
                    <div className="relative h-48 bg-gradient-to-br from-emerald-100 to-emerald-200 overflow-hidden">
                      {article.featured_image_url ? (
                        <Image
                          src={article.featured_image_url}
                          alt={article.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <ImageIcon className="w-16 h-16 text-emerald-300" />
                        </div>
                      )}

                      {/* Category Badge */}
                      <div className="absolute top-3 left-3">
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-full ${categoryColor.bg} ${categoryColor.text} border ${categoryColor.border}`}
                        >
                          {article.category}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="font-bold text-lg text-gray-900 mb-3 line-clamp-2 group-hover:text-emerald-600 transition-colors min-h-[3.5rem]">
                        {article.title}
                      </h3>

                      {article.excerpt && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                          {article.excerpt}
                        </p>
                      )}

                      {/* Meta Info */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(article.activity_date)}</span>
                        </div>

                        {article.location && (
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <MapPin className="w-4 h-4" />
                            <span className="line-clamp-1">{article.location}</span>
                          </div>
                        )}
                      </div>

                      {/* Read More */}
                      <div className="flex items-center justify-between text-sm font-semibold text-emerald-600">
                        <span>Baca Selengkapnya</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center gap-2"
          >
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 border border-gray-300"
              }`}
            >
              Previous
            </button>

            {[...Array(totalPages)].map((_, index) => {
              const page = index + 1;
              
              // Show first page, last page, current page, and pages around current
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                      currentPage === page
                        ? "bg-emerald-600 text-white"
                        : "bg-white text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 border border-gray-300"
                    }`}
                  >
                    {page}
                  </button>
                );
              } else if (
                page === currentPage - 2 ||
                page === currentPage + 2
              ) {
                return <span key={page} className="px-2 text-gray-400">...</span>;
              }
              return null;
            })}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 border border-gray-300"
              }`}
            >
              Next
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}