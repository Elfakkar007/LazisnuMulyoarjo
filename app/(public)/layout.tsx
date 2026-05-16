import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "../globals.css";
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
    <div className={`${GeistSans.variable} ${GeistMono.variable}`}>
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
    </div>
  );
}