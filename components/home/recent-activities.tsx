"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, ArrowRight, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Article {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string | null;
  activity_date: string;
  location: string | null;
  featured_image_url: string | null;
}

interface RecentActivitiesProps {
  articles: Article[];
}

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

export function RecentActivities({ articles }: RecentActivitiesProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (!articles || articles.length === 0) {
    return (
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
              Kegiatan Terbaru
            </h2>
            <p className="text-gray-600">Belum ada kegiatan yang dipublikasikan</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
            Kegiatan Terbaru
          </h2>
          <p className="text-gray-600 font-medium">
            Dokumentasi program yang telah terlaksana
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-7xl mx-auto">
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
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Link
                  href={`/kegiatan/${article.slug}`}
                  className="group block bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-xl transition-all h-full"
                >
                  {/* Image */}
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
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors min-h-[3rem]">
                      {article.title}
                    </h3>

                    {article.excerpt && (
                      <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                        {article.excerpt}
                      </p>
                    )}

                    {/* Meta Info */}
                    <div className="space-y-1.5 mb-3">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formatDate(article.activity_date)}</span>
                      </div>

                      {article.location && (
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <MapPin className="w-3.5 h-3.5" />
                          <span className="line-clamp-1">{article.location}</span>
                        </div>
                      )}
                    </div>

                    {/* Read More */}
                    <div className="flex items-center justify-between text-xs font-semibold text-emerald-600">
                      <span>Baca Selengkapnya</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-center mt-10"
        >
          <Link
            href="/kegiatan"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            Lihat Semua Kegiatan
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}