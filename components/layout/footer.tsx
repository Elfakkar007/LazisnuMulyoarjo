import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";

interface FooterProps {
  organizationData?: {
    whatsapp_number: string | null;
    email: string | null;
    address: string | null;
    logo_url?: string | null;
  };
}

export function Footer({ organizationData }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Brand & About */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {organizationData?.logo_url ? (
                <Image
                  src={organizationData.logo_url}
                  alt="LazisNU Mulyoarjo Logo"
                  width={40}
                  height={40}
                  className="object-contain rounded"
                />
              ) : (
                <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">L</span>
                </div>
              )}
              <div>
                <h3 className="text-white font-bold text-lg">LazisNU</h3>
                <p className="text-sm text-gray-400">Mulyoarjo</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Lembaga Amil Zakat yang amanah, profesional, dan transparan dalam
              mengelola dana umat untuk kesejahteraan masyarakat Mulyoarjo.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-lg">Link Cepat</h4>
            <nav className="flex flex-col space-y-2">
              <Link
                href="/"
                className="text-sm hover:text-emerald-400 transition-colors"
              >
                Beranda
              </Link>
              <Link
                href="/laporan"
                className="text-sm hover:text-emerald-400 transition-colors"
              >
                Laporan Keuangan
              </Link>
              <Link
                href="/kegiatan"
                className="text-sm hover:text-emerald-400 transition-colors"
              >
                Kegiatan
              </Link>
              <Link
                href="/profil"
                className="text-sm hover:text-emerald-400 transition-colors"
              >
                Profil Organisasi
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-lg">Kontak Kami</h4>
            <div className="space-y-3">
              {organizationData?.address && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm leading-relaxed">
                    {organizationData.address}
                  </p>
                </div>
              )}

              {organizationData?.whatsapp_number && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <a
                    href={`https://wa.me/${organizationData.whatsapp_number.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm hover:text-emerald-400 transition-colors"
                  >
                    {organizationData.whatsapp_number}
                  </a>
                </div>
              )}

              {organizationData?.email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <a
                    href={`mailto:${organizationData.email}`}
                    className="text-sm hover:text-emerald-400 transition-colors"
                  >
                    {organizationData.email}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © {currentYear} LazisNU Mulyoarjo. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link
                href="/privacy"
                className="text-sm text-gray-400 hover:text-emerald-400 transition-colors"
              >
                Kebijakan Privasi
              </Link>
              <Link
                href="/terms"
                className="text-sm text-gray-400 hover:text-emerald-400 transition-colors"
              >
                Syarat & Ketentuan
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}