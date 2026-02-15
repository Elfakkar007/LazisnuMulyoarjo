"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/", label: "Beranda" },
  { href: "/laporan", label: "Laporan" },
  { href: "/kegiatan", label: "Kegiatan" },
  { href: "/profil", label: "Profil" },
];

interface DesktopNavProps {
  logoSrc?: string;
  brandName?: string;
  branchName?: string;
}

export function DesktopNav({ 
  logoSrc, 
  brandName = "LazisNU", 
  branchName = "Mulyoarjo" 
}: DesktopNavProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll for glassmorphism effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav 
      className={cn(
        "hidden md:block fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled 
          ? "bg-white/70 backdrop-blur-md shadow-lg" 
          : "bg-white/90 backdrop-blur-sm shadow-md"
      )}
    >
      <div className="container mx-auto px-8 lg:px-12">
        <div className="flex items-center justify-between h-16">
          
          {/* LOGO & BRAND - Left */}
          <Link href="/" className="flex items-center gap-2.5 group">
            {logoSrc ? (
              <div className="relative w-10 h-10 overflow-hidden rounded-full">
                <Image 
                  src={logoSrc} 
                  alt="Logo" 
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center group-hover:bg-emerald-700 transition-colors shadow-md">
                <span className="text-white font-bold text-lg">{brandName.charAt(0)}</span>
              </div>
            )}
            
            <div className="flex items-center gap-1.5 text-lg">
              <span className="font-bold text-emerald-700">{brandName}</span>
              <span className="font-medium text-emerald-600">{branchName}</span>
            </div>
          </Link>

          {/* NAV LINKS - Center */}
          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-6">
            {navItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "font-semibold transition-all duration-200 relative py-2 text-sm uppercase tracking-wide",
                    isActive
                      ? "text-emerald-600"
                      : "text-gray-700 hover:text-emerald-600"
                  )}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-emerald-600 rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>
            
          {/* Admin Button - Right */}
          <Link
            href="/admin"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2 rounded-full transition-all duration-200 text-sm uppercase tracking-wide shadow-lg hover:shadow-xl hover:scale-105"
          >
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
}