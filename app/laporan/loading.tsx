export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <div className="bg-gradient-to-br from-emerald-700 to-teal-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
            <div className="h-12 bg-white/20 rounded w-96 mx-auto mb-4 animate-pulse" />
            <div className="h-6 bg-white/10 rounded w-64 mx-auto animate-pulse" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Year selector skeleton */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="h-8 bg-gray-200 rounded w-48 mb-4 animate-pulse" />
            <div className="h-12 bg-gray-100 rounded animate-pulse" />
          </div>

          {/* Summary cards skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-md p-6">
                <div className="h-24 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>

          {/* Chart sections skeleton */}
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-md p-8">
              <div className="h-8 bg-gray-200 rounded w-64 mb-6 animate-pulse" />
              <div className="h-64 bg-gray-100 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}