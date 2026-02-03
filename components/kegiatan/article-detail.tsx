"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  ChevronRight,
  Share2,
  Facebook,
  Copy,
  X,
  Image as ImageIcon,
  ArrowRight,
} from "lucide-react";
import { MessageCircle } from "lucide-react";

interface ArticleImage {
  id: string;
  image_url: string;
  caption: string | null;
  image_order: number;
}

interface Article {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string | null;
  content: string;
  featured_image_url: string | null;
  activity_date: string;
  location: string | null;
  published_at: string | null;
  images?: ArticleImage[];
}

interface RelatedArticle {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string | null;
  activity_date: string;
  featured_image_url: string | null;
}

interface ArticleDetailProps {
  article: Article;
  relatedArticles: RelatedArticle[];
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

export function ArticleDetail({ article, relatedArticles }: ArticleDetailProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [shareMenuOpen, setShareMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const categoryColor = categoryColors[article.category] || {
    bg: "bg-gray-100",
    text: "text-gray-700",
    border: "border-gray-300",
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const gallery = article.images || [];
  const sortedGallery = [...gallery].sort((a, b) => a.image_order - b.image_order);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % sortedGallery.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + sortedGallery.length) % sortedGallery.length);
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `${article.title} - LazisNU Mulyoarjo`;

    switch (platform) {
      case "whatsapp":
        window.open(`https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`, "_blank");
        break;
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank");
        break;
      case "copy":
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        break;
    }
    setShareMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Featured Image Header */}
      <div className="relative h-96 bg-gradient-to-br from-emerald-800 via-emerald-600 to-teal-700">
        {article.featured_image_url && (
          <>
            <Image
              src={article.featured_image_url}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </>
        )}

        {/* Breadcrumb */}
        <div className="absolute top-6 left-0 right-0 z-10">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 text-sm text-white">
              <Link href="/" className="hover:text-emerald-200 transition-colors">
                Beranda
              </Link>
              <ChevronRight className="w-4 h-4" />
              <Link href="/kegiatan" className="hover:text-emerald-200 transition-colors">
                Kegiatan
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-emerald-200">{article.category}</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-emerald-200 truncate max-w-xs">{article.title}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 -mt-24 relative z-10 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Article Card */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-xl p-8 md:p-12"
          >
            {/* Category Badge */}
            <div className="mb-4">
              <span
                className={`inline-block text-xs font-bold px-4 py-2 rounded-full ${categoryColor.bg} ${categoryColor.text} border ${categoryColor.border}`}
              >
                {article.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">
              {article.title}
            </h1>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-4 mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-5 h-5" />
                <span>{formatDate(article.activity_date)}</span>
              </div>

              {article.location && (
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-5 h-5" />
                  <span>{article.location}</span>
                </div>
              )}
            </div>

            {/* Share Buttons */}
            <div className="flex items-center gap-3 mb-8">
              <span className="text-sm font-semibold text-gray-700">Bagikan:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleShare("whatsapp")}
                  className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm font-semibold">WhatsApp</span>
                </button>

                <button
                  onClick={() => handleShare("facebook")}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                  <span className="text-sm font-semibold">Facebook</span>
                </button>

                <button
                  onClick={() => handleShare("copy")}
                  className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  <span className="text-sm font-semibold">
                    {copied ? "Tersalin!" : "Copy Link"}
                  </span>
                </button>
              </div>
            </div>

            {/* Content */}
            <div
              className="prose prose-lg max-w-none mb-8"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Gallery */}
            {sortedGallery.length > 0 && (
              <div className="mt-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Galeri Foto</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {sortedGallery.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => openLightbox(index)}
                      className="group relative aspect-square rounded-lg overflow-hidden bg-gray-100 hover:opacity-90 transition-opacity"
                    >
                      <Image
                        src={image.image_url}
                        alt={image.caption || `Foto ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-white" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.article>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-12"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Kegiatan Terkait</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedArticles.map((related) => (
                  <Link
                    key={related.id}
                    href={`/kegiatan/${related.slug}`}
                    className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                  >
                    <div className="relative h-40 bg-gradient-to-br from-emerald-100 to-emerald-200">
                      {related.featured_image_url ? (
                        <Image
                          src={related.featured_image_url}
                          alt={related.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <ImageIcon className="w-12 h-12 text-emerald-300" />
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                        {related.title}
                      </h3>

                      {related.excerpt && (
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                          {related.excerpt}
                        </p>
                      )}

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">
                          {new Date(related.activity_date).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                        <ArrowRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && sortedGallery.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
          >
            <X className="w-8 h-8" />
          </button>

          <button
            onClick={prevImage}
            className="absolute left-4 text-white hover:text-gray-300 transition-colors"
          >
            <ChevronRight className="w-8 h-8 rotate-180" />
          </button>

          <button
            onClick={nextImage}
            className="absolute right-4 text-white hover:text-gray-300 transition-colors"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          <div className="max-w-5xl max-h-[80vh] relative">
            <Image
              src={sortedGallery[currentImageIndex].image_url}
              alt={sortedGallery[currentImageIndex].caption || ""}
              width={1200}
              height={800}
              className="object-contain max-h-[80vh]"
            />

            {sortedGallery[currentImageIndex].caption && (
              <p className="text-white text-center mt-4 text-sm">
                {sortedGallery[currentImageIndex].caption}
              </p>
            )}

            <p className="text-white/60 text-center mt-2 text-xs">
              {currentImageIndex + 1} / {sortedGallery.length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}