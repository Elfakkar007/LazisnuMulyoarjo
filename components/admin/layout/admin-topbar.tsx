'use client';

import { Menu } from 'lucide-react';
import { useEffect, useState } from 'react';

interface AdminTopbarProps {
  onMenuClick: () => void;
}

export default function AdminTopbar({ onMenuClick }: AdminTopbarProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 sm:h-16 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6 shadow-sm">
      {/* Left Section - Mobile Menu + Title */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 md:hidden transition-colors"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>

        {/* App Title - Hidden on mobile, shown on desktop */}
        <div className="hidden md:block">
          <h2 className="text-sm font-semibold text-gray-700">Admin Panel</h2>
        </div>
      </div>

      {/* Right Section - Digital Clock */}
      <div className="flex items-center gap-3">
        {/* Digital Clock */}
        <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg border border-gray-200">
          {/* Time Display */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex flex-col">
              <span className="text-xs text-gray-500 leading-none mb-0.5">
                {formatDate(currentTime)}
              </span>
              <span className="text-lg font-bold text-gray-900 leading-none font-mono">
                {formatTime(currentTime)}
              </span>
            </div>
            {/* Mobile - Time Only */}
            <div className="flex sm:hidden">
              <span className="text-base font-bold text-gray-900 font-mono">
                {formatTime(currentTime)}
              </span>
            </div>
          </div>
        </div>

        {/* User Info - Desktop only */}
        <div className="hidden sm:flex items-center gap-2 ml-2 px-3 py-1.5 bg-gray-50 rounded-lg">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-semibold">
            A
          </div>
          <div className="hidden lg:block">
            <p className="text-xs font-medium text-gray-900">Admin User</p>
          </div>
        </div>
      </div>
    </header>
  );
}