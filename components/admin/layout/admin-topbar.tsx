'use client';

import { Bell, Search, User, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface AdminTopbarProps {
  isSidebarCollapsed: boolean;
}

export function AdminTopbar({ isSidebarCollapsed }: AdminTopbarProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    // TODO: Implement your sign out logic here
    // Example with next-auth: await signOut({ callbackUrl: '/login' })
    // Example with custom auth: await fetch('/api/auth/signout')
    router.push('/login');
  };

  return (
    <header
      className={cn(
        "fixed top-0 right-0 h-16 md:h-20 bg-white border-b border-gray-200",
        "transition-all duration-300 ease-in-out",
        "z-30",
        // Adjust left position based on sidebar state
        "left-0 md:left-64",
        isSidebarCollapsed && "md:left-20"
      )}
    >
      <div className="h-full px-4 md:px-6 flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button
            className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Menu */}
          <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-gray-900">
                Admin User
              </p>
              <p className="text-xs text-gray-500">
                admin@example.com
              </p>
            </div>

            <div className="relative group">
              <button
                className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-medium"
                aria-label="User menu"
              >
                <User className="w-5 h-5" />
              </button>

              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="p-2">
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}