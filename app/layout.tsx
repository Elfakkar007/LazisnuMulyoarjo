import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { DesktopNav } from "@/components/layout/desktop-nav";
import { MobileNav } from "@/components/layout/mobile-nav";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <DesktopNav
        logoSrc="/assets/logo.ico" 
        brandName="LazisNU" 
        branchName="Mulyoarjo" />
        <main className="pb-20 md:pb-0">
          {children}
        </main>
        <MobileNav />
      </body>
    </html>
  );
}