"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";

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

interface ContactSectionProps {
  profile: OrganizationProfile;
}

export function ContactSection({ profile }: ContactSectionProps) {
  const formatPhoneNumber = (phone: string) => {
    // Format to WhatsApp link format
    return phone.replace(/\D/g, '');
  };

  const whatsappUrl = profile.whatsapp_number
    ? `https://wa.me/${formatPhoneNumber(profile.whatsapp_number)}`
    : null;

  const emailUrl = profile.email ? `mailto:${profile.email}` : null;

  // Optional: Google Maps URL (you can customize this)
  // Example: Extract coordinates or use address search
  const mapsUrl = profile.address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(profile.address)}`
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-white rounded-xl shadow-md p-8"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-emerald-600 rounded-lg p-2">
          <Phone className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          Kontak Kami
        </h2>
      </div>

      <div className="space-y-6">
        {/* WhatsApp */}
        {profile.whatsapp_number && whatsappUrl && (
          <motion.a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="flex items-start gap-4 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 hover:shadow-md transition-shadow group"
          >
            <div className="flex-shrink-0 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <Phone className="w-6 h-6 text-white" />
            </div>
            
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-600 mb-1">
                WhatsApp
              </p>
              <p className="text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                {profile.whatsapp_number}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Klik untuk mengirim pesan
              </p>
            </div>

            <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors" />
          </motion.a>
        )}

        {/* Email */}
        {profile.email && emailUrl && (
          <motion.a
            href={emailUrl}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="flex items-start gap-4 p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200 hover:shadow-md transition-shadow group"
          >
            <div className="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <Mail className="w-6 h-6 text-white" />
            </div>
            
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-600 mb-1">
                Email
              </p>
              <p className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors break-all">
                {profile.email}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Kirim email kepada kami
              </p>
            </div>

            <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
          </motion.a>
        )}

        {/* Address */}
        {profile.address && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-600 mb-1">
                  Alamat Kantor
                </p>
                <p className="text-base text-gray-900 leading-relaxed">
                  {profile.address}
                </p>
                
                {/* Optional: Google Maps Link */}
                {mapsUrl && (
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-3 text-sm font-semibold text-purple-600 hover:text-purple-700 transition-colors"
                  >
                    <MapPin className="w-4 h-4" />
                    Lihat di Google Maps
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Optional: Embedded Google Maps */}
        {/* Uncomment this section if you want to embed a map */}
        {/* You'll need to get the exact coordinates or embed URL from Google Maps */}
        {/*
        {mapsUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="rounded-xl overflow-hidden border border-gray-200 shadow-md"
          >
            <iframe
              src="YOUR_GOOGLE_MAPS_EMBED_URL"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>
        )}
        */}

        {/* No contact info available */}
        {!profile.whatsapp_number && !profile.email && !profile.address && (
          <div className="text-center py-12">
            <Phone className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Belum ada informasi kontak</p>
          </div>
        )}
      </div>

      {/* Additional Info */}
      <div className="mt-8 pt-8 border-t border-gray-200">
        <div className="bg-emerald-50 rounded-lg p-6">
          <h4 className="text-sm font-bold text-emerald-900 mb-2">
            Jam Operasional
          </h4>
          <div className="space-y-1 text-sm text-emerald-800">
            <p>Senin - Jumat: 08.00 - 16.00 WIB</p>
            <p>Sabtu: 08.00 - 12.00 WIB</p>
            <p>Minggu & Libur: Tutup</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}