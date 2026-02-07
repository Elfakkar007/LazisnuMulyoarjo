import { Suspense } from "react";
import { KegiatanContent } from "@/components/kegiatan/kegiatan-content";
import { getArticles } from "@/lib/api/public";

interface PageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    page?: string;
    sort?: string;
  }>;
}

export default async function KegiatanPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const category = params.category;
  const search = params.search;
  const page = parseInt(params.page || "1");
  const sort = params.sort || "newest";

  const itemsPerPage = 12;
  const offset = (page - 1) * itemsPerPage;

  // Fetch articles with filters
  const { articles, total } = await getArticles({
    category,
    search,
    limit: itemsPerPage,
    offset,
  });

  // Sort articles
  const sortedArticles = sort === "oldest" 
    ? [...articles].reverse() 
    : articles;

  const totalPages = Math.ceil(total / itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-700 to-teal-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
              Kegiatan LazisNU
            </h1>
            <p className="text-lg text-emerald-50">
              Dokumentasi program sosial, kesehatan, dan keagamaan
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <Suspense fallback={<LoadingState />}>
        <KegiatanContent
          articles={sortedArticles}
          total={total}
          currentPage={page}
          totalPages={totalPages}
          currentCategory={category}
          currentSearch={search}
          currentSort={sort}
        />
      </Suspense>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Filters skeleton */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="h-12 bg-gray-200 rounded mb-6 animate-pulse" />
          <div className="flex gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 bg-gray-200 rounded w-24 animate-pulse" />
            ))}
          </div>
        </div>

        {/* Grid skeleton */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200 animate-pulse" />
              <div className="p-5">
                <div className="h-6 bg-gray-200 rounded mb-3 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-3 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-3 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}