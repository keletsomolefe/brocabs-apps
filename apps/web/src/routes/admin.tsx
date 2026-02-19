/**
 * Admin Dashboard Layout Route
 *
 * Parent route for all /admin/* pages.
 * Includes authentication guard - redirects to login if not authenticated.
 */

import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

import { DashboardLayout } from "../components/layout";
import { useAuthStore } from "../lib/auth";
import { Colors } from "../lib/theme";

export const Route = createFileRoute("/admin")({
  component: AdminLayoutComponent,
});

function AdminLayoutComponent() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, logout, checkAuth } =
    useAuthStore();

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate({ to: "/login" });
    }
  }, [isLoading, isAuthenticated, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate({ to: "/login" });
  };

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <Loader2
            className="h-10 w-10 animate-spin mx-auto mb-4"
            style={{ color: Colors.primary[500] }}
          />
          <p className="text-neutral-500">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render dashboard if not authenticated
  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <DashboardLayout
      userName={user.fullName}
      userEmail={user.email}
      userAvatar={user.avatarUrl}
      onLogout={handleLogout}
    >
      <Outlet />
    </DashboardLayout>
  );
}
