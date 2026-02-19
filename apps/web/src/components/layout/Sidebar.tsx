/**
 * Sidebar Component
 *
 * Main navigation sidebar for the admin dashboard.
 * Features collapsible state, navigation items with icons, and active state indication.
 */

import { Link, useRouterState } from "@tanstack/react-router";
import {
  Car,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  FileText,
  GraduationCap,
  Home,
  LogOut,
  MapPin,
  Settings,
  Truck,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
}

/**
 * Navigation items for the sidebar
 */
const navigationItems: NavItem[] = [
  { label: "Overview", href: "/admin", icon: Home },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Drivers", href: "/admin/drivers", icon: Car },
  { label: "Rides", href: "/admin/rides", icon: Car },
  { label: "Ride Types", href: "/admin/ride-types", icon: Car },
  { label: "Vehicles", href: "/admin/vehicles", icon: Truck },
  { label: "Zones", href: "/admin/zones", icon: MapPin },
  { label: "Payments", href: "/admin/payments", icon: CreditCard },
  { label: "Wallet", href: "/admin/wallet", icon: Wallet },
  {
    label: "Scholar Applications",
    href: "/admin/scholar-applications",
    icon: GraduationCap,
  },
  { label: "Content", href: "/admin/content", icon: FileText },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

interface SidebarProps {
  /** Current user name */
  userName?: string;
  /** Current user email */
  userEmail?: string;
  /** User avatar URL */
  userAvatar?: string;
  /** Logout handler */
  onLogout?: () => void;
}

export function Sidebar({
  userName,
  userEmail,
  userAvatar,
  onLogout,
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  /**
   * Check if a nav item is active
   */
  const isActive = (href: string): boolean => {
    if (href === "/admin") {
      return currentPath === "/admin";
    }
    return currentPath.startsWith(href);
  };

  return (
    <aside
      className={`
        fixed left-0 top-0 h-screen bg-white border-r border-neutral-100
        flex flex-col transition-all duration-300 z-40
        ${isCollapsed ? "w-20" : "w-64"}
      `}
    >
      {/* Logo Area */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-neutral-100">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">BC</span>
            </div>
            <span className="font-bold text-lg text-neutral-950">Brocabs</span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-neutral-100 rounded-lg transition-colors text-neutral-500"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navigationItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              to={item.href}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
                ${
                  active
                    ? "bg-primary-50 text-primary-700"
                    : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                }
                ${isCollapsed ? "justify-center" : ""}
              `}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon
                className={`h-5 w-5 flex-shrink-0 ${
                  active ? "text-primary-600" : ""
                }`}
              />
              {!isCollapsed && (
                <>
                  <span className="font-medium text-sm flex-1">
                    {item.label}
                  </span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="bg-primary-600 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-3 border-t border-neutral-100">
        {!isCollapsed && userName && (
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center overflow-hidden shrink-0">
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt={userName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-sm font-medium text-primary-700">
                  {userName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </span>
              )}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-neutral-900 truncate">
                {userName}
              </p>
              {userEmail && (
                <p className="text-xs text-neutral-500 truncate">{userEmail}</p>
              )}
            </div>
          </div>
        )}
        <button
          onClick={onLogout}
          className={`
            flex items-center gap-3 px-3 py-2.5 rounded-xl w-full
            text-neutral-600 hover:bg-red-50 hover:text-red-600 transition-colors
            ${isCollapsed ? "justify-center" : ""}
          `}
          title={isCollapsed ? "Logout" : undefined}
        >
          <LogOut className="h-5 w-5" />
          {!isCollapsed && <span className="font-medium text-sm">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
