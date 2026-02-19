/**
 * DashboardHeader Component
 *
 * Top header bar for the admin dashboard.
 * Contains page title, search, notifications, and user menu.
 */

import { Link } from "@tanstack/react-router";
import { Bell, Search, User } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "../../lib/auth";

interface DashboardHeaderProps {
  /** Current page title */
  title?: string;
  /** Optional subtitle/description */
  subtitle?: string;
  /** User name for avatar */
  userName?: string;
  /** User avatar URL */
  userAvatar?: string;
  /** Notification count */
  notificationCount?: number;
  /** Search handler */
  onSearch?: (query: string) => void;
}

export function DashboardHeader({
  title = "Dashboard",
  subtitle,
  userName,
  userAvatar,
  notificationCount = 0,
  onSearch,
}: DashboardHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  /**
   * Handle search input
   */
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch?.(value);
  };

  /**
   * Get user initials for avatar
   */
  const getUserInitials = (name: string): string => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-neutral-100 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left: Title */}
        <div>
          <h1 className="text-2xl font-bold text-neutral-950">{title}</h1>
          {subtitle && (
            <p className="text-sm text-neutral-500 mt-0.5">{subtitle}</p>
          )}
        </div>

        {/* Right: Search + Actions */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="
                w-64 pl-10 pr-4 py-2 rounded-xl border border-neutral-200
                text-sm placeholder-neutral-400
                focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500
                transition-all duration-200
              "
            />
          </div>

          {/* Notifications */}
          <button
            className="relative p-2 hover:bg-neutral-100 rounded-xl transition-colors"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5 text-neutral-600" />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs font-medium rounded-full flex items-center justify-center">
                {notificationCount > 9 ? "9+" : notificationCount}
              </span>
            )}
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 p-2 hover:bg-neutral-100 rounded-xl transition-colors"
            >
              <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center overflow-hidden">
                {userAvatar ? (
                  <img
                    src={userAvatar}
                    alt={userName || "User"}
                    className="w-full h-full object-cover"
                  />
                ) : userName ? (
                  <span className="text-sm font-medium text-primary-700">
                    {getUserInitials(userName)}
                  </span>
                ) : (
                  <User className="h-5 w-5 text-primary-600" />
                )}
              </div>
            </button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setIsProfileOpen(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-neutral-100 py-2 z-40">
                  <span className="block px-4 py-2 text-sm text-neutral-400 cursor-not-allowed">
                    Profile (Coming Soon)
                  </span>
                  <Link
                    to="/admin/settings"
                    className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Settings
                  </Link>
                  <hr className="my-2 border-neutral-100" />
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    onClick={() => {
                      useAuthStore.getState().logout();
                    }}
                  >
                    Sign out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
