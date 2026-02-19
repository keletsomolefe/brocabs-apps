/**
 * Admin Rides Page
 *
 * Ride history and monitoring interface with real API integration.
 */

import type {
  AdminRideListResponseDto,
  AdminRideResponseDto,
} from "@brocabs/client";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Calendar, Car, RefreshCw, Search } from "lucide-react";
import { useState } from "react";

import { Badge, Button, DataTable, EmptyState } from "../../../components/ui";
import { adminApi } from "../../../lib/api";

export const Route = createFileRoute("/admin/rides/")({
  component: AdminRidesPage,
});

/**
 * Extended ride type for DataTable compatibility
 */
type RideData = AdminRideResponseDto & { [key: string]: unknown };

/**
 * Format currency in ZAR
 */
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
  }).format(amount);
}

/**
 * Get ride status badge variant
 */
function getRideStatusVariant(
  status?: string,
): "default" | "primary" | "success" | "warning" | "danger" {
  switch (status) {
    case "requested":
      return "warning";
    case "accepted":
    case "driver_arrived":
    case "in_progress":
      return "primary";
    case "completed":
      return "success";
    case "cancelled":
      return "danger";
    default:
      return "default";
  }
}

/**
 * Get payment status badge variant
 */
function getPaymentStatusVariant(
  status?: string,
): "success" | "warning" | "danger" {
  switch (status) {
    case "paid":
      return "success";
    case "pending":
      return "warning";
    case "failed":
    case "refunded":
      return "danger";
    default:
      return "warning";
  }
}

/**
 * Format status label
 */
function formatStatus(status?: string): string {
  if (!status) return "Unknown";
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function AdminRidesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const limit = 20;

  const ridesQuery = useQuery<AdminRideListResponseDto>({
    queryKey: ["admin", "rides", page, searchQuery, statusFilter],
    queryFn: async () => {
      const response = await adminApi.adminControllerListRides({
        page: String(page),
        limit: String(limit),
        search: searchQuery || undefined,
        rideStatus: statusFilter !== "all" ? (statusFilter as any) : undefined,
        sortBy: "createdAt",
        sortOrder: "DESC",
      });
      return response;
    },
  });

  const rides = (ridesQuery.data?.data ?? []) as RideData[];
  const total = ridesQuery.data?.total ?? 0;

  const columns = [
    {
      key: "id",
      header: "Ride ID",
      render: (value: unknown) => (
        <span className="font-mono text-sm">
          {String(value).slice(0, 8)}...
        </span>
      ),
    },
    {
      key: "riderName",
      header: "Rider",
      render: (value: unknown, row: RideData) => (
        <div>
          <p className="font-medium text-neutral-900">
            {String(value || "Unknown")}
          </p>
          <p className="text-xs text-neutral-500 truncate max-w-[200px]">
            {row.pickupAddress || "N/A"}
          </p>
        </div>
      ),
    },
    {
      key: "driverName",
      header: "Driver",
      render: (value: unknown) => (
        <span className={!value ? "text-neutral-400" : ""}>
          {String(value || "Unassigned")}
        </span>
      ),
    },
    {
      key: "rideStatus",
      header: "Status",
      render: (value: unknown) => (
        <Badge variant={getRideStatusVariant(value as string)}>
          {formatStatus(value as string)}
        </Badge>
      ),
    },
    {
      key: "actualFare",
      header: "Fare",
      sortable: true,
      render: (value: unknown, row: RideData) => (
        <span className="font-medium">
          {formatCurrency(Number(value ?? row.estimatedFare ?? 0))}
        </span>
      ),
    },
    {
      key: "paymentStatus",
      header: "Payment",
      render: (value: unknown) => (
        <Badge variant={getPaymentStatusVariant(value as string)}>
          {formatStatus(value as string)}
        </Badge>
      ),
    },
    {
      key: "distanceKm",
      header: "Distance",
      render: (value: unknown) => `${Number(value ?? 0).toFixed(1)} km`,
    },
    {
      key: "createdAt",
      header: "Date",
      sortable: true,
      render: (value: unknown) =>
        value
          ? new Date(String(value)).toLocaleDateString("en-ZA", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "N/A",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-neutral-900">Rides</h2>
          <p className="text-neutral-500 mt-1">
            Monitor all ride requests and history. Total: {total}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            leftIcon={RefreshCw}
            onClick={() => ridesQuery.refetch()}
            isLoading={ridesQuery.isFetching}
          >
            Refresh
          </Button>
          <Button variant="outline" leftIcon={Calendar}>
            Date Range
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by rider, driver, or address..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-neutral-200 text-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="select-custom py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
        >
          <option value="all">All Status</option>
          <option value="requested">Requested</option>
          <option value="accepted">Accepted</option>
          <option value="driver_arrived">Driver Arrived</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Rides Table or Empty State */}
      {rides.length === 0 && !ridesQuery.isLoading ? (
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100">
          <EmptyState
            icon={Car}
            title="No rides found"
            description={
              searchQuery || statusFilter !== "all"
                ? "No rides match your filter criteria."
                : "No rides have been created yet."
            }
          />
        </div>
      ) : (
        <>
          <DataTable
            data={rides}
            columns={columns}
            keyField="id"
            isLoading={ridesQuery.isLoading}
            emptyMessage="No rides match your search"
            onRowClick={(ride) => {
              console.log("View ride:", ride.id);
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
