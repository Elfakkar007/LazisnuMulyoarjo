"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Building2 } from "lucide-react";

interface OrganizationProfile {
  id: string;
  vision: string;
  mission: string;
  about: string | null;
  whatsapp_number: string | null;
  email: string | null;
  address: string | null;
  logo_url: string | null;
  updated_at: string;
}

interface AboutSectionProps {
  profile: OrganizationProfile;
}

export function AboutSection({ profile }: AboutSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-md p-8 md:p-10"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-emerald-600 rounded-lg p-2">
          <Building2 className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          Tentang Organisasi
        </h2>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Logo */}
        <div className="flex-shrink-0">
          <div className="relative w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl shadow-lg flex items-center justify-center overflow-hidden">
            {profile.logo_url ? (
              <Image
                src={profile.logo_url}
                alt="Logo LazisNU Mulyoarjo"
                fill
                className="object-contain p-4"
                priority
              />
            ) : (
              <div className="text-center">
                <Building2 className="w-16 h-16 text-emerald-600 mx-auto mb-2" />
                <p className="text-xs font-bold text-emerald-700">
                  LazisNU
                  <br />
                  Mulyoarjo
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            LazisNU Mulyoarjo
          </h3>
          
          {profile.about ? (
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {profile.about}
              </p>
            </div>
          ) : (
            <p className="text-gray-700 leading-relaxed">
              Lembaga Amil Zakat di bawah naungan Nahdlatul Ulama yang berkomitmen
              untuk mengelola dana ZIS secara amanah, profesional, dan transparan
              untuk kesejahteraan masyarakat Mulyoarjo.
            </p>
          )}

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-emerald-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Fokus</p>
                <p className="text-lg font-bold text-emerald-700">
                  Transparansi
                </p>
              </div>
              <div className="text-center p-4 bg-emerald-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Prinsip</p>
                <p className="text-lg font-bold text-emerald-700">
                  Amanah
                </p>
              </div>
              <div className="text-center p-4 bg-emerald-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Layanan</p>
                <p className="text-lg font-bold text-emerald-700">
                  Profesional
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}