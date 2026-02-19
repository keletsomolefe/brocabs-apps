/**
 * Admin Wallets Page
 *
 * Wallet management interface with real API integration.
 */

import type {
  AdminWalletListResponseDto,
  AdminWalletResponseDto,
} from "@brocabs/client";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { RefreshCw, Search, Wallet } from "lucide-react";
import { useState } from "react";

import {
  Badge,
  Button,
  DataTable,
  EmptyState,
  Input,
} from "../../../components/ui";
import { adminApi } from "../../../lib/api";

export const Route = createFileRoute("/admin/wallets/")({
  component: AdminWalletsPage,
});

/**
 * Extended wallet type for DataTable compatibility
 */
type WalletData = AdminWalletResponseDto & { [key: string]: unknown };

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
 * Get user type badge variant
 */
function getUserTypeVariant(
  userType?: string,
): "default" | "primary" | "success" {
  switch (userType) {
    case "rider":
      return "primary";
    case "driver":
      return "success";
    default:
      return "default";
  }
}

function AdminWalletsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [userTypeFilter, setUserTypeFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const limit = 20;

  const walletsQuery = useQuery<AdminWalletListResponseDto>({
    queryKey: ["admin", "wallets", page, searchQuery, userTypeFilter],
    queryFn: async () => {
      const response = await adminApi.adminControllerListWallets({
        page: String(page),
        limit: String(limit),
        search: searchQuery || undefined,
        userType:
          userTypeFilter !== "all" ? (userTypeFilter as any) : undefined,
        sortBy: "balance",
        sortOrder: "DESC",
      });
      return response;
    },
  });

  const wallets = (walletsQuery.data?.data ?? []) as WalletData[];
  const total = walletsQuery.data?.total ?? 0;

  const columns = [
    {
      key: "userName",
      header: "User",
      render: (value: unknown, row: WalletData) => (
        <div>
          <p className="font-medium text-neutral-900">
            {String(value || "Unknown")}
          </p>
          <p className="text-xs text-neutral-500">{row.userEmail || "N/A"}</p>
        </div>
      ),
    },
    {
      key: "userPhoneNumber",
      header: "Phone",
      render: (value: unknown) => (
        <span className="text-sm text-neutral-600">
          {String(value || "N/A")}
        </span>
      ),
    },
    {
      key: "userType",
      header: "Type",
      render: (value: unknown) => (
        <Badge variant={getUserTypeVariant(value as string)}>
          {String(value || "unknown")
            .charAt(0)
            .toUpperCase() + String(value || "unknown").slice(1)}
        </Badge>
      ),
    },
    {
      key: "balance",
      header: "Balance",
      sortable: true,
      render: (value: unknown) => (
        <span className="font-medium text-neutral-900">
          {formatCurrency(Number(value ?? 0))}
        </span>
      ),
    },
    {
      key: "userIsActive",
      header: "Status",
      render: (value: unknown) => (
        <Badge variant={value ? "success" : "danger"}>
          {value ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      key: "updatedAt",
      header: "Last Updated",
      render: (value: unknown) => (
        <span className="text-sm text-neutral-600">
          {value ? new Date(String(value)).toLocaleDateString() : "N/A"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Wallets</h1>
          <p className="text-neutral-500 mt-1">
            Manage user wallet balances and transactions
          </p>
        </div>
        <Button
          variant="outline"
          leftIcon={RefreshCw}
          onClick={() => walletsQuery.refetch()}
          isLoading={walletsQuery.isFetching}
        >
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-neutral-200 p-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="flex-1 min-w-64">
            <Input
              placeholder="Search by name, email, or phone..."
              leftIcon={Search}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
            />
          </div>

          {/* User Type Filter */}
          <select
            className="select-custom py-2.5 rounded-xl border border-neutral-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={userTypeFilter}
            onChange={(e) => {
              setUserTypeFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">All Users</option>
            <option value="rider">Riders</option>
            <option value="driver">Drivers</option>
          </select>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-neutral-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50">
              <Wallet className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Total Wallets</p>
              <p className="text-xl font-semibold text-neutral-900">{total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-50">
              <Wallet className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Total Balance</p>
              <p className="text-xl font-semibold text-neutral-900">
                {formatCurrency(
                  wallets.reduce((sum, w) => sum + Number(w.balance || 0), 0),
                )}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-50">
              <Wallet className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Avg Balance</p>
              <p className="text-xl font-semibold text-neutral-900">
                {formatCurrency(
                  wallets.length > 0
                    ? wallets.reduce(
                        (sum, w) => sum + Number(w.balance || 0),
                        0,
                      ) / wallets.length
                    : 0,
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Wallets Table */}
      {walletsQuery.isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
        </div>
      ) : wallets.length === 0 ? (
        <EmptyState
          icon={Wallet}
          title="No wallets found"
          description={
            searchQuery || userTypeFilter !== "all"
              ? "Try adjusting your filters"
              : "No user wallets have been created yet"
          }
        />
      ) : (
        <DataTable
          columns={columns}
          data={wallets}
          keyField="id"
          onRowClick={(wallet) => {
            // TODO: Navigate to wallet details
            console.log("Wallet clicked:", wallet);
          }}
        />
      )}

      {/* Pagination */}
      {total > limit && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-neutral-500">
            Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)}{" "}
            of {total} wallets
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page * limit >= total}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
