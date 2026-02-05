import { Suspense } from "react";
import { ProfileContent } from "@/components/profil/profile-content";
import { getOrganizationProfile, getStructureData } from "@/lib/api/public";

export default async function ProfilPage() {
  const [organizationProfile, structureData] = await Promise.all([
    getOrganizationProfile(),
    getStructureData(),
  ]);

  if (!organizationProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Data Profil Tidak Tersedia
          </h1>
          <p className="text-gray-600">
            Silakan hubungi administrator untuk informasi lebih lanjut
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-700 to-teal-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
              Profil Organisasi
            </h1>
            <p className="text-lg text-emerald-50">
              LazisNU Mulyoarjo - Amanah, Profesional, Transparan
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <Suspense fallback={<LoadingState />}>
        <ProfileContent
          profile={organizationProfile}
          structureData={structureData}
        />
      </Suspense>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* About skeleton */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6 animate-pulse" />
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
          </div>
        </div>

        {/* Structure skeleton */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-48 bg-gray-200 rounded animate-pulse" />
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
  );
}