"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, ExternalLink, Instagram, Music, Facebook, Youtube, Twitter } from "lucide-react";

interface SocialMediaLinks {
  instagram?: string;
  tiktok?: string;
  facebook?: string;
  youtube?: string;
  twitter?: string;
}

interface OrganizationProfile {
  id: string;
  vision: string;
  mission: string;
  about: string | null;
  whatsapp_number: string | null;
  email: string | null;
  address: string | null;
  logo_url: string | null;
  google_maps_url: string | null;
  social_media_links: SocialMediaLinks | null;
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

  // Use google_maps_url from profile, or fallback to search
  const mapsUrl = profile.google_maps_url || (profile.address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(profile.address)}`
    : null);

  const socialMedia = profile.social_media_links || {};

  // Social media config
  const socialMediaList = [
    {
      name: 'Instagram',
      icon: Instagram,
      url: socialMedia.instagram,
      color: 'from-pink-50 to-purple-50',
      borderColor: 'border-pink-200',
      iconBg: 'bg-gradient-to-br from-pink-500 to-purple-600',
      hoverColor: 'group-hover:text-pink-600',
    },
    {
      name: 'TikTok',
      icon: Music,
      url: socialMedia.tiktok,
      color: 'from-slate-50 to-gray-50',
      borderColor: 'border-slate-200',
      iconBg: 'bg-black',
      hoverColor: 'group-hover:text-slate-900',
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: socialMedia.facebook,
      color: 'from-blue-50 to-indigo-50',
      borderColor: 'border-blue-200',
      iconBg: 'bg-blue-600',
      hoverColor: 'group-hover:text-blue-600',
    },
    {
      name: 'YouTube',
      icon: Youtube,
      url: socialMedia.youtube,
      color: 'from-red-50 to-rose-50',
      borderColor: 'border-red-200',
      iconBg: 'bg-red-600',
      hoverColor: 'group-hover:text-red-600',
    },
    {
      name: 'Twitter / X',
      icon: Twitter,
      url: socialMedia.twitter,
      color: 'from-sky-50 to-blue-50',
      borderColor: 'border-sky-200',
      iconBg: 'bg-sky-500',
      hoverColor: 'group-hover:text-sky-600',
    },
  ].filter(item => item.url); // Only show social media that have URLs

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
                
                {/* Google Maps Link */}
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

        {/* Social Media Links */}
        {socialMediaList.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="pt-6 border-t border-gray-200"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Ikuti Kami
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {socialMediaList.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-3 p-4 bg-gradient-to-r ${social.color} rounded-lg border ${social.borderColor} hover:shadow-md transition-all group`}
                  >
                    <div className={`flex-shrink-0 w-10 h-10 ${social.iconBg} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-bold text-gray-900 ${social.hoverColor} transition-colors truncate`}>
                        {social.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        Kunjungi halaman kami
                      </p>
                    </div>
                    <ExternalLink className={`w-4 h-4 text-gray-400 ${social.hoverColor} transition-colors flex-shrink-0`} />
                  </a>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* No contact info available */}
        {!profile.whatsapp_number && !profile.email && !profile.address && socialMediaList.length === 0 && (
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