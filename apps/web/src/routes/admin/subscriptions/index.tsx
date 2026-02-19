/**
 * Admin Subscriptions Overview Page
 *
 * Dashboard for managing driver subscriptions with statistics,
 * pending approvals, and subscription list.
 */

import type {
  AdminSubscriptionListResponseDto,
  AdminSubscriptionResponseDto,
  AdminSubscriptionStatsDto,
} from "@brocabs/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  DollarSign,
  RefreshCw,
  Search,
  XCircle,
} from "lucide-react";
import { useState } from "react";

import { Badge, Button, DataTable, EmptyState } from "../../../components/ui";
import { adminSubscriptionsApi } from "../../../lib/api";

export const Route = createFileRoute("/admin/subscriptions/")({
  component: AdminSubscriptionsPage,
});

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

/**
 * Format date to locale string
 */
function formatDate(date: Date | string | undefined): string {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-ZA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Get status badge variant and text
 */
function getStatusBadge(status: string) {
  const statusMap: Record<
    string,
    { variant: "success" | "warning" | "danger" | "default"; label: string }
  > = {
    ACTIVE: { variant: "success", label: "Active" },
    PENDING_APPROVAL: { variant: "warning", label: "Pending" },
    EXPIRED: { variant: "default", label: "Expired" },
    CANCELLED: { variant: "default", label: "Cancelled" },
    PAYMENT_FAILED: { variant: "danger", label: "Payment Failed" },
    REJECTED: { variant: "danger", label: "Rejected" },
  };
  return statusMap[status] || { variant: "default" as const, label: status };
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
 * Extended subscription type for DataTable compatibility
 */
type SubscriptionData = AdminSubscriptionResponseDto & {
  [key: string]: unknown;
};

function AdminSubscriptionsPage() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const limit = 20;

  // Fetch subscription statistics
  const statsQuery = useQuery<AdminSubscriptionStatsDto>({
    queryKey: ["admin", "subscriptions", "stats"],
    queryFn: () => adminSubscriptionsApi.adminSubscriptionControllerGetStats(),
    refetchInterval: 30000,
  });

  // Fetch subscriptions list
  const subscriptionsQuery = useQuery<AdminSubscriptionListResponseDto>({
    queryKey: ["admin", "subscriptions", page, searchQuery, statusFilter],
    queryFn: () =>
      adminSubscriptionsApi.adminSubscriptionControllerListSubscriptions({
        page: String(page),
        limit: String(limit),
        search: searchQuery || undefined,
        status: statusFilter as never,
        sortBy: "createdAt",
        sortOrder: "DESC",
      }),
  });

  // Bulk approve mutation
  const bulkApproveMutation = useMutation({
    mutationFn: (data: { ids: string[]; action: "APPROVE" | "REJECT" }) =>
      adminSubscriptionsApi.adminSubscriptionControllerBulkApproveSubscriptions(
        {
          bulkApproveSubscriptionsDto: {
            subscriptionIds: data.ids,
            action: data.action,
          },
        },
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "subscriptions"] });
      setSelectedIds([]);
    },
  });

  const stats = statsQuery.data;
  const subscriptions = (subscriptionsQuery.data?.data ??
    []) as SubscriptionData[];
  const total = subscriptionsQuery.data?.total ?? 0;

  const columns = [
    {
      key: "id",
      header: "",
      width: "40px",
      render: (_: unknown, row: SubscriptionData) => (
        <input
          type="checkbox"
          checked={selectedIds.includes(row.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedIds((prev) => [...prev, row.id]);
            } else {
              setSelectedIds((prev) => prev.filter((id) => id !== row.id));
            }
          }}
          className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
          onClick={(e) => e.stopPropagation()}
        />
      ),
    },
    {
      key: "driver",
      header: "Driver",
      sortable: true,
      render: (_: unknown, row: SubscriptionData) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-green-700">
              {(row.driver?.fullName || "?")
                .split(" ")
                .map((n: string) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </span>
          </div>
          <div>
            <p className="font-medium text-neutral-900">
              {row.driver?.fullName || "Unknown Driver"}
            </p>
            <p className="text-xs text-neutral-500">{row.driver?.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "plan",
      header: "Plan",
      render: (_: unknown, row: SubscriptionData) => (
        <div>
          <p className="font-medium text-neutral-900">
            {row.plan?.name || "Unknown Plan"}
          </p>
          <p className="text-xs text-neutral-500">
            {formatCurrency(row.plan?.price || 0)}
          </p>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (value: unknown) => {
        const { variant, label } = getStatusBadge(String(value));
        return <Badge variant={variant}>{label}</Badge>;
      },
    },
    {
      key: "autoRenew",
      header: "Auto-Renew",
      render: (value: unknown) => (
        <Badge variant={value ? "success" : "default"}>
          {value ? "On" : "Off"}
        </Badge>
      ),
    },
    {
      key: "startDate",
      header: "Start Date",
      sortable: true,
      render: (value: unknown) => formatDate(value as Date),
    },
    {
      key: "endDate",
      header: "End Date",
      sortable: true,
      render: (value: unknown) => formatDate(value as Date),
    },
    {
      key: "createdAt",
      header: "Created",
      sortable: true,
      render: (value: unknown) => formatDate(value as Date),
    },
  ];

  const handleBulkAction = (action: "APPROVE" | "REJECT") => {
    if (selectedIds.length === 0) return;
    bulkApproveMutation.mutate({ ids: selectedIds, action });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-neutral-900">
            Subscriptions
          </h2>
          <p className="text-neutral-500 mt-1">
            Manage driver subscription plans and approvals
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            leftIcon={RefreshCw}
            onClick={() => {
              statsQuery.refetch();
              subscriptionsQuery.refetch();
            }}
            isLoading={statsQuery.isFetching || subscriptionsQuery.isFetching}
          >
            Refresh
          </Button>
          <Link to="/admin/subscriptions/plans">
            <Button variant="primary" leftIcon={CreditCard}>
              Manage Plans
            </Button>
          </Link>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Subscriptions"
          value={stats?.totalSubscriptions ?? 0}
          subtitle={`${stats?.activeSubscriptions ?? 0} active`}
          icon={CreditCard}
          color="bg-blue-500"
        />
        <StatCard
          title="Pending Approval"
          value={stats?.pendingApproval ?? 0}
          subtitle="Awaiting review"
          icon={Clock}
          color="bg-amber-500"
        />
        <StatCard
          title="Monthly Revenue"
          value={formatCurrency(stats?.monthlyRevenue ?? 0)}
          subtitle={`Total: ${formatCurrency(stats?.totalRevenue ?? 0)}`}
          icon={DollarSign}
          color="bg-green-500"
        />
        <StatCard
          title="Active Plans"
          value={stats?.activePlansCount ?? 0}
          subtitle="Available to drivers"
          icon={Calendar}
          color="bg-purple-500"
        />
      </div>

      {/* Status breakdown */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
            <CheckCircle className="h-5 w-5 text-green-600 mx-auto mb-1" />
            <p className="text-lg font-semibold text-green-700">
              {stats.activeSubscriptions}
            </p>
            <p className="text-xs text-green-600">Active</p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center">
            <Clock className="h-5 w-5 text-amber-600 mx-auto mb-1" />
            <p className="text-lg font-semibold text-amber-700">
              {stats.pendingApproval}
            </p>
            <p className="text-xs text-amber-600">Pending</p>
          </div>
          <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-center">
            <Calendar className="h-5 w-5 text-neutral-600 mx-auto mb-1" />
            <p className="text-lg font-semibold text-neutral-700">
              {stats.expiredSubscriptions}
            </p>
            <p className="text-xs text-neutral-600">Expired</p>
          </div>
          <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-center">
            <XCircle className="h-5 w-5 text-neutral-600 mx-auto mb-1" />
            <p className="text-lg font-semibold text-neutral-700">
              {stats.cancelledSubscriptions}
            </p>
            <p className="text-xs text-neutral-600">Cancelled</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-center">
            <AlertCircle className="h-5 w-5 text-red-600 mx-auto mb-1" />
            <p className="text-lg font-semibold text-red-700">
              {stats.paymentFailedSubscriptions}
            </p>
            <p className="text-xs text-red-600">Payment Failed</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-center">
            <XCircle className="h-5 w-5 text-red-600 mx-auto mb-1" />
            <p className="text-lg font-semibold text-red-700">
              {stats.rejectedSubscriptions}
            </p>
            <p className="text-xs text-red-600">Rejected</p>
          </div>
        </div>
      )}

      {/* Filters and Actions */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-4 items-center flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by driver name or email..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-neutral-200 text-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="select-custom py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="PENDING_APPROVAL">Pending Approval</option>
            <option value="EXPIRED">Expired</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="PAYMENT_FAILED">Payment Failed</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        {/* Bulk Actions */}
        {selectedIds.length > 0 && (
          <div className="flex gap-2 items-center">
            <span className="text-sm text-neutral-600">
              {selectedIds.length} selected
            </span>
            <Button
              variant="primary"
              size="sm"
              leftIcon={CheckCircle}
              onClick={() => handleBulkAction("APPROVE")}
              isLoading={bulkApproveMutation.isPending}
            >
              Approve
            </Button>
            <Button
              variant="danger"
              size="sm"
              leftIcon={XCircle}
              onClick={() => handleBulkAction("REJECT")}
              isLoading={bulkApproveMutation.isPending}
            >
              Reject
            </Button>
          </div>
        )}
      </div>

      {/* Subscriptions Table */}
      {subscriptions.length === 0 && !subscriptionsQuery.isLoading ? (
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100">
          <EmptyState
            icon={CreditCard}
            title="No subscriptions found"
            description={
              searchQuery || statusFilter
                ? "No subscriptions match your filters."
                : "No driver subscriptions have been created yet."
            }
          />
        </div>
      ) : (
        <>
          <DataTable
            data={subscriptions}
            columns={columns}
            keyField="id"
            isLoading={subscriptionsQuery.isLoading}
            emptyMessage="No subscriptions match your criteria"
            onRowClick={(subscription) => {
              console.log("View subscription:", subscription.id);
            }}
          />

          {/* Pagination */}
          {total > limit && (
            <div className="flex justify-center gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <span className="px-4 py-2 text-sm text-neutral-600">
                Page {page} of {Math.ceil(total / limit)}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= Math.ceil(total / limit)}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
