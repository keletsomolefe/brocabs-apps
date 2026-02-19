/**
 * Admin Drivers Page
 *
 * Driver management interface with driver application data.
 * Now shows applications with vehicle, payment, and zone information.
 */

import type { DriverApplicationListResponseDto } from "@brocabs/client";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Car, RefreshCw, Search } from "lucide-react";
import { useState } from "react";

import { Badge, Button, DataTable, EmptyState } from "../../../components/ui";
import { adminApi } from "../../../lib/api";

export const Route = createFileRoute("/admin/drivers/")({
  component: AdminDriversPage,
});

/**
 * Extended driver type for DataTable compatibility
 */
type DriverData = {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  avatarUrl?: string | null;
  bankDetails?: any;
  vehicle?: {
    make: string;
    model: string;
    colour: string;
    registrationNumber: string;
    exteriorImageUrls: string[];
    interiorImageUrls: string[];
  };
  documents: any[];
  payment?: {
    amount: number;
    status: string;
    paymentMethod: string;
    reference: string;
    paidAt: Date;
  };
  operatingZones: Array<{
    id: string;
    name: string;
    description: string;
    isActive: boolean;
  }>;
  status: string;
  submittedAt: Date;
  [key: string]: unknown;
};

/**
 * Get status badge variant
 */
function getStatusVariant(
  status?: string,
): "success" | "default" | "warning" | "error" {
  switch (status) {
    case "APPROVED":
      return "success";
    case "REVIEW_PENDING":
      return "warning";
    case "PENDING":
      return "default";
    case "REJECTED":
      return "error";
    default:
      return "default";
  }
}

/**
 * Format status label
 */
function formatStatus(status?: string): string {
  switch (status) {
    case "APPROVED":
      return "Approved";
    case "REVIEW_PENDING":
      return "Pending Review";
    case "PENDING":
      return "Incomplete";
    case "REJECTED":
      return "Rejected";
    default:
      return status || "Unknown";
  }
}

function AdminDriversPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("REVIEW_PENDING");
  const [page, setPage] = useState(1);
  const limit = 20;

  const driversQuery = useQuery<DriverApplicationListResponseDto>({
    queryKey: ["admin", "driver-applications", page, searchQuery, statusFilter],
    queryFn: async () => {
      const response = await adminApi.adminControllerListDriverApplications({
        page: String(page),
        limit: String(limit),
        search: searchQuery || undefined,
        status: statusFilter !== "all" ? (statusFilter as any) : undefined,
        sortBy: "submittedAt",
        sortOrder: "DESC",
      });
      return response;
    },
  });

  const drivers = (driversQuery.data?.data ?? []) as DriverData[];
  const total = driversQuery.data?.total ?? 0;

  const columns = [
    {
      key: "fullName",
      header: "Driver",
      sortable: true,
      render: (value: unknown, row: DriverData) => (
        <div className="flex items-center gap-3">
          <div className="relative">
            {row.avatarUrl ? (
              <img
                src={row.avatarUrl}
                alt={String(value || "")}
                className="w-9 h-9 rounded-full object-cover"
              />
            ) : (
              <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-primary-700">
                  {String(value || "")
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2) || "?"}
                </span>
              </div>
            )}
          </div>
          <div>
            <p className="font-medium text-neutral-900">
              {String(value || "Unknown")}
            </p>
            <p className="text-xs text-neutral-500">
              {row.vehicle
                ? `${row.vehicle.make} ${row.vehicle.model}`
                : "No vehicle"}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "phoneNumber",
      header: "Contact",
      render: (value: unknown, row: DriverData) => (
        <div>
          <p className="text-sm text-neutral-900">{String(value || "N/A")}</p>
          <p className="text-xs text-neutral-500">{row.email}</p>
        </div>
      ),
    },
    {
      key: "vehicle",
      header: "Vehicle",
      render: (value: unknown, row: DriverData) =>
        row.vehicle ? (
          <div>
            <p className="text-sm text-neutral-900 font-medium">
              {row.vehicle.make} {row.vehicle.model}
            </p>
            <p className="text-xs text-neutral-500">
              {row.vehicle.colour} - {row.vehicle.registrationNumber}
            </p>
          </div>
        ) : (
          <span className="text-xs text-neutral-400">Not provided</span>
        ),
    },
    {
      key: "operatingZones",
      header: "Service Areas",
      render: (value: unknown, row: DriverData) => {
        const zones = row.operatingZones || [];
        if (zones.length === 0) {
          return <span className="text-xs text-neutral-400">None</span>;
        }
        if (zones.length === 1) {
          return (
            <span className="text-sm text-neutral-900">{zones[0].name}</span>
          );
        }
        return (
          <div className="flex flex-wrap gap-1">
            {zones.slice(0, 2).map((zone) => (
              <span
                key={zone.id}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800"
              >
                {zone.name}
              </span>
            ))}
            {zones.length > 2 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-neutral-100 text-neutral-600">
                +{zones.length - 2}
              </span>
            )}
          </div>
        );
      },
    },
    {
      key: "payment",
      header: "Payment",
      render: (value: unknown, row: DriverData) =>
        row.payment ? (
          <div>
            <p className="text-sm text-neutral-900 font-medium">
              R {row.payment.amount.toFixed(2)}
            </p>
            <Badge
              variant={
                row.payment.status === "COMPLETED"
                  ? "success"
                  : row.payment.status === "PENDING"
                    ? "warning"
                    : "error"
              }
            >
              {row.payment.status}
            </Badge>
          </div>
        ) : (
          <Badge variant="error">Not Paid</Badge>
        ),
    },
    {
      key: "status",
      header: "Status",
      render: (value: unknown) => (
        <Badge variant={getStatusVariant(value as string)}>
          {formatStatus(value as string)}
        </Badge>
      ),
    },
    {
      key: "submittedAt",
      header: "Submitted",
      sortable: true,
      render: (value: unknown) =>
        value
          ? new Date(String(value)).toLocaleDateString("en-ZA", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "N/A",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-neutral-900">
            Driver Applications
          </h2>
          <p className="text-neutral-500 mt-1">
            Review and manage driver onboarding applications. Total: {total}
          </p>
        </div>
        <Button
          variant="outline"
          leftIcon={RefreshCw}
          onClick={() => driversQuery.refetch()}
          isLoading={driversQuery.isFetching}
        >
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-neutral-200 text-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
          />
        </div>
        <select
          title="Filter by status"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="select-custom py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 min-w-[180px]"
        >
          <option value="all">All Statuses</option>
          <option value="PENDING">Incomplete</option>
          <option value="REVIEW_PENDING">Pending Review</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {/* Drivers Table or Empty State */}
      {drivers.length === 0 && !driversQuery.isLoading ? (
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100">
          <EmptyState
            icon={Car}
            title="No driver applications found"
            description={
              searchQuery || statusFilter !== "REVIEW_PENDING"
                ? "No applications match your filter criteria."
                : "No driver applications have been submitted yet."
            }
          />
        </div>
      ) : (
        <>
          <DataTable
            data={drivers}
            columns={columns}
            keyField="id"
            isLoading={driversQuery.isLoading}
            emptyMessage="No applications match your search"
            onRowClick={(driver) => {
              navigate({
                to: "/admin/drivers/$driverId",
                params: { driverId: String(driver.id) },
              });
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
