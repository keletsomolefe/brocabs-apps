/**
 * Admin Dashboard Overview Page
 *
 * Main dashboard home page showing current admin profile, stats, and quick access links.
 */

import type { AdminStatsResponseDto } from "@brocabs/client";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Car,
  CreditCard,
  DollarSign,
  LayoutDashboard,
  Loader2,
  Receipt,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";

import { adminApi } from "../../lib/api";
import { useAuthStore } from "../../lib/auth";

export const Route = createFileRoute("/admin/")({
  component: AdminOverviewPage,
});

/**
 * Quick link card component
 */
interface QuickLinkProps {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

function QuickLinkCard({
  title,
  description,
  href,
  icon: Icon,
  color,
}: QuickLinkProps) {
  return (
    <Link
      to={href}
      className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 hover:shadow-md transition-all group"
    >
      <div className="flex items-start justify-between">
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <ArrowRight className="h-5 w-5 text-neutral-300 group-hover:text-neutral-500 group-hover:translate-x-1 transition-all" />
      </div>
      <h3 className="font-semibold text-neutral-900 mt-4">{title}</h3>
      <p className="text-sm text-neutral-500 mt-1">{description}</p>
    </Link>
  );
}

/**
 * Stat card component
 */
interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-neutral-500">{title}</p>
          <p className="text-2xl font-bold text-neutral-900 mt-1">{value}</p>
          {subtitle && (
            <p className="text-sm text-neutral-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
    </div>
  );
}

/**
 * Format currency in ZAR
 */
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function AdminOverviewPage() {
  const user = useAuthStore((state) => state.user);

  const statsQuery = useQuery<AdminStatsResponseDto>({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      const response = await adminApi.adminControllerGetStats();
      return response;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const stats = statsQuery.data;

  const quickLinks: QuickLinkProps[] = [
    {
      title: "Users",
      description: "Manage rider and admin accounts",
      href: "/admin/users",
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Drivers",
      description: "Driver accounts and verification",
      href: "/admin/drivers",
      icon: Car,
      color: "bg-green-500",
    },
    {
      title: "Rides",
      description: "Monitor ride requests and history",
      href: "/admin/rides",
      icon: TrendingUp,
      color: "bg-purple-500",
    },
    {
      title: "Payments",
      description: "Transaction history and refunds",
      href: "/admin/payments",
      icon: CreditCard,
      color: "bg-amber-500",
    },
    {
      title: "Wallets",
      description: "User wallet balances",
      href: "/admin/wallets",
      icon: Wallet,
      color: "bg-teal-500",
    },
    {
      title: "Subscriptions",
      description: "Driver subscription plans",
      href: "/admin/subscriptions",
      icon: Receipt,
      color: "bg-indigo-500",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900">
              Welcome back, {user?.fullName?.split(" ")[0] || "Admin"}!
            </h2>
            <p className="text-neutral-500 mt-1">
              Here's an overview of your admin dashboard.
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-neutral-500">Logged in as</p>
            <p className="font-medium text-neutral-900">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div>
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">
          Platform Statistics
        </h3>
        {statsQuery.isLoading ? (
          <div className="bg-white rounded-2xl p-12 shadow-sm border border-neutral-100 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
          </div>
        ) : statsQuery.error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700">
            Failed to load statistics. Please try again later.
          </div>
        ) : stats ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Users"
              value={stats.totalUsers ?? 0}
              subtitle={`${stats.totalRiders ?? 0} riders, ${stats.totalDrivers ?? 0} drivers`}
              icon={Users}
              color="bg-blue-500"
            />
            <StatCard
              title="Active Drivers"
              value={stats.activeDrivers ?? 0}
              subtitle="Currently online"
              icon={Car}
              color="bg-green-500"
            />
            <StatCard
              title="Total Rides"
              value={stats.totalRides ?? 0}
              subtitle={`${stats.todayRides ?? 0} today, ${stats.activeRides ?? 0} active`}
              icon={TrendingUp}
              color="bg-purple-500"
            />
            <StatCard
              title="Total Revenue"
              value={formatCurrency(stats.totalRevenue ?? 0)}
              subtitle={`${formatCurrency(stats.todayRevenue ?? 0)} today`}
              icon={DollarSign}
              color="bg-amber-500"
            />
          </div>
        ) : null}
      </div>

      {/* Quick Links Grid */}
      <div>
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">
          Quick Access
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickLinks.map((link) => (
            <QuickLinkCard key={link.href} {...link} />
          ))}
        </div>
      </div>

      {/* Additional Stats */}
      {stats && (
        <div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">
            Financial Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StatCard
              title="Total Deposits"
              value={formatCurrency(stats.totalDeposits ?? 0)}
              icon={Wallet}
              color="bg-teal-500"
            />
            <StatCard
              title="Pending Transactions"
              value={stats.pendingTransactions ?? 0}
              subtitle="Awaiting processing"
              icon={CreditCard}
              color="bg-orange-500"
            />
          </div>
        </div>
      )}

      {/* Recent Activity Section */}
      <div>
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">
          Quick Stats
        </h3>
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6">
          <div className="flex items-center gap-3 text-neutral-500">
            <LayoutDashboard className="h-5 w-5" />
            <span>
              Last updated:{" "}
              {stats?.generatedAt
                ? new Date(stats.generatedAt).toLocaleString("en-ZA")
                : "N/A"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
