"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

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

  return (
    <nav className="hidden md:block sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          {/* LOGO & BRAND */}
          <Link href="/" className="flex items-center gap-3 group">
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
              <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center group-hover:bg-emerald-700 transition-colors">
                <span className="text-white font-bold text-lg">{brandName.charAt(0)}</span>
              </div>
            )}
            
            <div className="flex items-center gap-1.5 text-lg">
              <span className="font-bold text-emerald-700">{brandName}</span>
              <span className="font-medium text-emerald-600">{branchName}</span>
            </div>
          </Link>

          {/* NAV LINKS & ADMIN BUTTON */}
          <div className="flex items-center gap-8">
            {navItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "font-semibold transition-colors relative py-2 text-sm uppercase tracking-wide",
                    isActive
                      ? "text-emerald-600"
                      : "text-gray-500 hover:text-emerald-600"
                  )}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-full" />
                  )}
                </Link>
              );
            })}
            
            {/* Admin Button */}
            <Link
              href="/admin"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-2 rounded-full transition-colors text-sm uppercase tracking-wide shadow-md hover:shadow-lg"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}