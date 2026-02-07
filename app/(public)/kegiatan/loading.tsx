export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <div className="bg-gradient-to-br from-emerald-700 to-teal-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
            <div className="h-12 bg-white/20 rounded w-64 mx-auto mb-4 animate-pulse" />
            <div className="h-6 bg-white/10 rounded w-96 mx-auto animate-pulse" />
          </div>
        </div>
      </div>

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
    </div>
  );
}