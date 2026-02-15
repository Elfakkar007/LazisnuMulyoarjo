import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css"; // Fixed: Changed from "./globals.css" to "../globals.css"
import { DesktopNav } from "@/components/layout/desktop-nav";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Footer } from "@/components/layout/footer";
import { WhatsAppFloatingButton } from "@/components/layout/whatsapp-button";
import { getOrganizationProfile } from "@/lib/api/public";
import { validateEnv } from '@/lib/utils/env';

// Validasi saat build time
if (process.env.NODE_ENV !== 'production') {
  validateEnv();
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LazisNU Mulyoarjo - Transparansi Pengelolaan Koin Amal",
  description: "Platform transparansi pengelolaan koin amal LazisNU Mulyoarjo untuk kesejahteraan bersama",
};

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch organization profile for footer and WhatsApp button
  const organizationProfile = await getOrganizationProfile();

  return (
    <>
      {/* Desktop Navigation */}
      <DesktopNav
        logoSrc={organizationProfile?.logo_url || "/assets/logo.ico"}
        brandName="LazisNU"
        branchName="Mulyoarjo"
      />

      {/* Main Content */}
      <main className="pt-0 md:pt-16 pb-20 md:pb-0 min-h-screen">
        {children}
      </main>

      {/* Footer */}
      <Footer organizationData={organizationProfile} />

      {/* Mobile Navigation */}
      <MobileNav />

      {/* WhatsApp Floating Button */}
      <WhatsAppFloatingButton
        phoneNumber={organizationProfile?.whatsapp_number || null}
      />
    </>
  );
}