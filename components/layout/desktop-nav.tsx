"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Beranda" },
  { href: "/laporan", label: "Laporan" },
  { href: "/kegiatan", label: "Kegiatan" },
  { href: "/profil", label: "Profil" },
];

export function DesktopNav() {
  const pathname = usePathname();

  return (
    <nav className="hidden md:block sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <div>
              <h1 className="font-bold text-emerald-700">LazisNU</h1>
              <p className="text-xs text-gray-600">Mulyoarjo</p>
            </div>
          </div>

          <div className="flex items-center gap-8">
            {navItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "font-semibold transition-colors relative py-2",
                    isActive
                      ? "text-emerald-600"
                      : "text-gray-600 hover:text-emerald-600"
                  )}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}