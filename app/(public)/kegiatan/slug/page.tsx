import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ArticleDetail } from "@/components/kegiatan/article-detail";
import { getArticleBySlug, getRelatedArticles } from "@/lib/api/public";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = await getRelatedArticles(article.category, slug, 3);

  return (
    <Suspense fallback={<LoadingState />}>
      <ArticleDetail article={article} relatedArticles={relatedArticles} />
    </Suspense>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header skeleton */}
      <div className="h-96 bg-gray-200 animate-pulse" />

      {/* Content skeleton */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4 animate-pulse" />
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-8 animate-pulse" />
          
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}