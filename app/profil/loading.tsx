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
          {/* About skeleton */}
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="h-8 bg-gray-200 rounded w-64 mb-6 animate-pulse" />
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
          </div>

          {/* Vision Mission skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-md p-8">
                <div className="h-8 bg-gray-200 rounded w-32 mb-4 animate-pulse" />
                <div className="space-y-3">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="h-4 bg-gray-200 rounded animate-pulse" />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Structure skeleton */}
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="h-8 bg-gray-200 rounded w-64 mb-6 animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="bg-gray-100 rounded-xl p-6">
                  <div className="h-32 bg-gray-200 rounded-full w-32 mx-auto mb-4 animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2 animate-pulse" />
                  <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto animate-pulse" />
                </div>
              ))}
            </div>
          </div>

          {/* Dusun skeleton */}
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="h-8 bg-gray-200 rounded w-64 mb-6 animate-pulse" />
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
              ))}
            </div>
          </div>

          {/* Contact skeleton */}
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="h-8 bg-gray-200 rounded w-64 mb-6 animate-pulse" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}