/**
 * Admin Wallet Page
 *
 * Wallet transaction overview using real API data.
 * Uses the wallet transactions endpoint when available.
 */

import type {
  PaymentResponseDto,
  PaymentResponseDtoStatusEnum,
  PaymentResponseDtoTypeEnum,
} from "@brocabs/client";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Download,
  RefreshCw,
  Wallet,
} from "lucide-react";

import { Badge, Button, DataTable, EmptyState } from "../../../components/ui";
import { walletApi } from "../../../lib/api";
import { formatCurrency, formatDateTime } from "../../../lib/format";

export const Route = createFileRoute("/admin/wallet/")({
  component: AdminWalletPage,
});

/**
 * Extended payment type for DataTable compatibility
 */
type WalletTransaction = PaymentResponseDto & { [key: string]: unknown };

/**
 * Fetch wallet transactions from API
 */
async function fetchWalletTransactions(): Promise<WalletTransaction[]> {
  try {
    const response = await walletApi.walletControllerGetTransactionHistory({
      limit: 100,
      offset: 0,
    });
    // Return the API response data directly
    return response.data as WalletTransaction[];
  } catch (error) {
    // Log error for debugging purposes
    console.error("Failed to fetch wallet transactions:", error);
    // Return empty array if not authenticated or API not available
    return [];
  }
}

/**
 * Get transaction type info
 */
function getTypeInfo(type: PaymentResponseDtoTypeEnum): {
  label: string;
  variant: "success" | "danger" | "warning" | "default";
  icon: React.ComponentType<{ className?: string }>;
} {
  switch (type) {
    case "DEPOSIT":
      return { label: "Deposit", variant: "success", icon: ArrowDownLeft };
    case "PAYMENT":
      return { label: "Payment", variant: "danger", icon: ArrowUpRight };
    case "REFUND":
      return { label: "Refund", variant: "warning", icon: ArrowDownLeft };
    case "WITHDRAWAL":
      return { label: "Withdrawal", variant: "default", icon: ArrowUpRight };
    default:
      return { label: type, variant: "default", icon: Wallet };
  }
}

/**
 * Get status badge variant
 */
function getStatusVariant(
  status: PaymentResponseDtoStatusEnum,
): "success" | "warning" | "danger" | "default" {
  switch (status) {
    case "COMPLETED":
      return "success";
    case "PENDING":
      return "warning";
    case "FAILED":
      return "danger";
    case "REFUNDED":
      return "warning";
    default:
      return "default";
  }
}

function AdminWalletPage() {
  const transactionsQuery = useQuery({
    queryKey: ["admin", "wallet", "transactions"],
    queryFn: fetchWalletTransactions,
  });

  const transactions = transactionsQuery.data ?? [];

  // Calculate stats from transactions
  const totalRecharges = transactions
    .filter((t) => t.type === "DEPOSIT")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const totalPayments = transactions
    .filter((t) => t.type === "PAYMENT" || t.type === "WITHDRAWAL")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const columns = [
    {
      key: "reference",
      header: "Reference",
      render: (value: unknown) => (
        <span className="font-mono text-sm text-neutral-600">
          {String(value) || "—"}
        </span>
      ),
    },
    {
      key: "type",
      header: "Type",
      render: (value: unknown) => {
        const info = getTypeInfo(value as PaymentResponseDtoTypeEnum);
        const Icon = info.icon;
        return (
          <div className="flex items-center gap-2">
            <div
              className={`p-1 rounded ${
                info.variant === "success"
                  ? "bg-green-100"
                  : info.variant === "danger"
                    ? "bg-red-100"
                    : info.variant === "warning"
                      ? "bg-amber-100"
                      : "bg-neutral-100"
              }`}
            >
              <Icon
                className={`h-3.5 w-3.5 ${
                  info.variant === "success"
                    ? "text-green-600"
                    : info.variant === "danger"
                      ? "text-red-600"
                      : info.variant === "warning"
                        ? "text-amber-600"
                        : "text-neutral-600"
                }`}
              />
            </div>
            <span className="text-sm">{info.label}</span>
          </div>
        );
      },
    },
    {
      key: "amount",
      header: "Amount",
      sortable: true,
      align: "right" as const,
      render: (value: unknown, row: WalletTransaction) => {
        const isNegative = row.type === "PAYMENT" || row.type === "WITHDRAWAL";
        return (
          <span
            className={`font-medium ${
              isNegative ? "text-red-600" : "text-green-600"
            }`}
          >
            {isNegative ? "-" : "+"}
            {formatCurrency(Math.abs(Number(value)))}
          </span>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      render: (value: unknown) => (
        <Badge
          variant={getStatusVariant(value as PaymentResponseDtoStatusEnum)}
        >
          {String(value)}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      header: "Date",
      sortable: true,
      render: (value: unknown) => formatDateTime(value),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-neutral-900">
            Wallet Transactions
          </h2>
          <p className="text-neutral-500 mt-1">
            View wallet activity and transactions.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            leftIcon={RefreshCw}
            onClick={() => transactionsQuery.refetch()}
            isLoading={transactionsQuery.isFetching}
          >
            Refresh
          </Button>
          <Button variant="outline" leftIcon={Download}>
            Export
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-xl">
              <ArrowDownLeft className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Total Recharges</p>
              <p className="text-xl font-bold text-neutral-900">
                {formatCurrency(totalRecharges)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-xl">
              <ArrowUpRight className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Total Payments</p>
              <p className="text-xl font-bold text-neutral-900">
                {formatCurrency(totalPayments)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 rounded-xl">
              <Wallet className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Transactions</p>
              <p className="text-xl font-bold text-neutral-900">
                {transactions.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Table or Empty State */}
      {transactions.length === 0 && !transactionsQuery.isLoading ? (
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100">
          <EmptyState
            icon={Wallet}
            title="No transactions found"
            description="Wallet transactions will appear here once users start making transactions. This uses the authenticated user's wallet data."
          />
        </div>
      ) : (
        <DataTable
          data={transactions}
          columns={columns}
          keyField="id"
          isLoading={transactionsQuery.isLoading}
          emptyMessage="No transactions found"
        />
      )}
    </div>
  );
}
