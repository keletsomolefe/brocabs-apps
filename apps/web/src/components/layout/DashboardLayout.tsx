/**
 * DashboardLayout Component
 *
 * Main layout wrapper for all admin dashboard pages.
 * Provides the sidebar, header, and content area structure.
 */

import { DashboardHeader } from "./DashboardHeader";
import { Sidebar } from "./Sidebar";

interface DashboardLayoutProps {
  /** Page content */
  children: React.ReactNode;
  /** Current page title */
  title?: string;
  /** Optional page subtitle */
  subtitle?: string;
  /** User name */
  userName?: string;
  /** User email */
  userEmail?: string;
  /** User avatar URL */
  userAvatar?: string;
  /** Notification count */
  notificationCount?: number;
  /** Search handler */
  onSearch?: (query: string) => void;
  /** Logout handler */
  onLogout?: () => void;
}

export function DashboardLayout({
  children,
  title = "Dashboard",
  subtitle,
  userName = "Admin User",
  userEmail = "admin@brocabs.co.za",
  userAvatar,
  notificationCount = 0,
  onSearch,
  onLogout,
}: DashboardLayoutProps) {
  // Sidebar width is fixed at 256px (ml-64)
  // TODO: Implement sidebar collapse functionality if needed
  const sidebarWidth = "ml-64";

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Sidebar */}
      <Sidebar
        userName={userName}
        userEmail={userEmail}
        userAvatar={userAvatar}
        onLogout={onLogout}
      />

      {/* Main Content Area */}
      <div className={`transition-all duration-300 ${sidebarWidth}`}>
        {/* Header */}
        <DashboardHeader
          title={title}
          subtitle={subtitle}
          userName={userName}
          userAvatar={userAvatar}
          notificationCount={notificationCount}
          onSearch={onSearch}
        />

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
